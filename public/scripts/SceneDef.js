import * as LP from './LPEngine/LPEngine.js';
import { pSquare } from './properties/pSquare.js';
import { pGround } from './properties/pGround.js';
import { pPentagon } from './properties/pPentagon.js';
import { pTriangle } from './properties/pTriangle.js';

//define a primitive
var pmSquare = LP.addPrimitive('/pmSquare');
var pmGround = LP.addPrimitive('/pmGround');

var pmPentagon = LP.addPrimitive('/pmPentagon');
var pmTriangle = LP.addPrimitive('/pmTriangle');

export var square = LP.addInstance(pmSquare, -1, pSquare);
export var ground = LP.addInstance(pmGround, -1, pGround);

export var pentagon = LP.addInstance(pmPentagon, -1, pPentagon);
export var triangle = LP.addInstance(pmTriangle, -1, pTriangle);
