import { LPList } from "./LPList.js";
import { getProperty } from "./LPProperties.js";
import { isTimeRunning, printConsole, setPrintConsole } from "./LPEngineCore.js";
import { turnOffEvents } from "./LPEvents.js";
import { getPrimitive, transform_primitive } from "./LPPrimitives.js";
import { getCollisions } from "./LPCollision.js";
import { isVectorWithinRange } from "./LPVector.js";

export class BoundingBox {
    constructor(_p1, _p2) {
        this.p1 = [0, 0];
        this.p2 = [0, 0];
    }
    set(_p1, _p2) {
        this.p1 = _p1;
        this.p2 = _p2;
    }
    getP1() {
        return this.p1;
    }
    getP2() {
        return this.p2;
    }
}

export class LPInstance {
    constructor() {
        this.primitiveIndex = -1;
        this.spriteIndex = -1;
        this.propertyIndex = -1;
        this.boundingBox = new BoundingBox([0, 0], [0, 0]);
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
        this.vars = new LPList(); //list that stores custom variables
        this.collisionList = new LPList();
        this.physical = false;
        this.mass = 1; //1 is default, so it won't multiply anything
        this.acceleration = [0, 0];
    }
}

class LPInstanceList extends LPList {
    constructor() {
        super();
        this.NullList = []; //stores boolean true or false values
    }
    isNull(_index) {
        return this.NullList[_index];
    }
    setNull(_index, _value) {
        this.NullList[_index] = _value;
    }
    add(_item) {
        // add the item

        //first see if there is a null spot
        var i = 0;
        for (i = 0; i < this.getSize(); i += 1) {
            if (this.isNull(i)) {
                this.setNull(i, false);
                this.put(_item, i);
                return i; //return the index
            }
        }
        this.array[this.indexCounter] = _item;
        this.indexCounter += 1;
        return this.indexCounter - 1;
    }
}



export var INSTANCES = new LPInstanceList(); //list of all instances in LPE

//use the LPObject class to make a child class that is the game 'object'. define attributes and behaviors for that object class.
//then create an instance of that object class which is the 'instance', its this instance you add to the INSTANCES list.
//if you make changes to x or y or even the spriteindex, you change one instance of that object, not all of them.
//object files are part of game code, not LP code.

//some functions to manipulate the INSTANCES list, to make it more readable.

var selectedInstance = -1; //remembers which instance is being worked on, stores an instanceIndex, -1 means nothing is selected
export function selectInstance(_index) {
    selectedInstance = _index;
}
//returns the index that is currently selected
export function getSelectedInstance() {
    if (selectedInstance == -1) console.error(`No instance selected.`);
    return selectedInstance;
}
function fetchInstance() {
    //fetches the currently selected instance object
    return INSTANCES.get(getSelectedInstance());
}
export function unSelectAll() {
    selectedInstance = -1;
}

//create an instance (new LP.LPInstance), then returns its index for use in other functions
export function addInstance(_primitiveIndex, _spriteIndex, _propertyIndex) {
    let ind = INSTANCES.add(new LPInstance());
    selectInstance(ind);
    setPrimitiveIndex(_primitiveIndex);
    setSpriteIndex(_spriteIndex);
    setPropertyIndex(_propertyIndex);
    unSelectAll();
    return ind;
}

export function initInstances() {
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        selectInstance(i);
        var propertyIndex = getPropertyIndex();
        if (propertyIndex != -1) { //if index is -1, then there is no Property for this instance
            var initFunction = getProperty(propertyIndex).getInitFunction();
            initFunction();
        }
        unSelectAll();
    }
}

export function updateInstances(_delta) {
    /* changed the order of things happening just like in bounce equation.
    the update function of the instance property only deals with accelerations, nothing else.
    after that, next step is directly into collision detection. the objects velocities haven't been touched yet.
    here, you don't replace the previous acch value, but add to it -- depending on how the collision went.
    then now you have a final acch after all needed processing, and this is where you finally update velocity.
    this way, only the acch value goes through change throghout the frame, and velocity is updated only once.*/
    if (isTimeRunning()) { //allows the ability to pause all Property, drawing loop still continues, just instances don't update their orientations so everything freezes in place.
        runUpdateFunctions(_delta); //updates accelerations of all instances
        getCollisions(); //add any necessary acch to each instance to account for collisions
        factorVelocitiesAndPositions(_delta);//factor the acch of all instances into their respective velocities, and trajectories
    }
    turnOffEvents(); //only for non-persistent events

}

function runUpdateFunctions(_delta) {
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        selectInstance(i);
        var propertyIndex = getPropertyIndex();
        if (propertyIndex != -1 && !isFrozen()) { //if index is -1, then there is no Property for this instance
            var updateFunction = getProperty(propertyIndex).getUpdateFunction();
            updateFunction(_delta); //only the accs of instances are updated
        }
        unSelectAll();
    }
}
function factorVelocitiesAndPositions(_delta) {
    //loop through all instances to factor their velocities and positions according to their acchs.
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        selectInstance(i);
        //get its hspeed and vspeed
        var hspeed = getHSpeed();
        var vspeed = getVSpeed();

        var acc = getAcceleration();

        hspeed += acc[0];
        vspeed += acc[1];

        //if velocity is too small, make it equal to zero
        if (isVectorWithinRange([hspeed, vspeed], 0, 0.009)) {
            hspeed = 0;
            vspeed = 0;
        }

        setHSpeed(hspeed);
        setVSpeed(vspeed);

        //translate the instance according to their speed
        setX(getX() + getHSpeed() * _delta);
        setY(getY() + getVSpeed() * _delta);
        setRot(getRot() + getRSpeed() * _delta);
    }
}

//the instances are registered with game engine and they live in this file in the INSTANCES list. the following functions are used to access
//and change attrs of instances

export function getPrimitiveIndex() {
    return fetchInstance().primitiveIndex;
}
export function setPrimitiveIndex(_primitiveIndex) {
    fetchInstance().primitiveIndex = _primitiveIndex;
}
export function getSpriteIndex() {
    return fetchInstance().spriteIndex;
}
export function setSpriteIndex(_spriteIndex) {
    fetchInstance().spriteIndex = _spriteIndex;
}
export function getPropertyIndex() {
    return fetchInstance().propertyIndex;
}
export function setPropertyIndex(_propertyIndex) {
    fetchInstance().propertyIndex = _propertyIndex;
}
export function setX(_x) {
    fetchInstance().xprev = fetchInstance().x;
    fetchInstance().x = _x;
}
export function setY(_y) {
    fetchInstance().yprev = fetchInstance().y;
    fetchInstance().y = _y;
}
export function setPositionV(_p) { //takes in a point (vector) as argument
    fetchInstance().xprev = fetchInstance().x;
    fetchInstance().yprev = fetchInstance().y;

    fetchInstance().x = _p.getX();
    fetchInstance().y = _p.getY();
}
export function setPosition(_x, _y) {
    fetchInstance().xprev = fetchInstance().x;
    fetchInstance().yprev = fetchInstance().y;

    fetchInstance().x = _x;
    fetchInstance().y = _y;
}
export function setRot(_rot) {
    fetchInstance().rotprev = fetchInstance().rot;
    fetchInstance().rot = _rot;
}
export function getX() {
    return fetchInstance().x;
}
export function getY() {
    return fetchInstance().y;
}
export function getPosition() {
    return new LPVector(fetchInstance().x,
        fetchInstance().y);
}
export function getRot() {
    return fetchInstance().rot;
}
export function getXPrev() {
    return fetchInstance().xprev;
}
export function getYPrev() {
    return fetchInstance().yprev;
}
export function getRotPrev() {
    return fetchInstance().rotprev;
}

export function setHSpeed(_hspeed) {
    fetchInstance().hspeed = _hspeed;
}
export function setVSpeed(_vspeed) {
    fetchInstance().vspeed = _vspeed;
}
export function setRSpeed(_rspeed) {
    fetchInstance().rspeed = _rspeed;
}
export function getHSpeed() {
    return fetchInstance().hspeed;
}
export function getVSpeed() {
    return fetchInstance().vspeed;
}
export function getRSpeed() {
    return fetchInstance().rspeed;
}

export function makeVar(_value) {
    return fetchInstance().vars.add(_value);
}
export function getVal(_variableIndex) {
    return fetchInstance().vars.get(_variableIndex);
}
export function setVal(_variableIndex, _value) {
    fetchInstance().vars.put(_value, _variableIndex);
}

export function setBoundingBox(_p1, _p2) {
    fetchInstance().boundingBox.set(_p1, _p2);
}

export function getBoundingBox() { //returns the BoundingBox object of the primitive _index
    return fetchInstance().boundingBox;
}

export function hide() {
    fetchInstance().hidden = true;
}
export function unhide() {
    fetchInstance().hidden = false;
}
export function isHidden() {
    return fetchInstance().hidden;
}
export function freeze() {
    fetchInstance().freeze = true;
}
export function unfreeze() {
    fetchInstance().freeze = false;
}
export function isFrozen() {
    return fetchInstance().freeze;
}

export function collisionListAdd(_array) {
    fetchInstance().collisionList.add(_array);

}

export function setPhysical(_state) { //set it as true or false
    fetchInstance().physical = _state;
}

export function isPhysical() {
    return fetchInstance().physical;
}
export function setMass(_mass) {
    fetchInstance().mass = _mass;
}
export function getMass() {
    return fetchInstance().mass;
}
export function setVelocity(_v) {
    setHSpeed(_v[0]);
    setVSpeed(_v[1]);
}
export function getVelocity() {
    return [getHSpeed(), getVSpeed()];
}
export function setAcceleration(_acc) {
    fetchInstance().accceleration = _acc;
}
export function getAcceleration() {
    return fetchInstance().accceleration;
}
//this function obtains the instance's primitive, transforms it to the instance's
//orientation, then computes the center coordinate by averaging all the vertices
export function findCenterOfInstancePrimitive() {
    var prim1 = getPrimitive(getPrimitiveIndex());
    var prim2 = transform_primitive(prim1, getX(), getY(), getRot());
    let i = 0;
    var sumX = 0; var sumY = 0;
    for (i = 0; i < prim2.getSize(); i += 1) {
        sumX = sumX + prim2.get(i)[0];
        sumY = sumY + prim2.get(i)[1];
    }
    return [sumX / prim2.getSize(), sumY / prim2.getSize()];

}

//checks the collision list to see if this current instance has collision with the provided instance
//returns angle of contact if collision detected, else returns -1
export function checkCollision(_propertyIndex) {
    var i = 0;
    for (i = 0; i < fetchInstance().collisionList.getSize(); i += 1) {
        var targetInstanceIndex = fetchInstance().collisionList.get(i)[0];
        //START: get the target property index------
        var saved = getSelectedInstance(); //save current selection
        selectInstance(targetInstanceIndex);
        var targetPropertyIndex = getPropertyIndex();
        unSelectAll();
        selectInstance(saved);
        //END: get the target property index---------

        if (targetPropertyIndex == _propertyIndex) {

            var angleOfContact = fetchInstance().collisionList.get(i)[1];
            return angleOfContact;
        }
    }
    return -1;
}

export function flushCollisions() {
    var i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        selectInstance(i);
        fetchInstance().collisionList = new LPList();
        unSelectAll();
    }
}