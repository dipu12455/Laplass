import * as LP from '../LPEngine/LPEngine.js';

var elapsed = 0;
var X = 0;
var textSize = 0.5;
var init = () => {

}

var update = (_delta) => {
    //text test start
    elapsed += _delta;
    var animate = Math.cos(elapsed / 50.0);
    X = -7 + animate * 9;
}

var draw = () => {
    LP.draw_anchor([-5, 5], 0xff0000);
    if (X < 0) { //to check conditional rendering of text
        LP.draw_text(`Hello World ${X}`, [X, 5], textSize, 0x00ff00);
    }
    LP.draw_text("This is second text", [5, 3], textSize, 0xff0000);

}

export const pTextDrawObjectSample = LP.addProperty(init, update, draw);