import * as LP from './LPEngine/LPEngine.js';
import * as Scene from './SceneDef.js';

var stamp = [0,0];
var stamped=false;

export var draw = () => {
  var collision = LP.checkCollisionInstances(Scene.square, Scene.ground);

  if (collision[3] == 1){
    console.log(`Collision detected`);
    if (stamped ==false){
      stamped = true;
      LP.selectInstance(Scene.square);
      stamp = [LP.getXPrev(),LP.getYPrev()]; LP.unSelectAll();
      console.log(`xprev ${stamp[0]} yprev ${stamp[1]}`);
    }
  }
  LP.selectInstance(Scene.square);
  var prim = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()),stamp[0], stamp[1],0); LP.unSelectAll();
  LP.draw_primitive(prim);
}