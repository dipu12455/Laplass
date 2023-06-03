function sqr(_num){return _num * _num;}
function radtodeg(_radians){return _radians * (180/Math.PI);}
function degtorad(_degrees){return _degrees * (Math.PI/180);}

export class LPVector{
  constructor(_vx,_vy){
    this.vx = _vx;
    this.vy = _vy;
  }
  setVector(_vx,_vy){
    this.vx=_vx;
    this.vy=_vy;
  }
  getX(){
    return this.vx;
  }
  getY(){
    return this.vy;
  }
  getTheta(){
    return radtodeg(Math.atan2(getY(),getX()));
  }
}

export function rotateVector(_v,_theta){
  var vmag = Math.sqrt(sqr(_v.getX())+sqr(_v.getY()));
  var xdash = vmag * Math.cos(degtorad(_theta));
  var ydash = vmag * Math.sin(degtorad(_theta));
  return new LPVector(xdash,ydash);
}
