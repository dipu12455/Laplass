import * as LP from '../LPEngine/LPEngine.js';
import { getMag } from '../LPEngine/modules/LPVector.js';

export function moveWASD(_moveAmount) {
    if (LP.isPEventFired(LP.evKeyW_p)) {
        LP.setVal(1, _moveAmount);
    }
    if (LP.isPEventFired(LP.evKeyS_p)) {
        LP.setVal(1, -_moveAmount);
    }
    if (LP.isPEventFired(LP.evKeyA_p)) {
        LP.setVal(0, -_moveAmount);
    }
    if (LP.isPEventFired(LP.evKeyD_p)) {
        LP.setVal(0, _moveAmount);
    }
}

export function setFriction(_hspeed, _vspeed, _magnitudeOfFriction) {
    //compute friction vector
    var vU_friction = LP.getUnitVector([-_hspeed, -_vspeed]); //direction of friction is always opposite the velocity
    var friction = [vU_friction[0] * _magnitudeOfFriction, vU_friction[1] * _magnitudeOfFriction]; //should be positive
    return friction;
}

export function sum(_arrayOfValues) {
    var sum = 0;
    let i = 0;
    for (i = 0; i < _arrayOfValues.length; i += 1) {
        sum = sum + _arrayOfValues[i];
    }
    return sum;
}