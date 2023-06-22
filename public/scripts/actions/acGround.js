import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setBoundingBox([-15,0.5],[15,-0.5]);
    LP.setPosition(0,-11);
};

var update = (_delta) => {

}

export var acGround = LP.addAction(new LP.Action(init,update));
