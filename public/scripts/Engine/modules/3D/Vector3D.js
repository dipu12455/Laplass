export function dotProduct_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2;//just to make it more readable
    return _v1[x] * _v2[x] + _v1[y] * _v2[y] + _v1[z] * _v2[z];
}

export function crossProduct(_v1, _v2) { //these are 3D vectors for input
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v1[y] * _v2[z] - _v1[z] * _v2[y],
    _v1[z] * _v2[x] - _v1[x] * _v2[z],
    _v1[x] * _v2[y] - _v1[y] * _v2[x],_v1[3]];
}

export function v1Plusv2_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2;//just to make it more readable
    return [_v1[x] + _v2[x], _v1[y] + _v2[y], _v1[z] + _v2[z], _v1[3]];
}
export function v2Minusv1_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v2[x] - _v1[x], _v2[y] - _v1[y], _v2[z] - _v1[z], _v2[3]];
}

export function getUnitVector_3D(_v) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    var length = Math.sqrt(_v[x] * _v[x] + _v[y] * _v[y] + _v[z] * _v[z]);
    if (length <= 0) { return [0, 0, 0]; }
    return [_v[x] / length, _v[y] / length, _v[z] / length, _v[3]];
}

export function vDivScalar_3D(_v, _scalar) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v[x] / _scalar, _v[y] / _scalar, _v[z] / _scalar, _v[3]];
}

export function scalarXVector_3D(_scalar, _v) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_scalar * _v[x], _scalar * _v[y], _scalar * _v[z], _v[3]];
}