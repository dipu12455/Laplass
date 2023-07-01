import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.makeVar(0);//(0)forcex = 0
    LP.makeVar(0); //(1)forcey = 0
    LP.makeVar(0); //(2)selected = 0
    LP.makeVar(0); //(3)positionVectorX = 0;
    LP.makeVar(0); //(4)positionVectorY = 0;
    LP.makeVar(0); //(5)isPositionVectorSet = 0
    LP.makeVar(0); //(6)PVAngle = 0;
    LP.makeVar(0); //(7)torque = 0; for drawing purposes
    LP.setPhysical(true);
};

var update = (_delta) => {
    checkEvents();

    var forces = forceWithMouse();
    var mass = 10;
    var linearForce = [forces[0] / mass, forces[1] / mass];
    var friction = getFrictionForce(0.02); //0.005

    LP.setAcceleration(LP.sumAllVectors([linearForce, friction]));

    var torque = forces[2];

    var alpha = torque - LP.getRSpeed() * 0.02;

    LP.setRSpeed(LP.getRSpeed() + alpha);

};



function checkEvents() {
    if (LP.evMouseRegion(LP.getBoundingBox(LP.getPrimitiveIndex()), LP.evMouseDown)) {
        LP.setVal(2, 1);
        //the mouse down function already consumes the event
    }
    if (LP.isEventFired(LP.evMouseUp)) {
        LP.setVal(2, 0);
        //dont consume this event because that way all instances will be deselected
    }
}

function forceWithMouse() { //this will return an array, linearForceX, linearForceY, torque
    if (LP.getVal(2) == 1) {
        LP.setPrintConsole(true);

        var isPositionVectorSet = LP.getVal(5);
        if (isPositionVectorSet == 0) {
            let positionVector = [LP.getMousePosition()[0] - LP.getX(), LP.getMousePosition()[1] - LP.getY()];
            LP.setVal(3, positionVector[0]);//(3)positionVectorX = getX() - mouseX
            LP.setVal(4, positionVector[1]);//(4)positionVectorY = getY() - mouseY
            LP.setVal(6, LP.getTheta(positionVector) - LP.getRot()); //recording the difference to use later
            //record its difference to instance angle
            //it is (mouseposition - instanceposition) because we want the vector pointing outwards from COM
            LP.setVal(5, 1); //(5) ispositionVectorSet = 1
        } //this difference is now recorded, later when we need the point at which force was applied, we use this difference

        let positionVector = transformPVtoInstance();


        var mouseXcurrent = LP.getMousePosition()[0];
        var mouseYcurrent = LP.getMousePosition()[1];
        var scale = 0.1; //the force was too much, we'll scale it down
        var pointForce = [(mouseXcurrent - positionVector[0]) * scale,
        (mouseYcurrent - positionVector[1]) * scale];

        //to get the r for torque, do the x2-x1, y2-y1 for instanceposition with positionvector
        var torque = getTorque(LP.v2Minusv1(LP.getPosition(), positionVector), pointForce);
        LP.setVal(7, torque); //(7)torque = torque just for drawing purposes

        /*var linearForce = LP.subtractMagnitudeFromVector(pointForce, torque);
        return [linearForce[0], linearForce[1],torque];*/

        return [pointForce[0], pointForce[1], torque];
    } else {
        LP.setPrintConsole(false);
        LP.setVal(5, 0); //(5) ispositionVectorSet = 0 turn off positionVector when releasing mouse
        return [0, 0, 0];
    }
}

//returns an array of two vectors, one is linear acceleration and the other is angular acceleration
function getTorque(_positionVector, _pointForce) {
    var r = _positionVector;
    var F = _pointForce;
    var tau = crossProduct2D(r, F); //torque
    //tau is one single number, one component of a 3d vector, and is also either positive or negative
    //angular acceleration is one dimensional quantity in xy-plane
    //use tau directly into angular acceleration formula
    return tau;
}

function getFrictionForce(_amount) {
    //compute friction vector 0.005
    var vU_friction = LP.getUnitVector([-LP.getHSpeed(), -LP.getVSpeed()]); //direction of friction is always opposite the velocity
    return [vU_friction[0] * _amount, vU_friction[1] * _amount];
}

function transformPVtoInstance() { //tjhis function operates directly on this instance
    var _positionVector = [LP.getVal(3), LP.getVal(4)];
    _positionVector = LP.transformVector(_positionVector, LP.getX(), LP.getY(), LP.getRot() + LP.getVal(6));
    return _positionVector;
}

var draw = () => {
    //draw a line from pointForce to mouse
    var torque = LP.getVal(7);
    var positionVector = transformPVtoInstance();
    if (LP.getVal(5) == 1) {
        LP.draw_line(positionVector, LP.getMousePosition(), 0x00ff00); //the line from the positionVector to the mouse position is the pointForce
        LP.draw_anchor(LP.getMousePosition(), 0xff0000);
    }

    //draw the torque
    LP.draw_vector_origin([0, torque * 10], 0x00ff00, 0xff0000);
    LP.draw_line(LP.getPosition(), positionVector, 0x0000ff);
}

//this function performs a cross product, but takes only two 2D vectors as input,
//and outputs only the z component of the cross product 3D vector
function crossProduct2D(_v1, _v2) {
    return _v1[0] * _v2[1] - _v1[1] * _v2[0];
}

export var pPointForce = LP.addProperty(init, update, draw);
