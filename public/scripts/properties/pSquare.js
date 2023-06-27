import * as LP from '../LPEngine/LPEngine.js';
import { pGround } from './pGround.js';
import { pPentagon } from './pPentagon.js';

var init = () => {
    LP.setBoundingBox([-1, 1], [1, -1]);
    LP.makeVar(0);//(0)forcex = 0
    LP.makeVar(0); //(1)forcey = 0
    LP.makeVar(0); //(2)selected = 0
    LP.setPhysical(true); //this turns the instance that embues this property into a 'physical' object that the physics engine will interact with
};

var update = (_delta) => {
    checkEvents();

    var hspeed = LP.getHSpeed();
    var vspeed = LP.getVSpeed();
    var force = [LP.getVal(0), LP.getVal(1)];

    var gravity = -0.02;

    //compute friction vector
    var mag_fric = 0.005; //friction magnitude
    var vU_friction = getUnitVector([-hspeed, -vspeed]); //direction of friction is always opposite the velocity
    var friction = [vU_friction[0] * mag_fric, vU_friction[1] * mag_fric] //should be positive

    var ax = force[0] + friction[0];
    var ay = force[1] + friction[1];

    //reset forces after velocities have been updated for this frame
    resetForces();

    LP.setAcceleration([ax, ay]);
};

function checkEvents() {
    if (LP.isEventFired(LP.evKeyP)) {
        LP.printConsole();
        LP.timePause();
        LP.turnOffEvent(LP.evKeyP);
    }

    //select this square if clicked on
    if (LP.evMouseClickRegion(LP.getBoundingBox())) {
        LP.setVal(2, 1); //(2)selected=1
    }
    //press G to deselect
    if (LP.isEventFired(LP.evKeyG)) {
        LP.setVal(2, 0);
    }
    var moveAmount = 0.01;
    if (LP.getVal(2) == 1) {
        if (LP.isPEventFired(LP.evKeyW_p)) {
            LP.setVal(1, moveAmount);
        }
        if (LP.isPEventFired(LP.evKeyS_p)) {
            LP.setVal(1, -moveAmount);
        }
        if (LP.isPEventFired(LP.evKeyA_p)) {
            LP.setVal(0, -moveAmount);
        }
        if (LP.isPEventFired(LP.evKeyD_p)) {
            LP.setVal(0, moveAmount);
        }
    }

}

function resetForces() {
    LP.setVal(0, 0); //(0)forceX = 0
    LP.setVal(1, 0); //(1)forceY = 0
}



function getMag(_v) {
    return Math.sqrt(LP.sqr(_v[0]) + LP.sqr(_v[1]));
}
function getUnitVector(_v) {
    var mag = getMag(_v);
    if (mag <= 0) return [0, 0];
    return [_v[0] / mag, _v[1] / mag];
}
function getRegularVector(_unitVector, _magnitude) {
    return [_unitVector[0] * _magnitude, _unitVector[1] * _magnitude];
}
function tan(_value) {
    return Math.tan(_value);
}
function v2Minusv1(_v1, _v2) {
    return [_v2[0] - _v1[0], _v2[1] - _v1[1]];
}
function v1Plusv2(_v1, _v2) {
    return [_v1[0] + _v2[0], _v1[1] + _v2[1]];
}


var draw = () => {
    LP.draw_anchor(LP.findCenterOfInstancePrimitive(), 0xff0000);

}

export var pSquare = LP.addProperty(init, update, draw);
