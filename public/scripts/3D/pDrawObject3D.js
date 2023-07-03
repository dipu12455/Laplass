import * as LP from '../LPEngine/LPEngine.js';
import { screenCoordtoWorldCoord } from '../LPEngine/modules/LPEngineCore.js'; //directly importing because this function isnt meant to be used by client app
import { cube } from './cubeMesh.js';
import { Mesh, Triangle, copyTriangle, drawTriangle, mat4x4, multiplyMatrixVector } from './3DFunctionsAndClasses.js';
import { plane } from './planeMesh.js';


//variables needed throughout this file
var matProj, matRotX, matRotZ, matRotY;
var screenWidth;
var screenHeight;

var X = 0;
var Y = 0;
var Z = 0;

var init = () => {
    LP.makeVar(0); //(0) elapsed = 0
    LP.setPrintConsole(true);

    //get the aspect ratio of the screen
    //screenWidth and height dimensions need to be converted to worldOring of LPE coordinate system
    var screenDimensions = screenCoordtoWorldCoord([640, 480]);
    screenHeight = screenDimensions[1];
    screenWidth = screenDimensions[0];

    //projection matrix
    var aspectRatio = screenHeight / screenWidth;
    var fieldOfView = 90;
    var zNear = 0.1;
    var zFar = 1000;
    var F = 1 / Math.tan(LP.degtorad(fieldOfView * 0.5));
    var q = zFar / (zFar - zNear);

    matProj = new mat4x4();
    matProj.m[0][0] = aspectRatio * F;
    matProj.m[1][1] = F;
    matProj.m[2][2] = q;
    matProj.m[3][2] = -q * zNear;
    matProj.m[2][3] = 1;
    matProj.m[3][3] = 0;

    //rotation matrices
    matRotZ = new mat4x4();
    matRotX = new mat4x4();
    matRotY = new mat4x4();


};

var update = (_delta) => {
    var elapsed = LP.getVal(0);
    elapsed += _delta;

    //rotation matrices
    var theta = elapsed * 0.5;
    var theta2 = elapsed * 0.5;

    //rotation Z
    matRotZ.m[0][0] = Math.cos(LP.degtorad(theta));
    matRotZ.m[0][1] = Math.sin(LP.degtorad(theta));
    matRotZ.m[1][0] = -Math.sin(LP.degtorad(theta));
    matRotZ.m[1][1] = Math.cos(LP.degtorad(theta));
    matRotZ.m[2][2] = 1;
    matRotZ.m[3][3] = 1;

    //rotation X
    matRotX.m[0][0] = 1;
    matRotX.m[1][1] = Math.cos(LP.degtorad(theta * 0.5));
    matRotX.m[1][2] = Math.sin(LP.degtorad(theta * 0.5));
    matRotX.m[2][1] = -Math.sin(LP.degtorad(theta * 0.5));
    matRotX.m[2][2] = Math.cos(LP.degtorad(theta * 0.5));
    matRotX.m[3][3] = 1;

    //rotation Y
    matRotY.m[0][0] = Math.cos(LP.degtorad(theta * 0.5));
    matRotY.m[0][2] = Math.sin(LP.degtorad(theta * 0.5));
    matRotY.m[2][0] = -Math.sin(LP.degtorad(theta * 0.5));
    matRotY.m[1][1] = 1;
    matRotY.m[2][2] = Math.cos(LP.degtorad(theta * 0.5));
    matRotY.m[3][3] = 1;


    //oscillate the Y
    var animate = Math.sin(elapsed / 50.0);
    //Y = Y + (animate * 0.01);
    /* X = X + (animate * 0.01);
    Z = Z + (animate * 0.01); */

    LP.setVal(0, elapsed);
};

var draw = () => {
    var elapsed = LP.getVal(0);
    LP.draw_text(`elapsed: ${elapsed}`, [-13, 10], 0.5, 0x0000ff);

    let i = 0;
    var selectedMesh = cube;
    for (i = 0; i < selectedMesh.triangles.length; i += 1) {
        var tri = selectedMesh.triangles[i];

        var triRotatedZ = copyTriangle(tri);
        triRotatedZ.v1 = multiplyMatrixVector(tri.v1, matRotZ);
        triRotatedZ.v2 = multiplyMatrixVector(tri.v2, matRotZ);
        triRotatedZ.v3 = multiplyMatrixVector(tri.v3, matRotZ);

        var triRotatedZX = copyTriangle(triRotatedZ);
        triRotatedZX.v1 = multiplyMatrixVector(triRotatedZ.v1, matRotX);
        triRotatedZX.v2 = multiplyMatrixVector(triRotatedZ.v2, matRotX);
        triRotatedZX.v3 = multiplyMatrixVector(triRotatedZ.v3, matRotX);

        var triTranslated = copyTriangle(triRotatedZX); //this copies the reference not the object, we need to make a new object here
        var amount = 3;
        triTranslated.v1[2] += amount;
        triTranslated.v2[2] += amount;
        triTranslated.v3[2] += amount;

        //move them a little in the positive y
        triTranslated.v1[1] += Y;
        triTranslated.v2[1] += Y;
        triTranslated.v3[1] += Y;

        //move them in x axis
        triTranslated.v1[0] += X;
        triTranslated.v2[0] += X;
        triTranslated.v3[0] += X;

        //move them in z axis
        triTranslated.v1[2] += Z;
        triTranslated.v2[2] += Z;
        triTranslated.v3[2] += Z;

        var triProjected = new Triangle([
            multiplyMatrixVector(triTranslated.v1, matProj), //these multiplications yield a 3D vector each
            multiplyMatrixVector(triTranslated.v2, matProj),
            multiplyMatrixVector(triTranslated.v3, matProj)
        ]);

        //scale into view
        var scale = 0;
        triProjected.v1[0] += scale; triProjected.v1[1] += scale;
        triProjected.v2[0] += scale; triProjected.v2[1] += scale;
        triProjected.v3[0] += scale; triProjected.v3[1] += scale;

        //denormalizing into screen width and height
        triProjected.v1[0] *= -screenWidth;
        triProjected.v1[1] *= screenHeight;
        triProjected.v2[0] *= -screenWidth;
        triProjected.v2[1] *= screenHeight;
        triProjected.v3[0] *= -screenWidth;
        triProjected.v3[1] *= screenHeight;


        drawTriangle([triProjected.v1[0], triProjected.v1[1]],
            [triProjected.v2[0], triProjected.v2[1]],
            [triProjected.v3[0], triProjected.v3[1]]);
    }
}


export var pDrawObject3D = LP.addProperty(init, update, draw);
