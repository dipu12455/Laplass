export function sqr(_num) { return _num * _num; }
export function radtodeg(_radians) { return _radians * (180 / Math.PI); }
export function degtorad(_degrees) { return _degrees * (Math.PI / 180); }

//all vectors are expressed as an array of the form [x,y].

export function getTheta(_v) {
  return radtodeg(Math.atan2(_v[1], _v[0]));
}
export function getMag(_v) {
  return Math.sqrt(sqr(_v[0]) + sqr(_v[1]));
}

export function rotateVector(_v, _theta) {
  var vmag = getMag(_v);
  var xdash = vmag * Math.cos(degtorad(_theta));
  var ydash = vmag * Math.sin(degtorad(_theta));
  return [xdash, ydash];
}

export function transformVector(_v, _x, _y, _theta) {
  var v = rotateVector(_v, _theta); //first rotate
  return [v[0] + _x, v[1] + _y]; //then translate
}

//a unit vector is used to indicate direction
export function getUnitVector(_v) {
  var mag = getMag(_v);
  var i = _v[0] / mag;
  var j = _v[1] / mag;
  return [i, j];
}

export function dotProduct(_v1, _v2) {
  return (_v1[0] * _v2[0]) + (_v1[1] * _v2[1]);
}

export function scalarXvector(_scalar, _vector) {
  return [_scalar * _vector[0], _scalar * _vector[1]];
}

export function v2Minusv1(_v1, _v2) {
  return [_v2[0] - _v1[0], _v2[1] - _v1[1]];
}

export function v1Plusv2(_v1, _v2) {
  return [_v1[0] + _v2[0], _v1[1] + _v2[1]];
}

export function findLeftPerpendicular(_v) {
  return [-_v[1], _v[0]];
}

//unit tests
