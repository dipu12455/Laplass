import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setPosition(-5,5);
};

var update = (_delta) => {
    LP.setVSpeed(-0.2);
};

export var acSquare = LP.addAction(new LP.Action(init,update));