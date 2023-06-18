export function sqr(_num){return _num * _num;}
function radtodeg(_radians){return _radians * (180/Math.PI);}
function degtorad(_degrees){return _degrees * (Math.PI/180);}

export class LPVector{
  constructor(_vx,_vy){
    this.vx = _vx;
    this.vy = _vy;
  }
  setVector1(_vx,_vy){
    this.vx=_vx;
    this.vy=_vy;
  }
  setVector2(_v){
    this.vx = _v.getX();
    this.vy = _v.getY();
  }
  getX(){
    return this.vx;
  }
  getY(){
    return this.vy;
  }
  getTheta(){
    return radtodeg(Math.atan2(this.getY(),this.getX()));
  }
  getMag(){
    return Math.sqrt(sqr(this.getX())+sqr(this.getY()))
  }
  getPrint(){
    return ` (${this.getX()},${this.getY()}) `;
  }
}

export function rotateVector(_v,_theta){
  var vmag = _v.getMag();
  var xdash = vmag * Math.cos(degtorad(_theta));
  var ydash = vmag * Math.sin(degtorad(_theta));
  return new LPVector(xdash,ydash);
}

export function transformVector(_v, _x, _y, _theta){
  var v = rotateVector(_v, _theta); //first rotate
  v.setVector2(new LPVector(v.getX() + _x, v.getY() + _y)); //then translate
  return v;
}

export function dotProduct(_v1,_v2){
  return (_v1.getX() * _v2.getX()) + (_v1.getY() * _v2.getY());
}

export function scalarXvector(_scalar, _vector){
  return new LPVector(_scalar*_vector.getX(),_scalar*_vector.getY());
}

export function v2Minusv1(_v1,_v2){
  return new LPVector(_v2.getX()-_v1.getX(),_v2.getY()-_v1.getY());
}

export function v1Plusv2(_v1,_v2){
  return new LPVector(_v1.getX()+_v2.getX(),_v1.getY()+_v2.getY());
}

export function findLeftPerpendicular(_v){
  return new LPVector(-_v.getY(),_v.getX());
}