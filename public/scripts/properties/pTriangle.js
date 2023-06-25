import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.setBoundingBox([-2, 2], [2, -2]);
    LP.makeVar(150); //(0)elapsed = 0;
}

var update = (_delta) => {
    var temp = LP.getVal(0);
    LP.setVal(0, temp + _delta); //this.(0)elapsed += delta;
    var elapsed = LP.getVal(0);
    var animate = Math.cos(elapsed / 50.0);
    var animate2 = Math.sin(elapsed / 50.0);
    var animateSlower = Math.cos(elapsed / 100.0);

    LP.setRot(LP.getRot() - 1.0 * _delta);
    LP.setX(animateSlower * 10);
    LP.setY(animate2 * 10); //trst
}

var draw = () => {

}

export const pTriangle = LP.addProperty(init, update, draw);
