import * as LP from '../../LPEngine/LPEngine.js';
import { getRandomInteger } from './functions.js';

export class objDrawObject_MPS extends LP.LPGameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.elapsed = getRandomInteger(0, 100); //this is not part of parent class, only for child class
        this.x = 0;
        this.z = 5;
        this.init = () => {

        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.rotateMyself(_delta);

        };
        this.draw = () => {
            LP.draw_anchor([-5, 5], 0xff0000); //just to show regardless 2D or 3D, all draw functions work just fine
        };
    }
    checkEvents() {
    }
    rotateMyself(_delta) {
        this.elapsed += _delta;
        //update theta
        var theta = this.elapsed * 0.5;
        this.rotY = theta;

    }
}

