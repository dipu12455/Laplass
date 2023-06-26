import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setPrintConsole(true);

}

var update = () => {
    LP.printConsole(`test1`);
    LP.setPrintConsole(false);

}

var draw = () => {
    LP.draw_circle([LP.getX(),LP.getY()],5,0x0000ff);

}

export var pCircle = LP.addProperty(init, update, draw);