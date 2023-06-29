import * as LP from '../LPEngine/LPEngine.js';
import { triangle1, triangle2 } from '../Scene.js';

var init = () => {
}

var update = (_delta) => {
}

var draw = () => {
    var collision = LP.checkCollisionPrimitivesInstances(triangle1, triangle2);
    if (collision[0] == 1) {
        //draw mtv
        LP.draw_vector_origin([collision[1] * collision[3], collision[2] * collision[3]], 0x00ff00, 0xff0000);
    }
}

export const pDrawObject = LP.addProperty(init, update, draw);