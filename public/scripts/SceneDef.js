import * as LP from './LPEngine/LPEngine.js';
import { pSquare } from './properties/pSquare.js';
import { pGround } from './properties/pGround.js';
import { pPentagon } from './properties/pPentagon.js';
import { pTriangle } from './properties/pTriangle.js';

//define a primitive
var pmSquare = LP.addPrimitive('/pmSquare');

export var square1 = LP.addInstance(pmSquare, -1, pSquare);
export var square2 = LP.addInstance(pmSquare, -1, pSquare);

//set initial forces for these two instances so they move towards one another.
LP.selectInstance(square1);
LP.makeVar(0.05);//1st slot as 0.3
LP.setPosition(-5,0);
LP.unSelectAll(); 

LP.selectInstance(square2);
LP.makeVar(-0.05);
LP.setPosition(5,0);
LP.unSelectAll(); //1st slot as -0.3