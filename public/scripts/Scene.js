import * as LP from './LPEngine/LPEngine.js';
import { pDrawObject } from './properties/drawObject.js';
import { pSquareManual } from './properties/pSquareManual.js';
import { pTriangle } from './properties/pTriangle.js';

var pmSquare = LP.addPrimitive('pmSquare');

var sq1 = LP.addInstance(pmSquare, -1, pSquareManual);

