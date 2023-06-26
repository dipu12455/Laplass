import * as LP from './LPEngine/LPEngine.js';
import { pDrawObject } from './properties/pDrawObject.js';
import { pSquare } from './properties/pSquare.js';

var pmSquare = LP.addPrimitive('/pmSquare');
var pmPentagon = LP.addPrimitive('/pmPentagon');

LP.setPrintConsole(true);

//loop to create 4 boxes
let i = 0;
for (i = 0; i < 4; i += 1){
    var temp = LP.addInstance(pmSquare, -1, pSquare);
    LP.selectInstance(temp);
    LP.setPosition(getRandomInt(4),getRandomInt(4));
    LP.unSelectAll();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  var pentagon = LP.addInstance(pmPentagon, -1, pSquare);
