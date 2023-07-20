import * as EN from '../../Engine/Engine.js';
import { getFollowedInstance_3D } from '../../Engine/modules/Instances.js';
import { getRandomInteger } from './functions.js';

export class objPyramid extends EN.GameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.color = [getRandomInteger(0, 255) / 255, getRandomInteger(0, 255) / 255, getRandomInteger(0, 255) / 255];
        this.elapsed = getRandomInteger(0, 100); //this is not part of parent class, only for child class
        this.x = getRandomInteger(-5, 5);
        this.z = 5;

        this.animate = 0;
        this.animate2 = 0;
        this.animate3 = 0;
        this.selected = false;
        this.init = () => {

        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.elapsed += _delta;

            //update theta
            var theta = this.elapsed * 0.5;
            this.animate = Math.cos(this.elapsed / 50.0);
            this.animate2 = Math.sin(this.elapsed / 50.0);
            this.animate3 = Math.sin(this.elapsed / 50.0);
            this.rotY = theta;
            this.x = this.animate*5;
            this.y = this.animate2*5;
            this.z = this.animate3*5;
        };
        this.draw = () => {
            EN.draw_anchor([this.animate, 5], 0xff0000); //just to show regardless 2D or 3D, all draw functions work just fine
        };
    }
    checkEvents() {
        if (this.selected) {
        }
    }
}

