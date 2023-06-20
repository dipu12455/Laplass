import * as LP from './LPEngine/LPEngine.js';
import * as Scene from './SceneDef.js';

var stampBefore = [0,0];
var stampAfter = [0,0];

export var draw = () => {
  var collision = LP.checkCollisionInstances(Scene.square, Scene.ground);
  if (collision[3] == 1) {
    var i = collision[0], j = collision[1], mag = collision[2];
    console.log(`Collision`);
    LP.selectInstance(Scene.square);
    stampBefore = [LP.getX(),LP.getY()];
    stampAfter = [LP.getX() + i*mag, LP.getY() + j*mag];
    LP.unSelectAll();
  }
  LP.selectInstance(Scene.square);
  var primBefore = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()),stampBefore[0], stampBefore[1], 0);
  var primAfter = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()), stampAfter[0], stampAfter[1], 0);
  LP.unSelectAll();
  LP.draw_anchor(stampBefore[0], stampBefore[1], 0xff0000);
  //LP.draw_primitive(primBefore);
  LP.draw_anchor(stampAfter[0], stampAfter[1], 0x00ff00);
  //LP.draw_primitive(primAfter);
  if (collision[3] == 1) LP.timePause();
}