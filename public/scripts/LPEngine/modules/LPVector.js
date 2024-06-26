//all vectors are expressed as an array of the form [x,y].
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

export function findAverage(_v1, _v2) {
  return [(_v1[0] + _v2[0]) / 2, (_v1[1] + _v2[1]) / 2];
}

export function sumAllVectors(_arrayOfVectors) {
  var sum = [0, 0];
  for (var i = 0; i < _arrayOfVectors.length; i++) {
    sum = v1Plusv2(sum, _arrayOfVectors[i]);
  }
  return sum;
}
export function getRegularVector(_unitVector, _magnitude) {
  return [_unitVector[0] * _magnitude, _unitVector[1] * _magnitude];
}

export function radtodeg(_radians) { return _radians * (180 / Math.PI); }

export function degtorad(_degrees) { return _degrees * (Math.PI / 180); }

export function sqr(_num) { return _num * _num; }

export function sumOfSqr(_n1, _n2) {
  return (sqr(_n1) + sqr(_n2));
}

export function getTheta(_v) {
  return radtodeg(Math.atan2(_v[1], _v[0]));
}
export function getMag(_v) {
  return Math.sqrt(sumOfSqr(_v[0], _v[1]));
}

export function getVectorRTHeta(_r, _theta) { //theta in degrees
  return [_r * Math.cos(degtorad(_theta)), _r * Math.sin(degtorad(_theta))];
}

export function isVectorWithinRange(_v, low, high) {
  var mag = getMag(_v);
  if (mag >= low && mag <= high) {
    return true;
  }
  return false;
}

export function subtractMagnitudeFromVector(_vector, _magnitude) {
  var unitVector = getUnitVector(_vector);
  var mag = getMag(_vector) - _magnitude;
  return getRegularVector(unitVector, mag);
}

export function rotateVector(_v, _theta) {
  var vmag = getMag(_v);
  var xdash = vmag * Math.cos(degtorad(_theta));
  var ydash = vmag * Math.sin(degtorad(_theta));
  return [xdash, ydash];
}

//a unit vector is used to indicate direction
export function getUnitVector(_v) {
  var mag = getMag(_v);
  if (mag <= 0) return [0, 0]; //avoid divide by 0
  var i = _v[0] / mag;
  var j = _v[1] / mag;
  return [i, j];
}

//this function only increments x and y, but doesnt increment theta
export function transformVector(_v, _x, _y, _theta) {
  var v = rotateVector(_v, _theta); //first rotate
  return [v[0] + _x, v[1] + _y]; //then translate
}

export function flipVector(_v) {
  return [-_v[0], -_v[1]];
}
