import * as LP from '../LPEngine/LPEngine.js';
import { screenCoordtoWorldCoord } from '../LPEngine/modules/LPEvents.js';

// the vectors will be of form [x,y,z], represented as arrays

function returnZeroMat4x4() {
    return [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
}
class mat4x4 {
    constructor() {
        this.m = returnZeroMat4x4();
    }
}

class Triangle {
    constructor(_vertices) { //the vertices is an array of vectors, and each vector is an array of three tuples [x,y,z]
        this.v1 = _vertices[0];
        this.v2 = _vertices[1];
        this.v3 = _vertices[2];
    }
}

class Mesh {
    constructor(_triangles) { //the input is an array of the instance of the class Triangle
        this.triangles = _triangles;
    }
}

//variables needed throughout this file
var cube;
var matProj, matRotX, matRotZ;
var screenWidth;
var screenHeight;

var init = () => {
    LP.makeVar(0); //(0) elapsed = 0
    LP.setPrintConsole(true);

    initCubePrimitive(); //setups the cube primitive in the cube variable

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


};

var update = (_delta) => {
    var elapsed = LP.getVal(0);
    elapsed += _delta;

    //rotation matrices
    var theta = elapsed * 0.5;

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

    LP.setVal(0, elapsed);


};

var draw = () => {

    let i = 0;
    for (i = 0; i < cube.triangles.length; i += 1) {
        var tri = cube.triangles[i];

        var triRotatedZ = copyTriangle(tri);
        triRotatedZ.v1 = multiplyMatrixVector(tri.v1, matRotZ);
        triRotatedZ.v2 = multiplyMatrixVector(tri.v2, matRotZ);
        triRotatedZ.v3 = multiplyMatrixVector(tri.v3, matRotZ);

        var triRotatedZX = copyTriangle(triRotatedZ);
        triRotatedZX.v1 = multiplyMatrixVector(triRotatedZ.v1, matRotX);
        triRotatedZX.v2 = multiplyMatrixVector(triRotatedZ.v2, matRotX);
        triRotatedZX.v3 = multiplyMatrixVector(triRotatedZ.v3, matRotX);

        var triTranslated = copyTriangle(triRotatedZX); //this copies the reference not the object, we need to make a new object here
        var amount = 2;
        triTranslated.v1[2] = tri.v1[2] + amount;
        triTranslated.v2[2] = tri.v2[2] + amount;
        triTranslated.v3[2] = tri.v3[2] + amount;

        var triProjected = new Triangle([
            multiplyMatrixVector(triTranslated.v1, matProj), //these multiplications yield a 3D vector each
            multiplyMatrixVector(triTranslated.v2, matProj),
            multiplyMatrixVector(triTranslated.v3, matProj)
        ]);

        LP.printConsole(`triProjected.v1: ${triProjected.v1} triProjected.v2: ${triProjected.v2} triProjected.v3: ${triProjected.v3}`);

        //scale into view
        var scale = 0;
        triProjected.v1[0] += scale; triProjected.v1[1] += scale;
        triProjected.v2[0] += scale; triProjected.v2[1] += scale;
        triProjected.v3[0] += scale; triProjected.v3[1] += scale;

        //denormalizing into screen width and height
        triProjected.v1[0] *= screenWidth;
        triProjected.v1[1] *= screenHeight;
        triProjected.v2[0] *= screenWidth;
        triProjected.v2[1] *= screenHeight;
        triProjected.v3[0] *= screenWidth;
        triProjected.v3[1] *= screenHeight;


        drawTriangle([triProjected.v1[0], triProjected.v1[1]],
            [triProjected.v2[0], triProjected.v2[1]],
            [triProjected.v3[0], triProjected.v3[1]]);
    }
    LP.setPrintConsole(false);
}

function drawTriangle(_v1, _v2, _v3) { //the inputs are 2D vectorsq
    LP.draw_line(_v1, _v2, 0x00ff00);
    LP.draw_line(_v2, _v3, 0x00ff00);
    LP.draw_line(_v3, _v1, 0x00ff00);
}

function copyTriangle(_triangle) {
    return new Triangle([
        [_triangle.v1[0], _triangle.v1[1], _triangle.v1[2]],
        [_triangle.v2[0], _triangle.v2[1], _triangle.v2[2]],
        [_triangle.v3[0], _triangle.v3[1], _triangle.v3[2]]]);
}

function initCubePrimitive() {
    //now we are describing the mesh of a cube
    var triangleArray = [
        //south face
        new Triangle([[0, 0, 0], [0, 1, 0], [1, 1, 0]]),
        new Triangle([[0, 0, 0], [1, 1, 0], [1, 0, 0]]),

        //east face
        new Triangle([[1, 0, 0], [1, 1, 0], [1, 1, 1]]),
        new Triangle([[1, 0, 0], [1, 1, 1], [1, 0, 1]]),

        //north face
        new Triangle([[1, 0, 1], [1, 1, 1], [0, 1, 1]]),
        new Triangle([[1, 0, 1], [0, 1, 1], [0, 0, 1]]),

        //west face
        new Triangle([[0, 0, 1], [0, 1, 1], [0, 1, 0]]),
        new Triangle([[0, 0, 1], [0, 1, 0], [0, 0, 0]]),

        //top face
        new Triangle([[0, 1, 0], [0, 1, 1], [1, 1, 1]]),
        new Triangle([[0, 1, 0], [1, 1, 1], [1, 1, 0]]),

        //bottom face
        new Triangle([[1, 0, 1], [0, 0, 1], [0, 0, 0]]),
        new Triangle([[1, 0, 1], [0, 0, 0], [1, 0, 0]])];

    cube = new Mesh(triangleArray);
}

//multiply a 3d vector by a matrix 4x4, and reurns a new 3D vector
function multiplyMatrixVector(_v, _m) {
    var x = _v[0];
    var y = _v[1];
    var z = _v[2];
    var xdash = x * _m.m[0][0] + y * _m.m[1][0] + z * _m.m[2][0] + _m.m[3][0];
    var ydash = x * _m.m[0][1] + y * _m.m[1][1] + z * _m.m[2][1] + _m.m[3][1];
    var zdash = x * _m.m[0][2] + y * _m.m[1][2] + z * _m.m[2][2] + _m.m[3][2];
    var w = x * _m.m[0][3] + y * _m.m[1][3] + z * _m.m[2][3] + _m.m[3][3];

    if (w != 0) {
        xdash = xdash / w;
        ydash = ydash / w;
        zdash = zdash / w;
    }
    return [xdash, ydash, zdash];
}


export var pDrawObject3D = LP.addProperty(init, update, draw);
