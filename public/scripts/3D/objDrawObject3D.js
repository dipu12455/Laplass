import * as LP from '../LPEngine/LPEngine.js';
import { fillTriangle, getTriangleNormal, multiplyTriangleWithMatrix, sortTrianglesByDepth, translateTriangle } from './modules/LPDraw3D.js';
import { getProjectionMatrix, getRotationMatrixX, getRotationMatrixY, getRotationMatrixZ, mat4x4 } from './modules/LPMatrix4x4.js';
import { v2Minusv1_3D, dotProduct_3D, getUnitVector_3D } from './modules/LPVector3D.js';
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
        this.screenWidth = (640 - 640 / 2) / 20;
        this.screenHeight = (480 / 2 - 480) / 20;
        this.aspectRatio = this.screenHeight / this.screenWidth;
        this.fieldOfView = 90;
        this.zNear = 0.1;
        this.zFar = 1000;

        this.matRotX = new mat4x4();
        this.matRotY = new mat4x4();
        this.matRotZ = new mat4x4();
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
        this.elapsed = 0;

        this.vCamera = [0, 0, 0];

        this.init = () => {
            //printMesh(mesh);
        };

        this.update = (_delta) => {
            this.elapsed += _delta;

            //update theta
            var theta = this.elapsed * 0.5;
            this.matRotX = getRotationMatrixX(180);
            this.matRotY = getRotationMatrixY(theta);
            this.matRotZ = getRotationMatrixZ(0);

            //oscillate the Y
            var animate = Math.sin(this.elapsed / 50.0);
            //this.Y = this.Y + (animate * 0.01);
            //this.X = this.X + (animate * 0.01);
            //this.Z = this.Z + (animate * 0.01);
        };

        this.draw = () => {
            LP.draw_text(`elapsed: ${this.elapsed}`, [-13, 10], 0.5, 0x0000ff);
            var printed = false;
            var x = this.X;
            var y = this.Y;
            var z = this.Z;

            var unsortedTrianglesList = new LP.LPList();

            let i = 0;
            //try block because mesh might not have loaded yet, so it will just fail but program will continue
            var selectedMesh = mesh;
            for (i = 0; i < selectedMesh.triangles.length; i += 1) {
                const tri = selectedMesh.triangles[i];

                var triRotatedX = multiplyTriangleWithMatrix(tri, this.matRotX);
                var triRotatedXY = multiplyTriangleWithMatrix(triRotatedX, this.matRotY);
                var triRotatedXYZ = multiplyTriangleWithMatrix(triRotatedXY, this.matRotZ);

                var amount = 150;
                var triTranslated = translateTriangle(triRotatedXYZ, [0, 0, amount]); //just to put it a certain distance away from the camera

                triTranslated = translateTriangle(triTranslated, [x, y, z]); //after its placed a certain distance away, just move it around that place

                var normal = getTriangleNormal(triTranslated);

                var vector1 = v2Minusv1_3D(this.vCamera, triTranslated.v1);
                var dotProduct = dotProduct_3D(normal, vector1);

                //only draw triangle if it is unobstructed
                //if (normal[2] < 0) {
                if (dotProduct < 0) {
                    //illumination (of course, only if you can see it)
                    const light_direction = [0, 0, -1];
                    const vU_light_direction = getUnitVector_3D(light_direction);

                    //see how similar the normal is to the light direction
                    var dotProduct2 = dotProduct_3D(normal, vU_light_direction);
                    //dotProduct2 is already a value between 0 and 1, because it is the dot product of two unit vectors
                    //use this dotproduct2 value to input rbg between 0-1
                    var color = LP.rgbToHex(0, dotProduct2, dotProduct2); //just green

                    //get the projection matrix
                    var matProj = getProjectionMatrix(this.aspectRatio, this.fieldOfView, this.zNear, this.zFar);
                    var triProjected = multiplyTriangleWithMatrix(triTranslated, matProj);

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


        }
    }
}