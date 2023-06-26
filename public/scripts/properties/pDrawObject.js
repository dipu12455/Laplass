import * as LP from '../LPEngine/LPEngine.js';

var init = () => { };
var update = () => { };

var draw = () => {
    //draw a circle in the center just to test collision function with
    LP.draw_circle([0, 0], 2, 0x000000);
}

export var pDrawObject = LP.addProperty(init, update, draw);