import * as LP from '../LPEngine/LPEngine.js';
import { screenCoordtoWorldCoord } from '../LPEngine/modules/LPEngineCore.js'; //directly importing because this function isnt meant to be used by client app
import { cube } from './cubeMesh.js';
import { Mesh, Triangle, copyTriangle, dotProduct_3D, drawTriangle, getTriangleNormal, mat4x4, multiplyMatrixVector, multiplyTriangleWithMatrix, translateTriangle, v2Minusv1_3D } from './3DFunctionsAndClasses.js';
import { plane } from './planeMesh.js';

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

        this.matRotX = new mat4x4();
        this.matRotY = new mat4x4();
        this.matRotZ = new mat4x4();
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
        this.elapsed = 0;

        this.vCamera = [0,0,0];

        this.init = () => {
        };

        this.update = (_delta) => {
            this.elapsed += _delta;

            //update theta
            var theta = this.elapsed * 0.5;
            this.updateRotationMatrixX(theta);
            //this.updateRotationMatrixY(theta);
            this.updateRotationMatrixZ(theta);

            //oscillate the Y
            var animate = Math.sin(this.elapsed / 50.0);
            this.Y = this.Y + (animate * 0.01);
            this.X = this.X + (animate * 0.01);
            this.Z = this.Z + (animate * 0.01);
        };

        this.draw = () => {
            LP.draw_text(`elapsed: ${this.elapsed}`, [-13, 10], 0.5, 0x0000ff);
            var x = this.X;
            var y = this.Y;
            var z = this.Z;

            let i = 0;
            var selectedMesh = cube;
            for (i = 0; i < selectedMesh.triangles.length; i += 1) {
                const tri = selectedMesh.triangles[i];

                var triRotatedZ = multiplyTriangleWithMatrix(tri, this.matRotZ);
                var triRotatedZX = multiplyTriangleWithMatrix(triRotatedZ, this.matRotX);

                var amount = 3;
                var triTranslated = translateTriangle(triRotatedZX, [0, 0, amount]); //just to put it a certain distance away from the camera

                triTranslated = translateTriangle(triTranslated, [x, y, z]); //after its placed a certain distance away, just move it around that place

                var normal = getTriangleNormal(triTranslated);

                var vector1 = v2Minusv1_3D(this.vCamera, triTranslated.v1);
                var dotProduct = dotProduct_3D(normal, vector1);

                //only draw triangle if it is unobstructed
                //if (normal[2] < 0) {
                    if (dotProduct < 0) {
                    //get the projection matrix
                    var matProj = this.getProjectionMatrix();
                    var triProjected = multiplyTriangleWithMatrix(triTranslated, matProj);

                    triProjected = this.moveTriangleToScreen(triProjected, 0);

                    drawTriangle([triProjected.v1[0], triProjected.v1[1]],
                        [triProjected.v2[0], triProjected.v2[1]],
                        [triProjected.v3[0], triProjected.v3[1]]);
                };
            }

        }
    }
    updateRotationMatrixX(_theta) {
        //rotation X
        this.matRotX.m[0][0] = 1;
        this.matRotX.m[1][1] = Math.cos(LP.degtorad(_theta * 0.5));
        this.matRotX.m[1][2] = Math.sin(LP.degtorad(_theta * 0.5));
        this.matRotX.m[2][1] = -Math.sin(LP.degtorad(_theta * 0.5));
        this.matRotX.m[2][2] = Math.cos(LP.degtorad(_theta * 0.5));
        this.matRotX.m[3][3] = 1;
    }
    updateRotationMatrixY(_theta) {
        //rotation Y
        this.matRotY.m[0][0] = Math.cos(LP.degtorad(_theta * 0.5));
        this.matRotY.m[0][2] = Math.sin(LP.degtorad(_theta * 0.5));
        this.matRotY.m[2][0] = -Math.sin(LP.degtorad(_theta * 0.5));
        this.matRotY.m[1][1] = 1;
        this.matRotY.m[2][2] = Math.cos(LP.degtorad(_theta * 0.5));
        this.matRotY.m[3][3] = 1;
    }
    updateRotationMatrixZ(_theta) {
        this.matRotZ.m[0][0] = Math.cos(LP.degtorad(_theta));
        this.matRotZ.m[0][1] = Math.sin(LP.degtorad(_theta));
        this.matRotZ.m[1][0] = -Math.sin(LP.degtorad(_theta));
        this.matRotZ.m[1][1] = Math.cos(LP.degtorad(_theta));
        this.matRotZ.m[2][2] = 1;
        this.matRotZ.m[3][3] = 1;
    }
    getProjectionMatrix() {
        //projection matrix
        var aspectRatio = this.screenHeight / this.screenWidth;
        var fieldOfView = 90;
        var zNear = 0.1;
        var zFar = 1000;
        var F = 1 / Math.tan(LP.degtorad(fieldOfView * 0.5));
        var q = zFar / (zFar - zNear);

        var matProj = new mat4x4();
        matProj.m[0][0] = aspectRatio * F;
        matProj.m[1][1] = F;
        matProj.m[2][2] = q;
        matProj.m[3][2] = -q * zNear;
        matProj.m[2][3] = 1;
        matProj.m[3][3] = 0;

        return matProj;
    }
    moveTriangleToScreen(_triangle, _scale) {

        //scale into view, still normalized, scale = 0
        _triangle.v1[0] += _scale;
        _triangle.v1[1] += _scale;
        _triangle.v1[2] += _scale;
        _triangle.v2[0] += _scale;
        _triangle.v2[1] += _scale;
        _triangle.v2[2] += _scale;
        _triangle.v3[0] += _scale;
        _triangle.v3[1] += _scale;
        _triangle.v3[2] += _scale;

        //here we are denormalizing into screen width and height
        _triangle.v1[0] *= -this.screenWidth;
        _triangle.v1[1] *= this.screenHeight;
        _triangle.v2[0] *= -this.screenWidth;
        _triangle.v2[1] *= this.screenHeight;
        _triangle.v3[0] *= -this.screenWidth;
        _triangle.v3[1] *= this.screenHeight;

        return _triangle;
    }
}