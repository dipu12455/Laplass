import * as LP from './LPEngine/LPEngine.js';
import { acSquare } from './actions/acSquare.js';
import { acGround } from './actions/acGround.js';
import { acPentagon } from './actions/acPentagon.js';
import { acTriangle } from './actions/acTriangle.js';

//define a primitive
var pmSquare = LP.addPrimitive('/pmSquare');
var pmGround = LP.addPrimitive('/pmGround');

var pmPentagon = LP.addPrimitive('/pmPentagon');
var pmTriangle = LP.addPrimitive('/pmTriangle');

export var pentagon = LP.addInstance(pmPentagon, -1, acPentagon);
export var triangle = LP.addInstance(pmTriangle, -1, acTriangle);

export var square = LP.addInstance(pmSquare, -1, acSquare);
export var ground = LP.addInstance(pmGround, -1, acGround);



