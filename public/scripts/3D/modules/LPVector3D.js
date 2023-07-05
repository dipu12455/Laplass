export function dotProduct_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return _v1[x] * _v2[x] + _v1[y] * _v2[y] + _v1[z] * _v2[z];
}

export function crossProduct(_v1, _v2) { //these are 3D vectors for input
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v1[y] * _v2[z] - _v1[z] * _v2[y],
    _v1[z] * _v2[x] - _v1[x] * _v2[z],
    _v1[x] * _v2[y] - _v1[y] * _v2[x]];
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