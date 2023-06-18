import * as LP from './LPEngine/LPEngine.js';
import { triangleInit, triangleUpdate } from './actions/acTriangle.js';
import { pentagonInit, pentagonUpdate } from './actions/acPentagon.js';

//define a primitive
var pmTriangle = LP.addPrimitive('/pmTriangle');

//pentagon
var pmPentagon = LP.addPrimitive('/pmPentagon');

//define action indices
const acPentagon = LP.addAction(new LP.Action(pentagonInit,pentagonUpdate));
const acTriangle = LP.addAction(new LP.Action(triangleInit, triangleUpdate));

//create an instance
export var ins1 = LP.addInstance(pmPentagon, -1, acPentagon);
export var ins2 = LP.addInstance(pmTriangle, -1, acTriangle);

