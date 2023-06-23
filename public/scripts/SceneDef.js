import * as LP from './LPEngine/LPEngine.js';
import { pSquare } from './properties/pSquare.js';
import { pGround } from './properties/pGround.js';
import { pPentagon } from './properties/pPentagon.js';
import { pTriangle } from './properties/pTriangle.js';

//define a primitive
var pmSquare = LP.addPrimitive('/pmSquare');

export var square1 = LP.addInstance(pmSquare, -1, pSquare);
export var square2 = LP.addInstance(pmSquare, -1, pSquare);

/* //set initial forces for these two instances so they move towards one another.
LP.selectInstance(square1);
LP.makeVar(0.05); //(0)forcex = 0.05
LP.makeVar(0); //(1)forcey = 0
LP.setPosition(-5,-1);
LP.unSelectAll(); 

LP.selectInstance(square2);
LP.makeVar(-0.05); //(0)forcex = -0.05
LP.makeVar(0); //(1)forcey = 0
LP.setPosition(5,0); //(1)forcey = 0
LP.unSelectAll(); //1st slot as -0.3 */

//set up two more squares but for vertical motion

export var square3 = LP.addInstance(pmSquare, -1, pSquare);
export var square4 = LP.addInstance(pmSquare, -1, pSquare);

//set initial forces for these two instances so they move towards one another.
LP.selectInstance(square3); //going down
LP.makeVar(0.05); //(0)forcex = 0
LP.makeVar(-0.05); //(1)forcey = -0.05
LP.setPosition(-5,5);
LP.unSelectAll(); 

LP.selectInstance(square4); //going up
LP.makeVar(-0.06); //(0)forcex = 0
LP.makeVar(0.05); //(0)forcey = 0.05
LP.setPosition(5,-5); //(1)forcey = 0
LP.unSelectAll(); //1st slot as -0.3