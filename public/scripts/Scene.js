import * as LP from './LPEngine/LPEngine.js';
import { pPointForce } from './properties/pPointForce.js';
import { pSquareManual } from './properties/pSquareManual.js';

var pmRect = LP.addPrimitive('pmRectangle');

var rect1 = LP.addInstance(pmRect, -1, pPointForce); // just a way of giving name to a property that describes how to react with point forces resulting in linear and angular accelerations
LP.selectInstance(rect1);
LP.setPosition(-5,5);
LP.unSelectAll();

var rect2 = LP.addInstance(pmRect, -1, pPointForce);
LP.selectInstance(rect2);
LP.setPosition(5,5);
LP.unSelectAll();

var rect3 = LP.addInstance(pmRect, -1, pPointForce);
LP.selectInstance(rect3);
LP.setPosition(5,-5);
LP.unSelectAll();

var rect4 = LP.addInstance(pmRect, -1, pPointForce);
LP.selectInstance(rect4);
LP.setPosition(-5,-5);
LP.unSelectAll();