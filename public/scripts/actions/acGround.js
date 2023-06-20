import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setPosition(0,-11);
};

var update = (_delta) => {

}

export var acGround = LP.addAction(new LP.Action(init,update));
