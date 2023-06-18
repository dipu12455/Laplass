import * as LP from './LPEngine/LPEngine.js';
import { acSquare } from './actions/acSquare.js';

//define a primitive
var pmSquare = LP.addPrimitive('/pmSquare');

export var square = LP.addInstance(pmSquare, -1, acSquare);
