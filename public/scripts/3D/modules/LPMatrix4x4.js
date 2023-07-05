import * as LP from '../../LPEngine/LPEngine.js';
// the vectors will be of form [x,y,z], represented as arrays

export function returnZeroMat4x4() {
    return [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
}

export class mat4x4 {
    constructor() {
        this.m = returnZeroMat4x4();
    }
}

//multiply a 3d vector by a matrix 4x4, and reurns a new 3D vector
export function multiplyMatrixVector(_v, _m) {
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

export function multiplyMatrixVectorNew(_v, _m) {
    var x = _v[0];
    var y = _v[1];
    var z = _v[2];
    var w = _v[3];
    var xdash = x * _m.m[0][0] + y * _m.m[1][0] + z * _m.m[2][0] + w * _m.m[3][0];
    var ydash = x * _m.m[0][1] + y * _m.m[1][1] + z * _m.m[2][1] + w * _m.m[3][1];
    var zdash = x * _m.m[0][2] + y * _m.m[1][2] + z * _m.m[2][2] + w * _m.m[3][2];
    var wdash = x * _m.m[0][3] + y * _m.m[1][3] + z * _m.m[2][3] + w * _m.m[3][3];

    return [xdash, ydash, zdash, wdash];
}

export function makeIdentityMatrix() {
    var matrix = new mat4x4();
    matrix.m[0][0] = 1;
    matrix.m[1][1] = 1;
    matrix.m[2][2] = 1;
    matrix.m[3][3] = 1;
    return matrix;
}

export function getProjectionMatrix(_aspectRatio, _fieldOfView, _zNear, _zFar) {
    var F = 1 / Math.tan(LP.degtorad(_fieldOfView * 0.5));
    var q = _zFar / (_zFar - _zNear);

    var matProj = new mat4x4();
    matProj.m[0][0] = _aspectRatio * F;
    matProj.m[1][1] = F;
    matProj.m[2][2] = q;
    matProj.m[3][2] = -q * _zNear;
    matProj.m[2][3] = 1;
    matProj.m[3][3] = 0;

    return matProj;
}

export function getTranslationMatrix(_x, _y, _z) {
    var matrix = new mat4x4();
    matrix.m[0][0] = 1;
    matrix.m[1][1] = 1;
    matrix.m[2][2] = 1;
    matrix.m[3][3] = 1;
    matrix.m[3][0] = _x;
    matrix.m[3][1] = _y;
    matrix.m[3][2] = _z;
    return matrix;
}

export function getRotationMatrixX(_theta) {
    //rotation X
    var matrix = new mat4x4();
    matrix.m[0][0] = 1;
    matrix.m[1][1] = Math.cos(LP.degtorad(_theta * 0.5));
    matrix.m[1][2] = Math.sin(LP.degtorad(_theta * 0.5));
    matrix.m[2][1] = -Math.sin(LP.degtorad(_theta * 0.5));
    matrix.m[2][2] = Math.cos(LP.degtorad(_theta * 0.5));
    matrix.m[3][3] = 1;
    return matrix;
}
export function getRotationMatrixY(_theta) {
    //rotation Y
    var matrix = new mat4x4();
    matrix.m[0][0] = Math.cos(LP.degtorad(_theta * 0.5));
    matrix.m[0][2] = Math.sin(LP.degtorad(_theta * 0.5));
    matrix.m[2][0] = -Math.sin(LP.degtorad(_theta * 0.5));
    matrix.m[1][1] = 1;
    matrix.m[2][2] = Math.cos(LP.degtorad(_theta * 0.5));
    matrix.m[3][3] = 1;
    return matrix;
}
export function getRotationMatrixZ(_theta) {
    //rotation Z
    var matrix = new mat4x4();
    matrix.m[0][0] = Math.cos(LP.degtorad(_theta));
    matrix.m[0][1] = Math.sin(LP.degtorad(_theta));
    matrix.m[1][0] = -Math.sin(LP.degtorad(_theta));
    matrix.m[1][1] = Math.cos(LP.degtorad(_theta));
    matrix.m[2][2] = 1;
    matrix.m[3][3] = 1;
    return matrix;
}

//Credit: javidx9
export function matrixMultiMatrix(_m1, _m2) {
    var matrix = new mat4x4();
    for (var c = 0; c < 4; c += 1) {
        for (var r = 0; r < 4; r += 1) {
            matrix.m[r][c] = _m1.m[r][0] * _m2.m[0][c] + 
            _m1.m[r][1] * _m2.m[1][c] + 
            _m1.m[r][2] * _m2.m[2][c] + 
            _m1.m[r][3] * _m2.m[3][c];
        }
    }
    return matrix;
}