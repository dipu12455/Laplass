import * as LP from '../LPEngine/LPEngine.js';

export class objSquare extends LP.LPGameObject {
    constructor() {
        super();
        this.forcex = 0;
        this.forcey = 0;
        this.selected = false;
        this.direction = 0; //if 1, then right, if -1, then left. set this value at start of instance creation

        this.init = () => {
            this.setPhysical(true);
            if (this.getX() < 0) this.direction = 1;
            if (this.getX() > 0) this.direction = -1;
        };

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

            if (this.direction == 1) {
                ax += force2;
            }
            if (this.direction == -1) {
                ax -= force2;
            }

            this.resetForces();

            this.setAcceleration([ax, ay]);
        };

        this.draw = () => {
            LP.draw_anchor(this.findCenterOfInstancePrimitive(), 0xff0000);
        };
    };

    checkEvents() {
        //select this square if clicked on
        if (LP.evMouseClickRegion(LP.getBoundingBox(this.getPrimitiveIndex()))) {
            this.selected = true;
        }
        //press G to deselect
        if (LP.isEventFired(LP.evKeyG)) {
            this.selected = false;
        }
        var moveAmount = 0.01;
        if (this.selected == true) {
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