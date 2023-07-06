import * as LP from '../LPEngine/LPEngine.js';
import { fillTriangle, getTriangleNormal, multiplyTriangleWithMatrix, sortTrianglesByDepth } from './modules/LPDraw3D.js';
import { getMatrixQuickInverse, getPointAtMatrix, getProjectionMatrix, getRotationMatrixX, getRotationMatrixY, getRotationMatrixZ, getTranslationMatrix, makeIdentityMatrix, mat4x4, matrixMultiMatrix } from './modules/LPMatrix4x4.js';
import { v2Minusv1_3D, dotProduct_3D, getUnitVector_3D, vDivScalar_3D, v1Plusv2_3D } from './modules/LPVector3D.js';
import { mesh } from './3DmodelResource.js';
import { moveTriangleToScreen } from './modules/LPDraw3D.js';

export class objDrawObject3D extends LP.LPGameObject {
    constructor() {
        super();

        //get the aspect ratio of the screen
        //screenWidth and height dimensions need to be converted to worldOring of LPE coordinate system
        /* this.screenDimensions = screenCoordtoWorldCoord([640, 480]);
        this.screenHeight = this.screenDimensions[1];
        this.screenWidth = this.screenDimensions[0]; */

        //hardcoding this because these screenCoordtoWorldCoord functions is running before LPE initializes
        this.elapsed = 0;
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
        this.matWorld = new mat4x4();

        this.matView = new mat4x4();

        this.screenWidth = (640 - 640 / 2) / 20;
        this.screenHeight = (480 / 2 - 480) / 20;
        this.aspectRatio = this.screenHeight / this.screenWidth;
        this.fieldOfView = 90;
        this.zNear = 0.1;
        this.zFar = 1000;
        this.matProj = new mat4x4();

        this.vCamera = [0, 0, 0];
        this.vLookDir = [0, 0, 1];

        this.init = () => {
            this.matProj = getProjectionMatrix(this.aspectRatio, this.fieldOfView, this.zNear, this.zFar);

        };

        this.update = (_delta) => {
            this.checkEvents();
            this.elapsed += _delta;

            //update theta
            var theta = this.elapsed * 0.5;
            var matRotX = getRotationMatrixX(0);
            var matRotY = getRotationMatrixY(theta);
            var matRotZ = getRotationMatrixZ(0);

            //oscillate the Y
            var animate = Math.sin(this.elapsed / 50.0);
            this.X = 0;
            this.Y = 0;
            this.Z = 0;
            var matTrans = getTranslationMatrix(this.X, this.Y, 5 + this.Z); //moving the mesh a little into the distance

            this.matWorld = makeIdentityMatrix();
            this.matWorld = matrixMultiMatrix(matRotX, matRotY);
            this.matWorld = matrixMultiMatrix(this.matWorld, matRotZ);
            this.matWorld = matrixMultiMatrix(this.matWorld, matTrans);

            var vUp = [0, 1, 0];
            var vTarget = v1Plusv2_3D(this.vCamera, this.vLookDir);
            var matCamera = getPointAtMatrix(this.vCamera, vTarget, vUp);
            //now make the view matrix from camera
            this.matView = getMatrixQuickInverse(matCamera);
        };

        this.draw = () => {
            LP.draw_text(`elapsed: ${this.elapsed}`, [-13, 10], 0.5, 0x0000ff);

            var unsortedTrianglesList = new LP.LPList();

            let i = 0;
            //try block because mesh might not have loaded yet, so it will just fail but program will continue
            var selectedMesh = mesh;
            for (i = 0; i < selectedMesh.triangles.length; i += 1) {
                const tri = selectedMesh.triangles[i];

                //transform triangle into world using worldMatrix
                var triTransformed = multiplyTriangleWithMatrix(tri, this.matWorld);

                var normal = getTriangleNormal(triTransformed);

                var vector1 = v2Minusv1_3D(this.vCamera, triTransformed.v1);
                var dotProduct = dotProduct_3D(normal, vector1);

                //only draw triangle if it is facing towards the camera
                if (dotProduct < 0) {
                    //illumination (of course, only if you can see it)
                    const light_direction = [0, 0, -1];
                    const vU_light_direction = getUnitVector_3D(light_direction);

                    //see how similar the normal is to the light direction
                    var dotProduct2 = dotProduct_3D(normal, vU_light_direction);
                    //dotProduct2 is already a value between 0 and 1, because it is the dot product of two unit vectors
                    //use this dotproduct2 value to input rbg between 0-1
                    var color = LP.rgbToHex(0, dotProduct2, dotProduct2); //just green

                    var triViewed = multiplyTriangleWithMatrix(triTransformed, this.matView);

                    //project the triangle into a 2D plane
                    var triProjected = multiplyTriangleWithMatrix(triViewed, this.matProj);

                    //this new way of multiplying triangles with matrices don't normalize the vectors of the triangles anymore,
                    //which is why projection takes up the whole screen. normalize them manually below
                    //divide each of the vertices by their corresponding w value
                    triProjected.v1 = vDivScalar_3D(triProjected.v1, triProjected.v1[3]);
                    triProjected.v2 = vDivScalar_3D(triProjected.v2, triProjected.v2[3]);
                    triProjected.v3 = vDivScalar_3D(triProjected.v3, triProjected.v3[3]);

                    //the div vector function returns a 3d vector from what was a 4-tuple vector
                    //and here onwards there is now w tuple. FYI

                    triProjected = moveTriangleToScreen(triProjected, 0, this.screenWidth, this.screenHeight);

                    //store this finished triangle into the unsorted list, collect all triangles from this draw frame
                    triProjected.color = color;
                    unsortedTrianglesList.add(triProjected);
                };
            }

            //sort triangles here by depth, then draw them. This is the painter's algorithm
            //sorting them back to front, so the back triangles get drawn first
            var sortedTrianglesList = sortTrianglesByDepth(unsortedTrianglesList);
            i = 0;
            for (i = 0; i < sortedTrianglesList.getSize(); i += 1) {
                var tri = sortedTrianglesList.get(i);
                fillTriangle([tri.v1[0], tri.v1[1]],
                    [tri.v2[0], tri.v2[1]],
                    [tri.v3[0], tri.v3[1]], tri.color);
            }
            LP.setPrintConsole(false);
        }
    }
    checkEvents(){
        if (LP.isPEventFired(LP.evKeyW_p)) {
            this.vCamera[2] += 0.1;
        }
        if (LP.isPEventFired(LP.evKeyS_p)) {
            this.vCamera[2] -= 0.1;
        }
        if (LP.isPEventFired(LP.evKeyA_p)) {
            this.vCamera[0] -= 0.1;
        }
        if (LP.isPEventFired(LP.evKeyD_p)) {
            this.vCamera[0] += 0.1;
        }
        if (LP.isPEventFired(LP.evArrowUp_p)){
            this.vCamera[1] += 0.1;
        }
        if (LP.isPEventFired(LP.evArrowDown_p)){
            this.vCamera[1] -= 0.1;
        }
    }
}