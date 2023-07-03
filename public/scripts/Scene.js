import * as LP from './LPEngine/LPEngine.js';
import { objPointForce } from './GameObjects/objPointForce.js';



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var pmRect = LP.addPrimitive('pmRectangle');

/* var objRect1 = new objPointForce();
objRect1.setPrimitiveIndex(pmRect);
LP.addInstance(objRect1); */



let i = 0;
for (i = 0; i < 10; i++) {
    var instance = new objPointForce();
    instance.setPrimitiveIndex(pmRect);
    instance.setX(getRandomInt(10));
    instance.setY(getRandomInt(10));
    LP.addInstance(instance);
}