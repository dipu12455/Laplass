import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.makeVar(0);//(0)forcex = 0
    LP.makeVar(0); //(1)forcey = 0
    LP.makeVar(0); //(2)selected = 0
};

var update = (_delta) => {
    checkEvents();

    var force = forceWithMouse();
    var friction = getFrictionForce(0.005);

    LP.setAcceleration(LP.sumAllVectors([force, friction]));

};

var draw = () => {
}

function checkEvents() {
    if (LP.evMouseRegion(LP.getBoundingBox(LP.getPrimitiveIndex()), LP.evMouseDown)) {
        LP.setVal(2, 1);
        //the mouse down function already consumes the event
    }
    if (LP.isEventFired(LP.evMouseUp)) {
        LP.setVal(2, 0);
        //dont consume this event because that way all instances will be deselected
    }
}

function forceWithMouse() {
    if (LP.getVal(2) == 1) {
        var mouseXcurrent = LP.getMousePosition()[0];
        var mouseYcurrent = LP.getMousePosition()[1];
        var scale = 0.01; //the force was too much, we'll scale it down
        var force = [(mouseXcurrent - LP.getX()) * scale,
        (mouseYcurrent - LP.getY()) * scale];
        return force;
    } else {
        return [0, 0];
    }
}

function getFrictionForce(_amount) {
    //compute friction vector 0.005
    var vU_friction = LP.getUnitVector([-LP.getHSpeed(), -LP.getVSpeed()]); //direction of friction is always opposite the velocity
    return [vU_friction[0] * _amount, vU_friction[1] * _amount];
}

export var pPointForce = LP.addProperty(init, update, draw);
