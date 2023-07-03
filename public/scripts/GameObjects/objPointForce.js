import * as LP from '../LPEngine/LPEngine.js';

export class objPointForce extends LP.LPGameObject {
    constructor() {
        super();
        this.forcex = 0;
        this.forcey = 0;
        this.selected = false;
        this.positionVectorX = 0;
        this.positionVectorY = 0;
        this.isPositionVectorSet = false;
        this.PVAngle = 0;
        this.torque = 0;

        this.init = () => {
            this.setPhysical(true);

        };
        this.update = (_delta) => {
            this.checkEvents();

            var forces = this.forceWithMouse();
            var mass = 10;
            var linearForce = [forces[0] / mass, forces[1] / mass];
            var friction = this.getFrictionForce(0.02); //0.005

            this.setAcceleration(LP.sumAllVectors([linearForce, friction]));

            var torque = forces[2];

            var alpha = torque - this.getRSpeed() * 0.02; //applying friction to angular acceleration

            this.setRSpeed(this.getRSpeed() + alpha);

        };
        this.draw = () => {
            //draw a line from pointForce to mouse
            var positionVector = this.transformPVtoInstance();
            if (this.isPositionVectorSet == true) {
                LP.draw_line(positionVector, LP.getMousePosition(), 0x00ff00); //the line from the positionVector to the mouse position is the pointForce
                LP.draw_anchor(LP.getMousePosition(), 0xff0000);
            }

            //draw the torque
            LP.draw_vector_origin([0, this.torque * 10], 0x00ff00, 0xff0000);
            LP.draw_line(this.getPosition(), positionVector, 0x0000ff);
        }

    };
    checkEvents() {
        if (LP.evMouseRegion(LP.getBoundingBox(this.getPrimitiveIndex()), LP.evMouseDown, this.getX(), this.getY(), this.getRot())) {
            this.selected = true;
            //the mouse down function already consumes the event
        }
        if (LP.isEventFired(LP.evMouseUp)) {
            this.selected = false;
            //dont consume this event because that way all instances will be deselected
        }
    }

    forceWithMouse() { //this will return an array, linearForceX, linearForceY, torque
        if (this.selected == 1) {
            if (this.isPositionVectorSet == false) {
                let positionVector = [LP.getMousePosition()[0] - this.getX(), LP.getMousePosition()[1] - this.getY()];
                this.positionVectorX = positionVector[0];
                this.positionVectorY = positionVector[1];
                this.PVAngle = LP.getTheta(positionVector) - this.getRot(); //recording the difference to use later
                //record its difference to instance angle
                //it is (mouseposition - instanceposition) because we want the vector pointing outwards from COM
                this.isPositionVectorSet = true;
            } //this difference is now recorded, later when we need the point at which force was applied, we use this difference

            let positionVector = this.transformPVtoInstance();

            
            var mouseXcurrent = LP.getMousePosition()[0];
            var mouseYcurrent = LP.getMousePosition()[1];
            var scale = 0.1; //the force was too much, we'll scale it down
            var pointForce = [(mouseXcurrent - positionVector[0]) * scale,
            (mouseYcurrent - positionVector[1]) * scale];

            //to get the r for torque, do the x2-x1, y2-y1 for instanceposition with positionvector
            var torque = this.getTorque(LP.v2Minusv1(this.getPosition(), positionVector), pointForce);
            this.torque = torque;

            /*var linearForce = LP.subtractMagnitudeFromVector(pointForce, torque);
            return [linearForce[0], linearForce[1],torque];*/

            return [pointForce[0], pointForce[1], torque];
        } else {
            this.isPositionVectorSet = false;
            return [0, 0, 0];
        }
    }
    getTorque(_positionVector, _pointForce) {
        var r = _positionVector;
        var F = _pointForce;
        var tau = this.crossProduct2D(r, F); //torque
        //tau is one single number, one component of a 3d vector, and is also either positive or negative
        //angular acceleration is one dimensional quantity in xy-plane
        //use tau directly into angular acceleration formula
        return tau;
    }
    getFrictionForce(_amount) {
        //compute friction vector 0.005
        var vU_friction = LP.getUnitVector([-this.getHSpeed(), -this.getVSpeed()]); //direction of friction is always opposite the velocity
        return [vU_friction[0] * _amount, vU_friction[1] * _amount];
    }
    transformPVtoInstance() { //tjhis function operates directly on this instance
        var _positionVector = [this.positionVectorX, this.positionVectorY];
        _positionVector = LP.transformVector(_positionVector, this.getX(), this.getY(), this.getRot() + this.PVAngle);
        return _positionVector;
    }
    crossProduct2D(_v1, _v2) {
        return _v1[0] * _v2[1] - _v1[1] * _v2[0];
    }
}
