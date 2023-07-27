import * as EN from '../../Engine/Engine.js';
import { getRandomInteger } from './functions.js';

export class objPyramid extends EN.GameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.elapsed = getRandomInteger(0, 100); //this is not part of parent class, only for child class
        this.x = getRandomInteger(-5, 5);
        this.z = 5;

        this.animate = 0;
        this.animate2 = 0;
        this.animate3 = 0;
        this.selected = false;

        this.force = [0, 0, 0, 1];

        this.record = null;

        this.init = () => {

        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.warp3D();
            this.elapsed += _delta;

            //update theta
            var theta = this.elapsed * 0.5;
            this.animate = Math.cos(this.elapsed / 50.0);
            this.animate2 = Math.sin(this.elapsed / 50.0);
            this.animate3 = Math.sin(this.elapsed / 50.0);
            this.rotY = theta;

            var friction = this.getFrictionForce_3D(0.005);

            var sumOfForces = EN.v1Plusv2_3D(this.force, friction);

            this.setAcceleration(sumOfForces);

            this.record = this.force;

            this.force = [0, 0, 0, 1];
        };
        this.draw = () => {
            EN.draw_anchor([this.animate, 0], 0xff0000); //just to show regardless 2D or 3D, all draw functions work just fine
            if (this.selected) {
                EN.draw_text(`this.forceX = ${this.record[0]}`, [-10, 7], 0.5, 0x000000);
                EN.draw_text(`this.forceY = ${this.record[1]}`, [-10,6], 0.5, 0x000000);
                EN.draw_text(`this.forceZ = ${this.record[2]}`, [-10,5], 0.5, 0x000000);
                EN.draw_text(`this.forceW = ${this.record[3]}`, [-10,4], 0.5, 0x000000);
            }
        };
    }
    checkEvents() {
        if (this.selected) {
            var forceAmount = 0.01;
            //if following is active, use these controls to move the instance instead
            if (EN.isPEventFired(EN.evKeyW_p)) {
                //getFollowedInstance_3D().z += 0.1;
                //getFollowedInstance_3D().setDSpeed(0.1);
                this.force[2] += forceAmount;

            }
            if (EN.isPEventFired(EN.evKeyS_p)) {
                //getFollowedInstance_3D().z -= 0.1;
                //getFollowedInstance_3D().setDSpeed(-0.1);
                this.force[2] -= forceAmount;
            } //raise the triangle up and down
            if (EN.isPEventFired(EN.evKeyA_p)) {
                //getFollowedInstance_3D().x -= 0.1;
                //getFollowedInstance_3D().setHSpeed(-0.1);
                this.force[0] -= forceAmount;
            }
            if (EN.isPEventFired(EN.evKeyD_p)) {
                //getFollowedInstance_3D().x += 0.1;
                //getFollowedInstance_3D().setHSpeed(0.1);
                this.force[0] += forceAmount;
            }
            if (EN.isPEventFired(EN.evKeyR_p)) {
                //getFollowedInstance_3D().y += 0.1;
                //getFollowedInstance_3D().setVSpeed(0.1);
                this.force[1] += forceAmount;
            }
            if (EN.isPEventFired(EN.evKeyF_p)) {
                //getFollowedInstance_3D().y -= 0.1;
                //getFollowedInstance_3D().setVSpeed(-0.1);
                this.force[1] -= forceAmount;
            }

        }
    }
    getFrictionForce_3D(_amount) {
        //computes the friction vector in three dimensions
        //the direction of friction exactly opposite to the direction of motion, in 3D its just a flip of the velocity vector
        var vU_friction = EN.getUnitVector_3D([-this.getHSpeed(), -this.getVSpeed(), -this.getDSpeed(), 0]);
        return EN.scalarXVector_3D(_amount, vU_friction);
    }
    warp3D() {
        var range = 40;
        if (this.x > range) {
            this.x -= range*2;
        }
        if (this.x < -range) {
            this.x += range*2;
        }
        if (this.y > range) {
            this.y -= range*2;
        }
        if (this.y < -range) {
            this.y += range*2;
        }
        if (this.z > range) {
            this.z -= range*2;
        }
        if (this.z < -range) {
            this.z += range*2;
        }
    }

}

