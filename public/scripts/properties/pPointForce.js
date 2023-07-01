import * as LP from '../LPEngine/LPEngine.js';

//some global variables so that they can be drawn (global within this file)

var init = () => {
    LP.makeVar(0);//(0)forcex = 0
    LP.makeVar(0); //(1)forcey = 0
    LP.makeVar(0); //(2)selected = 0
    LP.makeVar(0); //(3)positionVectorX = 0;
    LP.makeVar(0); //(4)positionVectorY = 0;
    LP.makeVar(0); //(5)isPositionVectorSet = 0
    LP.setPhysical(true);
};

var update = (_delta) => {
    checkEvents();

    var force = forceWithMouse();
    var mass = 10;
    force = [force[0] / mass, force[1] / mass];
    var friction = getFrictionForce(0.02); //0.005

    LP.setAcceleration(LP.sumAllVectors([force, friction]));

};



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
        var isPositionVectorSet = LP.getVal(5);
        if (isPositionVectorSet == 0) {
            LP.setVal(3, LP.getMousePosition()[0] - LP.getX());//(3)positionVectorX = getX() - mouseX
            LP.setVal(4, LP.getMousePosition()[1] - LP.getY());//(4)positionVectorY = getY() - mouseY
            //it is (mouseposition - instanceposition) because we want the vector pointing outwards from COM
            LP.setVal(5, 1); //(5) ispositionVectorSet = 1
        } //this difference is now recorded, later when we need the point at which force was applied, we use this difference

        var mouseXPrev = LP.getX() + LP.getVal(3);
        var mouseYPrev = LP.getY() + LP.getVal(4);

        var mouseXcurrent = LP.getMousePosition()[0];
        var mouseYcurrent = LP.getMousePosition()[1];
        var scale = 0.1; //the force was too much, we'll scale it down
        var pointForce = [(mouseXcurrent - mouseXPrev) * scale,
        (mouseYcurrent - mouseYPrev) * scale];
        return pointForce;
    } else {
        LP.setVal(5, 0); //(5) ispositionVectorSet = 0 turn off positionVector when releasing mouse
        return [0, 0];
    }
}

function getFrictionForce(_amount) {
    //compute friction vector 0.005
    var vU_friction = LP.getUnitVector([-LP.getHSpeed(), -LP.getVSpeed()]); //direction of friction is always opposite the velocity
    return [vU_friction[0] * _amount, vU_friction[1] * _amount];
}

var draw = () => {
    //draw a line from pointForce to mouse
    if (LP.getVal(5) == 1) {
        var positionVector = [LP.getVal(3), LP.getVal(4)];
        var instancePosition = [LP.getX(), LP.getY()];
        LP.draw_line(LP.v1Plusv2(instancePosition, positionVector), LP.getMousePosition(), 0x00ff00); //the line from the positionVector to the mouse position is the pointForce
        LP.draw_anchor(LP.getMousePosition(), 0xff0000);
    }
}

export var pPointForce = LP.addProperty(init, update, draw);
