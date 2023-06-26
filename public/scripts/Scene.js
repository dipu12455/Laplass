import * as LP from './LPEngine/LPEngine.js';
import { pCircle } from './properties/pCircle.js';

var circle1 = LP.addInstance(-1,-1,pCircle);
LP.selectInstance(circle1);
LP.setPosition(0,0); LP.unSelectAll();
