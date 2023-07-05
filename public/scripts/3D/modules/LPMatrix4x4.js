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




