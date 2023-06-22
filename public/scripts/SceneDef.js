import * as LP from './LPEngine/LPEngine.js';
import { acSquare } from './actions/acSquare.js';
import { acGround } from './actions/acGround.js';

//define a primitive
var pmSquare = LP.addPrimitive('/pmSquare');
var pmGround = LP.addPrimitive('/pmGround');


export var square = LP.addInstance(pmSquare, -1, acSquare);
export var ground = LP.addInstance(pmGround, -1, acGround);



