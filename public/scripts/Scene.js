import * as LP from './LPEngine/LPEngine.js';
import { pDrawObject } from './properties/drawObject.js';
import { pSquareManual } from './properties/pSquareManual.js';
import { pTriangle } from './properties/pTriangle.js';

var pmTriangle = LP.addPrimitive('pmTriangle');

var drawObject = LP.addInstance(-1,-1,pDrawObject);

export var triangle1 = LP.addInstance(pmTriangle, -1, pSquareManual);
LP.selectInstance(triangle1);
LP.setPosition(-9, -6);
LP.setRot(-30);
LP.unSelectAll();

export var triangle2 = LP.addInstance(pmTriangle, -1, pSquareManual);
LP.selectInstance(triangle2);
LP.setPosition(-5, -6);
LP.unSelectAll();