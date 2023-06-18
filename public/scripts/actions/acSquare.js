import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setPosition(-5,5);
};

var update = (_delta) => {
    var ay = 0;
    var amount = 0.02;

    if (LP.isPEventFired(LP.evKeyG_p)){
        ay = -amount;
    }
    if (LP.isPEventFired(LP.evKeyS_p)){
        ay = amount;
    }
    LP.setVSpeed(LP.getVSpeed() + ay);
};

export var acSquare = LP.addAction(new LP.Action(init,update));