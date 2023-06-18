import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setPosition(-5,5);
};

var update = (_delta) => {
    var hspeed = LP.getHSpeed();
    var vspeed = LP.getVSpeed();

    var acc = move(0.02);

    hspeed = applyFriction(hspeed, 0.005);
    vspeed = applyFriction(vspeed, 0.005);

    hspeed += acc[0];
    vspeed += acc[1];

    LP.setHSpeed(hspeed);
    LP.setVSpeed(vspeed);
};

export var acSquare = LP.addAction(new LP.Action(init,update));

function applyFriction(_speed, _amount){
    if (_speed > 0){
        return (_speed - _amount);
    }
    if (_speed < 0){
        return (_speed + _amount);
    }
    return _speed;
}

function move(_speed){
    var ax = 0;
    var ay = 0;

    if (LP.isPEventFired(LP.evKeyW_p)){
        ay = _speed;
    }
    if (LP.isPEventFired(LP.evKeyS_p)){
        ay = -_speed;
    }
    if (LP.isPEventFired(LP.evKeyA_p)){
        ax = -_speed;
    }
    if (LP.isPEventFired(LP.evKeyD_p)){
        ax = _speed;
    }
    return [ax,ay];

}