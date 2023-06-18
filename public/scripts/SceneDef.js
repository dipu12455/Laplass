import * as LP from './LPEngine/LPEngine.js';
import { acTriangle } from './actions/acTriangle.js';
import { acPentagon } from './actions/acPentagon.js';

//define a primitive
var pmTriangle = LP.addPrimitive('/pmTriangle');

//pentagon
var pmPentagon = LP.addPrimitive('/pmPentagon');

//create instances
export var ins1 = LP.addInstance(pmPentagon, -1, acPentagon);
export var ins2 = LP.addInstance(pmTriangle, -1, acTriangle);

