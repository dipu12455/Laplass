import * as LP from './LPEngine/LPEngine.js';
import * as Scene from './SceneDef.js';

//get the entity from def file
var ins1 = Scene.ins1;
var ins2 = Scene.ins2;

export var draw = () => {
  //check collision between these two instances, and if so draw a red dot
  if (LP.checkCollisionInstances(ins1, ins2)) {
    LP.draw_anchorV(new LP.LPVector(-5, 5), 0xff0000);
  }
}