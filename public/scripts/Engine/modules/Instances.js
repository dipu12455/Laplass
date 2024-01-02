import { List } from "./List.js";
import { is3DMode, isTimeRunning, printConsole, set3DMode, setPrintConsole } from "./EngineCore.js";
import { turnOffEvents } from "./Events.js";
import { getPrimitive, transform_primitive } from "./Primitives.js";
import { getCollisions } from "./Collision.js";
import { getMag, isVectorWithinRange, v1Plusv2 } from "./Vector.js";
import { getRotationMatrixX, getRotationMatrixY, getRotationMatrixZ, getTranslationMatrix, makeIdentityMatrix, mat4x4, matrixMultiMatrix } from "./3D/Matrix4x4.js";
import { updateCamera } from "./3D/Draw3D.js";
import { v1Plusv2_3D } from "../Engine.js";
import { isVectorWithinRange_3D } from "./3D/Vector3D.js";

export class GameObject {
    constructor() {
        this.name = ""; //used to identify instances by their parent objects, for collision purposes
        //instance ids are obtained from the instances array, need not be stored per instance
        this.id = -1;
        this.primitiveIndex = -1;
        this.spriteIndex = -1;
        // the following are all in LPE coordinate system
        this.hidden = false;
        this.freeze = false;
        this.x = 0;
        this.y = 0;
        this.rot = 0;
        this.xprev = 0;
        this.yprev = 0;
        this.rotprev = 0;
        this.hspeed = 0;
        this.vspeed = 0;
        this.rspeed = 0;
        this.collisionList = new List();
        this.physical = false;
        this.mass = 1; //1 is default, so it won't multiply anything
        this.acceleration = [0, 0];
        this.is3D = false;
        /*the GameObject_3D class is a child of this class, when an instance of that
        class is created, it will set this.is3D to true. In order for main game loop to
        seamlessly classify between drawing 2D and 3D object. there is 3D switch in LPE.
        once LPE detects an instance of GameObject_3D, it will switch to 3D mode.
        otherwise all 3D functions will be disabled.*/
        this.init = () => { };
        this.update = (_delta) => { };
        this.draw = () => { };
    }
    getId() {
        return this.id;
    }
    getPrimitiveIndex() {
        return this.primitiveIndex;
    }
    setPrimitiveIndex(_primitiveIndex) {
        this.primitiveIndex = _primitiveIndex;
    }
    getSpriteIndex() {
        return this.spriteIndex;
    }
    setSpriteIndex(_spriteIndex) {
        this.spriteIndex = _spriteIndex;
    }
    setX(_x) {
        this.xprev = this.x;
        this.x = _x;
    }
    setY(_y) {
        this.yprev = this.y;
        this.y = _y;
    }
    setPosition(_position) {
        this.xprev = this.x;
        this.yprev = this.y;

        this.x = _position[0];
        this.y = _position[1];
    }
    setRot(_rot) {
        this.rotprev = this.rot;
        this.rot = _rot;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getPosition() {
        return [this.x,
        this.y];
    }
    getRot() {
        return this.rot;
    }
    getXPrev() {
        return this.xprev;
    }
    getYPrev() {
        return this.yprev;
    }
    getRotPrev() {
        return this.rotprev;
    }

    setHSpeed(_hspeed) {
        this.hspeed = _hspeed;
    }
    setVSpeed(_vspeed) {
        this.vspeed = _vspeed;
    }
    setRSpeed(_rspeed) {
        this.rspeed = _rspeed;
    }
    getHSpeed() {
        return this.hspeed;
    }
    getVSpeed() {
        return this.vspeed;
    }
    getRSpeed() {
        return this.rspeed;
    }
    hide() {
        this.hidden = true;
    }
    unhide() {
        this.hidden = false;
    }
    isHidden() {
        return this.hidden;
    }
    freeze() {
        this.freeze = true;
    }
    unfreeze() {
        this.freeze = false;
    }
    isFrozen() {
        return this.freeze;
    }
    collisionListAdd(_array) { //_array is [targetInstanceId, angleOfContact]
        this.collisionList.add(_array);
    }
    setPhysical(_state) { //set it as true or false
        this.physical = _state;
    }

    isPhysical() {
        return this.physical;
    }
    setMass(_mass) {
        this.mass = _mass;
    }
    getMass() {
        return this.mass;
    }
    setAcceleration(_acc) {
        this.acceleration = _acc;
    }
    getAcceleration() {
        return this.acceleration;
    }
    setVelocity(_velocity) {
        this.hspeed = _velocity[0];
        this.vspeed = _velocity[1];
    }
    getVelocity() {
        return [this.hspeed, this.vspeed];
    }
    //checks the collision list to see if this current instance has collision with the provided instance
    //returns angle of contact if collision detected, else returns -1
    collisionListExists(_targetName) { //change its name to collisionListExists(target.name), iterate through your list, see if any of those instances match the target name
        var i = 0;
        for (i = 0; i < this.collisionList.getSize(); i += 1) {
            var targetInstanceIndex = this.collisionList.get(i)[0];

            if (INSTANCES.get(targetInstanceIndex).name == _targetName) {

                var angleOfContact = this.collisionList.get(i)[1];
                return angleOfContact;
            }
        }
        return -1;
    }
    //this function obtains the instance's primitive, transforms it to the instance's
    //orientation, then computes the center coordinate by averaging all the vertices
    findCenterOfInstancePrimitive() {
        var prim1 = getPrimitive(this.primitiveIndex);
        var prim2 = transform_primitive(prim1, this.x, this.y, this.rot);
        let i = 0;
        var sumX = 0; var sumY = 0;
        for (i = 0; i < prim2.getSize(); i += 1) {
            sumX = sumX + prim2.get(i)[0];
            sumY = sumY + prim2.get(i)[1];
        }
        return [sumX / prim2.getSize(), sumY / prim2.getSize()];

    }

}

export var INSTANCES = new List(); //list of all instances in LPE

//use the GameObject class to make a child class that is the game 'object'. define attributes and behaviors for that object class.
//then create an instance of that object class which is the 'instance', its this instance you add to the INSTANCES list.
//if you make changes to x or y or even the spriteindex, you change one instance of that object, not all of them.
//object files are part of game code, not LP code.

//some functions to manipulate the INSTANCES list, to make it more readable.

//create an instance (new LP.GameObject), then returns its index for use in other functions
export function addInstance(_instance) {
    var index = INSTANCES.add(_instance);
    INSTANCES.get(index).id = index;
}

export function destroyInstance(_index) {
    INSTANCES.delete(_index);
}

export function initInstances() {
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        //run the init function of this instance
        INSTANCES.get(i).init();
    }
}


export function updateInstances(_delta) {
    /* changed the order of things happening just like in bounce equation.
    the update function of the instance property only deals with accelerations, nothing else.
    after that, next step is directly into collision detection. the objects velocities haven't been touched yet.
    here, you don't replace the previous acch value, but add to it -- depending on how the collision went.
    then now you have a final acch after all needed processing, and this is where you finally update velocity.
    this way, only the acch value goes through change throghout the frame, and velocity is updated only once.*/
    if (isTimeRunning()) {
        runUpdateFunctions(_delta); //updates accelerations of all instances
        getCollisions(); //add any necessary acch to each instance to account for collisions
        updateVelocitiesAndPositions(_delta, 0.02);//def-0.009factor the acch of all instances into their respective velocities, and trajectories
    }/* a key is pressed, a force is applied on an instance. That force application is recorded into its acceleration amount.
    Before letting the force affect the velocity of the object, the collision calculates of a possible collision,
    and given the instance's initial velocity, we know *what* it's final velocity *should* be. To reach *that* final velocity,
    the acch that gets it there, is v2 - v1. This, acch is then added into the acceleration that would have been
    from the force applied on the instance. And this final collision-controled acceleration is what you allow the object to move with.
    The force applied tells how much to move that instance. the collision then takes what the force outputs,
    and tells the instance *how much it is allowed* to move. "You got this amount of force, but sorry, your final velocity should be this
    and this, so you can ony accelerate this much."
    this is what allows LPE to prevent objects from overlapping each other, without having to do any of the xprev/yprev or unoverlap.
    The exchange of momentum function outputs the exact acceleration needed to prevent an overlap. 
    But, the order of object motion processing needs to be
    **specifically** in the **exact order** laid out in here.*/

    if (is3DMode) {
        updateCamera(); //update camera before any mesh drawing function
    }
    turnOffEvents(); //only for non-persistent events

}

function runUpdateFunctions(_delta) {
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        //if (!isFrozen())
        /*turn on 3D mode if a 3D instance found,
        this function is placed here because this is the very beginning of the program loop*/
        if (INSTANCES.get(i).is3D) { set3DMode(true); }

        //run the update function of this instance
        INSTANCES.get(i).update(_delta);
    }
}
function updateVelocitiesAndPositions(_delta, _threshold) {
    //loop through all instances to factor their velocities and positions according to their acchs.
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        //get the instance
        var current = INSTANCES.get(i);
        if (!current.is3D) {
            //get its hspeed and vspeed
            var velocity = current.getVelocity();
            var acc = current.getAcceleration();
            velocity = v1Plusv2(velocity, acc);

            //if velocity is too small, make it equal to zero
            if (isVectorWithinRange(velocity, 0, _threshold)) {
                velocity = [0, 0];
            }

            current.setVelocity(velocity);

            //translate the instance according to their speed
            current.setPosition(
                v1Plusv2(current.getPosition(),
                    current.getVelocity()));
            current.setRot(current.getRot() + current.getRSpeed());
        } else { //for 3D instances
            //the following look like same functions, but they are overloaded by GameObject_3D
            var velocity = current.getVelocity();
            var acc = current.getAcceleration();
            velocity = v1Plusv2_3D(velocity, acc);
            
            //isVectorWithinRange - TODO
            //if velocity is too small, make it equal to zero
            if (isVectorWithinRange_3D(velocity, 0, 0.004)) { //a good rule of thumb is put range as one unit below friction. like fric is 0.005 then put thres 0.004
                velocity = [0, 0, 0, 1];
            }

            current.setVelocity(velocity);

            //translate 3D instances according to their speed
            current.setPosition(
                v1Plusv2_3D(current.getPosition(),
                current.getVelocity()));
            current.setRotX(current.getRotX() + current.getRXSpeed());
            current.setRotY(current.getRotY() + current.getRYSpeed());
            current.setRotZ(current.getRotZ() + current.getRZSpeed());
        }
    }
}

export function flushCollisions() {
    var i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        if (!INSTANCES.get(i).is3D) {
            INSTANCES.get(i).collisionList = new List();
        }
    }
}


//GameObject_3D functions and variables-------------------------------------------------------------

export class GameObject_3D extends GameObject {
    constructor(_mesh) {
        super();
        this.is3D = true; //this is switched true, to tell engine to turn on 3D mode
        this.isCamera = false;
        this.meshID = _mesh; //this is meant to be set in instance
        this.color = [1, 0, 0]; //array of RGB, A = [R,G,B]. determines the color of the mesh
        this.z = 0; //move it furhter into the screen, meant to be set in instance
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;
        this.zprev = 0;
        this.rotXprev = 0;
        this.rotYprev = 0;
        this.rotZprev = 0;
        this.dspeed = 0; //like hspeed and vspeed, this stands for depth speed. Positive means into the screen
        this.rXspeed = 0; //speed of rotation in the X axis
        this.rYspeed = 0; //speed of rotation in the Y axis
        this.rZspeed = 0; //speed of rotation in the Z axis
        this.acceleration3D = [0, 0, 0, 0]; //this is now a 4-tuple vector

        this.matWorld = new mat4x4(); //matWorld is local to each object, says how to transform this object into a place in the world
    }
    setZ(_z) {
        this.zprev = this.z;
        this.z = _z;
    }
    setPosition(_position) {
        this.xprev = this.x;
        this.yprev = this.y;
        this.zprev = this.z;

        this.x = _position[0];
        this.y = _position[1];
        this.z = _position[2];
    }
    setRotX(_rotX) {
        this.rotXprev = this.rotX;
        this.rotX = _rotX;
    }
    setRotY(_rotY) {
        this.rotYprev = this.rotY;
        this.rotY = _rotY;
    }
    setRotZ(_rotZ) {
        this.rotZprev = this.rotZ;
        this.rotZ = _rotZ;
    }
    getZ() {
        return this.z;
    }
    getPosition() {
        return [this.x, this.y, this.z, 1];
    }
    getRotX() {
        return this.rotX;
    }
    getRotY() {
        return this.rotY;
    }
    getRotZ() {
        return this.rotZ;
    }
    getZPrev() {
        return this.zprev;
    }
    getRotXPrev() {
        return this.rotXprev;
    }
    getRotYPrev() {
        return this.rotYprev;
    }
    getRotZPrev() {
        return this.rotZprev;
    }
    setDSpeed(_dspeed) {
        this.dspeed = _dspeed;
    }
    setRXSpeed(_rXspeed) {
        this.rXspeed = _rXspeed;
    }
    setRYSpeed(_rYspeed) {
        this.rYspeed = _rYspeed;
    }
    setRZSpeed(_rZspeed) {
        this.rZspeed = _rZspeed;
    }
    getDSpeed() {
        return this.dspeed;
    }
    getRXSpeed() {
        return this.rXspeed;
    }
    getRYSpeed() {
        return this.rYspeed;
    }
    getRZSpeed() {
        return this.rZspeed;
    }
    setAcceleration(_acc) {
        this.acceleration = _acc;
    }
    getAcceleration() {
        return this.acceleration;
    }
    setVelocity(_velocity) {
        this.hspeed = _velocity[0];
        this.vspeed = _velocity[1];
        this.dspeed = _velocity[2];
    }
    getVelocity() {
        return [this.hspeed, this.vspeed, this.dspeed, 1];
    }

}

export function updateWorldMatrixForInstance(_instance) {
    var matRotX = getRotationMatrixX(_instance.rotX);
    var matRotY = getRotationMatrixY(_instance.rotY);
    var matRotZ = getRotationMatrixZ(_instance.rotZ);
    var matTrans = getTranslationMatrix(_instance.x, _instance.y, _instance.z); //moving the mesh a little into the distance

    _instance.matWorld = makeIdentityMatrix();
    _instance.matWorld = matrixMultiMatrix(matRotX, matRotY);
    _instance.matWorld = matrixMultiMatrix(_instance.matWorld, matRotZ);
    _instance.matWorld = matrixMultiMatrix(_instance.matWorld, matTrans);
}

var followedInstance_3D = null; //variable that stores reference to currently selected instance to be followed
var zooming = false; //variable that signals whether user is currently zooming in or out

//only for following 3d instances, 2d instances don't have properties that the 3d functions try to read, so there will be error
export function setFollowedInstance_3D(_instance) {
    if (!_instance.is3D) return null;
    followedInstance_3D = _instance;
}

export function getFollowedInstance_3D() {
    return followedInstance_3D;
}

export function isZooming(){
    return zooming;
}

export function setZooming(_state){
    zooming = _state;
}

