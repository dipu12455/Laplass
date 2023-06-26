import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.makeVar(0); //(0)forcex = 0
    LP.makeVar(0); //(1)forcey = 0
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

    var acc = [ax, ay];

    //place for collision

    hspeed += acc[0];
    vspeed += acc[1];

    //if velocity is too small, make it equal to zero
    if (isVectorWithinRange([hspeed, vspeed], 0, 0.009)) {
        hspeed = 0;
        vspeed = 0;
    }

    //reset forces after velocities have been updated for this frame
    resetForces();

    LP.setHSpeed(hspeed);
    LP.setVSpeed(vspeed);

};

function checkEvents() {

    var moveAmount = 0.01;

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
function isVectorWithinRange(_v, low, high) {
    var mag = getMag(_v);
    if (mag >= low && mag <= high) {
        return true;
    }
    return false;
}

var draw = () => {
    LP.draw_circle([LP.getX(), LP.getY()],2,0x000000);

}

export var pCircle = LP.addProperty(init, update, draw);