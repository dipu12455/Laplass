import * as LP from './LPEngine/LPEngine.js';
import { pCircle } from './properties/pCircle.js';
import { pDrawObject } from './properties/pDrawObject.js';

var drawObject = LP.addInstance(-1,-1,pDrawObject);

var circle1 = LP.addInstance(-1,-1,pCircle);
LP.selectInstance(circle1);
LP.setPosition(-5,0); LP.unSelectAll();
