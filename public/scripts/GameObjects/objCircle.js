import * as LP from '../LPEngine/LPEngine.js';


export class objCircle extends LP.LPGameObject {
    constructor() {
        super(); //always call the super() constructor to set all the properties of this class as its parent class
        //here goes this object's own properties
        this.forcex = 0;
        this.forcey = 0;

        //and then define this object's init, update, and draw functions
        this.init = () => {
        };

        this.update = (_delta) => {
            this.checkEvents();

            var hspeed = this.getHSpeed();
            var vspeed = this.getVSpeed();
            var force = [this.forcex, this.forcey];

            var gravity = -0.02;

            //compute friction vector
            var mag_fric = 0.005; //friction magnitude
            var vU_friction = LP.getUnitVector([-hspeed, -vspeed]); //direction of friction is always opposite the velocity
            var friction = [vU_friction[0] * mag_fric, vU_friction[1] * mag_fric] //should be positive


            var ax = force[0] + friction[0];
            var ay = force[1] + friction[1];

            var acc = [ax, ay];

            hspeed += acc[0];
            vspeed += acc[1];

            //if velocity is too small, make it equal to zero
            if (LP.isVectorWithinRange([hspeed, vspeed], 0, 0.009)) {
                hspeed = 0;
                vspeed = 0;
            }

            //reset forces after velocities have been updated for this frame
            resetForces();

            LP.setHSpeed(hspeed);
            LP.setVSpeed(vspeed);
        }

        this.draw = () => {
            LP.draw_circle([this.getX(), this.getY()], 2, 0x000000);
            var collision = this.checkCollision();
            if (collision[0] == 1) {
                LP.draw_vector_origin(LP.getVectorRTHeta(5, collision[1]), 0x00ff00, 0xff0000);
            }
        }
    }
    checkEvents() {
        var moveAmount = 0.01;

        if (LP.isPEventFired(LP.evKeyW_p)) {
            this.forcey = moveAmount
        }
        if (LP.isPEventFired(LP.evKeyS_p)) {
            this.forcey = -moveAmount
        }
        if (LP.isPEventFired(LP.evKeyA_p)) {
            this.forcex = -moveAmount
        }
        if (LP.isPEventFired(LP.evKeyD_p)) {
            this.forcex = moveAmount;
        }
    }
    checkCollision() {
        return LP.checkCollisionCircles([this.getX(), this.getY()], 2, [0, 0], 2);
    }
    resetForces() {
        this.forcex = 0;
        this.forcey = 0;
    }
}




