import * as LP from '../LPEngine/LPEngine.js';
import { pGround } from './pGround.js';
import { pPentagon } from './pPentagon.js';

var init = () => {
    LP.setBoundingBox([-1, 1], [1, -1]);
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

    //collisions will change acc values, do it after all the forces have been calculated.
    //but just before the speed of the instance gets updated.
    acc = handleCollision(acc);

    hspeed += acc[0];
    vspeed += acc[1];

    //if velocity is too small, make it equal to zero
    if (isVectorWithinRange([hspeed,vspeed],0,0.009)){
        hspeed = 0;
        vspeed = 0;
    }

    console.log(`1. hspeed ${hspeed}`);
    console.log(`2. vspeed ${vspeed}`);

    //reset forces after velocities have been updated for this frame
    resetForces();

    LP.setHSpeed(hspeed);
    LP.setVSpeed(vspeed);

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

function handleCollision(_acc) {
    var angleOfContact = LP.checkCollision(pSquare); //check collision with instances that contain property pGround
    var acc = [0, 0];

    if (angleOfContact != -1) {

        //need to retract object to its position before the collision to un-overlap it.
        LP.setX(LP.getXPrev());
        LP.setY(LP.getYPrev());

        acc = bounce(angleOfContact, 1); //returns an acceleration that the current physical state would yield
    }
    return v1Plusv2(_acc, acc); //add onto the acc you received from parameter
}

function bounce(_angleOfContact, _damp) {
    /*final velocity after colliding with wall is equal in
    magnitude but 'reflective' in direction to initial velocity.
    since acc is defined as the change in velocity, we get acc by v2 - v1,
    which is a vector subtraction.*/

    var v1 = [LP.getHSpeed(), LP.getVSpeed()]; var v1Mag = getMag(v1);//initial velocity
    var v2 = [0, 0]; var v2Mag = 0;//final velocity

    //change to unit vector form
    v1 = getUnitVector(v1);

    //find v2 which is an exact reflection of v1 along the line of the contact surface
    var theta = _angleOfContact;

    var tt = LP.degtorad(theta);
    var xx = ((tan(tt) * v1[1]) + v1[0]) / (LP.sqr(tan(tt)) + 1);
    v2[0] = 2 * xx - v1[0];

    var yy = tan(tt) * xx;
    v2[1] = 2 * yy - v1[1];

    v2Mag = v1Mag * _damp; //magnitude is the same

    /* now we have v2 and v1, acc is the difference between v2 and v1.*/
    v1 = getRegularVector(v1, v1Mag); //convert them to regular vector first before subtracting
    v2 = getRegularVector(v2, v2Mag);
    var acc = v2Minusv1(v1, v2);
    return acc;
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

export var pSquare = LP.addProperty(new LP.Property(init, update));
