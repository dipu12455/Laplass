import * as LP from '../LPEngine/LPEngine.js';

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

export class Triangle {
    constructor(_vertices) { //the vertices is an array of vectors, and each vector is an array of three tuples [x,y,z]
        this.v1 = _vertices[0];
        this.v2 = _vertices[1];
        this.v3 = _vertices[2];
    }
}

export class Mesh {
    constructor(_triangles) { //the input is an array of the instance of the class Triangle
        this.triangles = _triangles;
    }
}

export function drawTriangle(_v1, _v2, _v3) { //the inputs are 2D vectorsq
    LP.draw_line(_v1, _v2, 0x00ff00);
    LP.draw_line(_v2, _v3, 0x00ff00);
    LP.draw_line(_v3, _v1, 0x00ff00);
}

export function copyTriangle(_triangle) {
    return new Triangle([
        [_triangle.v1[0], _triangle.v1[1], _triangle.v1[2]],
        [_triangle.v2[0], _triangle.v2[1], _triangle.v2[2]],
        [_triangle.v3[0], _triangle.v3[1], _triangle.v3[2]]]);
}

export function multiplyTriangleWithMatrix(_triangle, _matrix) {
    var triange = new Triangle([
        multiplyMatrixVector(_triangle.v1, _matrix),
        multiplyMatrixVector(_triangle.v2, _matrix),
        multiplyMatrixVector(_triangle.v3, _matrix)]);
    return triange;
}

export function translateTriangle(_triangle, _translation) {
    var triangle = new Triangle([
        [_triangle.v1[0] + _translation[0], _triangle.v1[1] + _translation[1], _triangle.v1[2] + _translation[2]],
        [_triangle.v2[0] + _translation[0], _triangle.v2[1] + _translation[1], _triangle.v2[2] + _translation[2]],
        [_triangle.v3[0] + _translation[0], _triangle.v3[1] + _translation[1], _triangle.v3[2] + _translation[2]]]);
    return triangle;
}

export function getTriangleNormal(_triangle) {
    var normal, line1, line2;
    line1 = v2Minusv1_3D(_triangle.v1, _triangle.v2);
    line2 = v2Minusv1_3D(_triangle.v1, _triangle.v3);
    normal = crossProduct(line1, line2);
    
    //normalize the normal
    normal = getUnitVector_3D(normal);

    return normal;
}

export function dotProduct_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return _v1[x] * _v2[x] + _v1[y] * _v2[y] + _v1[z] * _v2[z];
}

export function crossProduct(_v1,_v2){ //these are 3D vectors for input
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v1[y]*_v2[z] - _v1[z]*_v2[y], 
    _v1[z]*_v2[x] - _v1[x]*_v2[z], 
    _v1[x]*_v2[y] - _v1[y]*_v2[x]];
}

export function v2Minusv1_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v2[x] - _v1[x], _v2[y] - _v1[y], _v2[z] - _v1[z]];
}

export function getUnitVector_3D(_v) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    var length = Math.sqrt(_v[x] * _v[x] + _v[y] * _v[y] + _v[z] * _v[z]);
    if (length <= 0) { return [0, 0, 0]; }
    return [_v[x] / length, _v[y] / length, _v[z] / length];
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