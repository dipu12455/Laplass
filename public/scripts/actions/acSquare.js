import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setPosition(-5,5);
};

var update = (_delta) => {

    var hspeed = LP.getHSpeed();
    var vspeed = LP.getVSpeed();

    var gravity = -0.02;
    var ax = 0;
    var ay = gravity;
    
    vspeed += ay;

    LP.setHSpeed(hspeed);
    LP.setVSpeed(vspeed);

    //console.log(`${LP.getX()} ${LP.getY()}`);
    if (LP.isEventFired(LP.evKeyP)) {
        LP.timePause();
        LP.turnOffEvent(LP.evKeyP);
    }
};

export var acSquare = LP.addAction(new LP.Action(init,update));
