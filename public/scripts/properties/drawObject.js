import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
}

var update = (_delta) => {
}

var draw = () => {
    LP.draw_anchor(LP.rotateVector([0,1],90),0xff0000);
}

export const pDrawObject = LP.addProperty(init, update, draw);