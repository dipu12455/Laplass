import * as LP from './LPEngine/LPEngine.js';
import * as Scene from './SceneDef.js';

//ground dimensions
var groundY = -11;

export var draw = () => {
  LP.draw_line(-15,groundY,15,groundY,0xff0000); //draw ground
}