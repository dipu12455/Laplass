import * as LP from './LPEngine/LPEngine.js';
import * as Scene from './SceneDef.js';

//get the entity from def file
var ins1 = Scene.ins1;
var ins2 = Scene.ins2;

export var draw = () => {
  //obtain the first primitive transformed into the orientation of its instance
  LP.selectInstance(ins1);
  var prim1 = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()),
    LP.getX(),LP.getY(),LP.getRot());
    LP.unSelectAll();

  //obtain the second primitive tranformed into the orientation of its instance
  LP.selectInstance(ins2);
  var prim2 = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()),
  LP.getX(),LP.getY(),LP.getRot()); 
  LP.unSelectAll();

  //check collision between these two primitives, and if so draw a red dot
  if (LP.checkCollision(prim1, prim2)) {
    LP.draw_anchorV(new LP.LPVector(-5, 5), 0xff0000);
  }
}

