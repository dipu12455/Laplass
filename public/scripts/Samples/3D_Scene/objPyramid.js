import * as LP from '../../LPEngine/LPEngine.js';
import { getRandomInteger } from './functions.js';

export class objPyramid extends LP.LPGameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.elapsed = getRandomInteger(0,100); //this is not part of parent class, only for child class
        this.x = getRandomInteger(-5,5);
        this.z = 5;
        this.init = () => {

        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.elapsed += _delta;

            //update theta
            var theta = this.elapsed * 0.5;
            this.rotY = theta;
        };
        this.draw = () => {
            LP.draw_anchor([-5,5],0xff0000); //just to show regardless 2D or 3D, all draw functions work just fine
        };
    }
    checkEvents() {
        if (LP.isPEventFired(LP.evArrowUp_p)) {
            this.y += 0.1;
        }
        if (LP.isPEventFired(LP.evArrowDown_p)) {
            this.y -= 0.1;
        } //raise the triangle up and down
        if (LP.isPEventFired(LP.evArrowLeft_p)) {
            this.rotZ += 1;
        }
        if (LP.isPEventFired(LP.evArrowRight_p)) {
            this.rotZ -= 1;
        }
        if (LP.isPEventFired(LP.evKeyQ_p)) {
            this.rotY += 1;
        }
        if (LP.isPEventFired(LP.evKeyE_p)) {
            this.rotY -= 1;
        }
    }
}

