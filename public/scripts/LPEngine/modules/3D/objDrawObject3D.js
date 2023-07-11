import * as LP from '../../LPEngine.js';
import { Plane, aspectRatio, clipTrianglesWithPlanes, fieldOfView, fillTriangle, getCamera, getMatView, getTriangleNormal, matProj, moveTriangleToScreen, multiplyTriangleWithMatrix, screenBottomPlane, screenHeight, screenLeftPlane, screenRightPlane, screenTopPlane, screenWidth, sortTrianglesByDepth, updateCamera, zFar, zNear, zNearPlane } from './LPDraw3D.js';
import { getMatrixQuickInverse, getPointAtMatrix, getProjectionMatrix, getRotationMatrixX, getRotationMatrixY, getRotationMatrixZ, getTranslationMatrix, makeIdentityMatrix, mat4x4, matrixMultiMatrix, multiplyMatrixVector } from './LPMatrix4x4.js';
import { dotProduct_3D, getUnitVector_3D, v1Plusv2_3D, v2Minusv1_3D, vDivScalar_3D } from './LPVector3D.js';
import { checkEvents } from './objDrawObjectFunctions.js';
import { mesh } from './3DmodelResource.js';

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
        this.Y = 1;
        this.Z = 0;
        this.rot = 0;
        this.rotY = 0;

        this.normalFlipped = true;

        this.matWorld = new mat4x4();

        this.init = () => {
        };

        this.update = (_delta) => {
            checkEvents(this); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.elapsed += _delta;

            //update theta
            var theta = this.elapsed * 0.5;
            var matRotX = getRotationMatrixX(0);
            var matRotY = getRotationMatrixY(this.rotY);
            var matRotZ = getRotationMatrixZ(this.rot);



            //oscillate the Y
            var animate = Math.sin(this.elapsed / 50.0);
            var matTrans = getTranslationMatrix(this.X, this.Y, 5 + this.Z); //moving the mesh a little into the distance

            this.matWorld = makeIdentityMatrix();
            this.matWorld = matrixMultiMatrix(matRotX, matRotY);
            this.matWorld = matrixMultiMatrix(this.matWorld, matRotZ);
            this.matWorld = matrixMultiMatrix(this.matWorld, matTrans);

            updateCamera();
        };

        this.draw = () => {
            LP.draw_text(`elapsed: ${this.elapsed}`, [-13, 10], 0.5, 0x0000ff);
            LP.draw_text(`yaw: ${this.yaw}`, [-13, 9], 0.5, 0x0000ff);

            var selectedMesh = mesh;

            //takes a mesh, returns with a list of triangles ready to be drawn on screen using 2D draw functions
            var unsortedTrianglesList = this.processTriangles(selectedMesh);

            //triangles from all meshes need to be collected into a list, depth sorted, then drawn onto the screen

            //sort triangles here by depth, then draw them.
            //sorting them back to front, so the back triangles get drawn first
            var sortedTrianglesList = sortTrianglesByDepth(unsortedTrianglesList);

            //loop through the list to draw each triangle
            var k = 0;
            for (k = 0; k < sortedTrianglesList.length; k += 1) {
                var tri = sortedTrianglesList[k];
                fillTriangle([tri.v1[0], tri.v1[1]],
                    [tri.v2[0], tri.v2[1]],
                    [tri.v3[0], tri.v3[1]], tri.color);
            }
        }
    }

    //processes the triangles of a mesh to be drawn on the screen, returns a list of unsorted triangles, to be sorted by depth order
    processTriangles(_mesh) {
        var unsortedTrianglesList = [];
        var i = 0;
        for (i = 0; i < _mesh.triangles.length; i += 1) {
            const tri = _mesh.triangles[i];

            //move triangle to world space
            var triTransformed = multiplyTriangleWithMatrix(tri, this.matWorld);

            //only draw triangle if it is facing towards the camera
            if (this.isTriangleFacingCamera(triTransformed, this.normalFlipped)) {
                //move triangle into view space
                var triViewed = multiplyTriangleWithMatrix(triTransformed, getMatView());

                //clip the triangles with the given clipping planes, this will return a list of possible sub-triangles
                var clippedTriangles = clipTrianglesWithPlanes([triViewed], [screenBottomPlane,
                screenTopPlane,
                screenLeftPlane,
                screenRightPlane,
                zNearPlane]);

                //this loop to iterate through the list of clipped triangles
                var j = 0;
                for (j = 0; j < clippedTriangles.length; j += 1) {
                    var color = this.getTriangleColorFromLighting(clippedTriangles[j], this.normalFlipped); /*call this function here,
                    lighting is calculated in this exact stage of transformation, after view space and before projection space*/

                    //move triangle to projection space
                    var triProjected = multiplyTriangleWithMatrix(clippedTriangles[j], matProj);

                    //normalize each vertex of triangle by dividing by w
                    triProjected.v1 = vDivScalar_3D(triProjected.v1, triProjected.v1[3]);
                    triProjected.v2 = vDivScalar_3D(triProjected.v2, triProjected.v2[3]);
                    triProjected.v3 = vDivScalar_3D(triProjected.v3, triProjected.v3[3]);

                    //denormalize the triangle to screen space
                    triProjected = moveTriangleToScreen(triProjected, 0, screenWidth, screenHeight);

                    //store this finished triangle into the unsorted list
                    triProjected.color = color;
                    unsortedTrianglesList.push(triProjected);
                }

            }
        }
        return unsortedTrianglesList;
    }
    isTriangleFacingCamera(_triangle, _normalFlipped) {
        var normal = getTriangleNormal(_triangle, _normalFlipped);
        var vector1 = v2Minusv1_3D(_triangle.v1, getCamera());
        var dotProduct = dotProduct_3D(normal, vector1);
        return dotProduct < 0; //if dp less that zero, the tri normal and cam dir vectors are facing each other, so the tri is facing the camera
    }
    //returns how much to shade this tri. lighting and shading color is fixed for now
    getTriangleColorFromLighting(_triangle, _normalFlipped) {
        //illumination (of course, only if you can see it)
        const light_direction = [0, 0, -1];
        const vU_light_direction = getUnitVector_3D(light_direction);

        //get normal of triangle
        var normal = getTriangleNormal(_triangle, _normalFlipped);

        //see how similar the normal is to the light direction
        var dotProduct2 = dotProduct_3D(normal, vU_light_direction);
        //dotProduct2 is already a value between 0 and 1, because it is the dot product of two unit vectors
        //use this dotproduct2 value to input rbg between 0-1
        return LP.rgbToHex(0, dotProduct2, dotProduct2); //just green
    }


}
