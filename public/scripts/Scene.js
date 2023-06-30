import * as LP from './LPEngine/LPEngine.js';
import { pPointForce } from './properties/pPointForce.js';
import { pSquareManual } from './properties/pSquareManual.js';

var pmRect = LP.addPrimitive('pmRectangle');

var rect1 = LP.addInstance(pmRect, -1, pPointForce); // just a way of giving name to a property that describes how to react with point forces resulting in linear and angular accelerations