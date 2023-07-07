//demostrates how to use the keyboard to move a 'physical' object around using forces. Also can be used for non-physical objects. the events and codes are the same

import * as LP from '../LPEngine/LPEngine.js'; //refactor the path as needed

export class objMovesWithKeyboard extends LP.LPGameObject {
    constructor() {
        super();
        this.forcex = 0;
        this.forcey = 0;
        this.selected = 0;

        this.init = () => {
            LP.setPhysical(true); //this turns the instance that embues this property into a 'physical' object that the physics engine will interact with
        }

        this.update = (_delta) => {
            this.checkEvents();

            var hspeed = this.getHSpeed();
            var vspeed = this.getVSpeed();
            var force = [this.forcex, this.forcey];
            var force2 = 0.01;

            var gravity = -0.02;

            //compute friction vector
            var mag_fric = 0.005; //friction magnitude
            var vU_friction = LP.getUnitVector([-hspeed, -vspeed]); //direction of friction is always opposite the velocity
            var friction = [vU_friction[0] * mag_fric, vU_friction[1] * mag_fric] //should be positive

            var ax = force[0] + friction[0];
            var ay = force[1] + friction[1];

            //reset forces after velocities have been updated for this frame
            this.resetForces();

            this.setAcceleration([ax, ay]);
        };

        this.draw = () => {
            LP.draw_anchor(this.findCenterOfInstancePrimitive(), 0xff0000);
        }
    }
    //the rest of this file will look like pSquareManual.js
    checkEvents() {
        if (LP.evMouseClickRegion(LP.getBoundingBox(this.getPrimitiveIndex()))) {
            this.selected = 1;
        }
        //press G to deselect
        if (LP.isEventFired(LP.evKeyG)) {
            this.selected = 0;
        }
        var moveAmount = 0.01;
        if (this.selected == 1) {
            if (LP.isPEventFired(LP.evKeyW_p)) {
                this.forcey = moveAmount;
            }
            if (LP.isPEventFired(LP.evKeyS_p)) {
                this.forcey = -moveAmount;
            }
            if (LP.isPEventFired(LP.evKeyA_p)) {
                this.forcex = -moveAmount;
            }
            if (LP.isPEventFired(LP.evKeyD_p)) {
                this.forcex = moveAmount;
            }
        }
    }
    resetForces() {
        this.forcex = 0;
        this.forcey = 0;
    }
}