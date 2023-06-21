import * as LP from '../LPEngine/LPEngine.js';
import { ground, square } from '../SceneDef.js';

var init = () => {
    LP.setPosition(-5, 5);
};

var update = (_delta) => {
    var hspeed = LP.getHSpeed();
    var vspeed = LP.getVSpeed();

    var gravity = -0.02;
    var ax = 0;
    var ay = gravity;

    var acc = [ax, ay];

    //collisions will change acc values, do it after all the forces have been calculated.
    //but just before the speed of the instance gets updated.
    acc = handleCollision(acc);

    hspeed += acc[0];
    vspeed += acc[1];

    LP.setHSpeed(hspeed);
    LP.setVSpeed(vspeed);

    if (LP.isEventFired(LP.evKeyP)) {
        LP.timePause();
        LP.turnOffEvent(LP.evKeyP);
    }
};

function handleCollision(_acc) {
    //see if collision is detected
    var collision = LP.checkCollisionInstances(LP.getSelectedInstance(),square, ground);
    var acc = [0,0];

    if (collision[3] == 1) {
        //need to retract object to its position before the collision to un-overlap it.
        LP.setX(LP.getXPrev());
        LP.setY(LP.getYPrev());

        acc = bounce(0); //returns an acceleration that the current physical state would yield
    }
    return v1Plusv2(_acc, acc) ; //add onto the acc you received from parameter
}

function bounce(_angleOfContact) {
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

    v1Mag = v1Mag; //magnitude is the same

    /* now we have v2 and v1, acc is the difference between v2 and v1.*/
    v1 = getRegularVector(v1, v1Mag); //convert them to regular vector first before subtracting
    v2 = getRegularVector(v2, v2Mag);
    var acc = v2Minusv1(v1, v2);
    return acc;
}



function getMag(_v) {
    return Math.sqrt(LP.sqr(_v[0]) + LP.sqr(_v[1]));
}
function getUnitVector(_v) {
    var mag = getMag(_v);
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

export var acSquare = LP.addAction(new LP.Action(init, update));
