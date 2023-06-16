import { LPList } from "./LPList.js";
import { getAction } from "./LPActions.js";
import { LPVector } from "./LPVector.js";

export class BoundingBox {
    constructor(_p1, _p2) {
        this.p1 = new LPVector(_p1.getX(), _p1.getY());
        this.p2 = new LPVector(_p2.getX(), _p2.getY());
    }
    set(_p1, _p2) {
        this.p1.setVector2(_p1);
        this.p2.setVector2(_p2);
    }
    setCoord(_x1, _y1, _x2, _y2) {
        this.p1.setVector1(_x1, _y1);
        this.p2.setVector1(_x2, _y2);
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
        this.actionIndex = -1;
        this.boundingBox = new BoundingBox(new LPVector(0, 0), new LPVector(0, 0));
        // the following are all in LPE coordinate system
        this.x = 0;
        this.y = 0;
        this.rot = 0;
        this.xprev = 0;
        this.yprev = 0;
        this.rotprev = 0;
        this.hspeed = 0;
        this.vspeed = 0;
        this.vars = new LPList(); //list that stores custom variables
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

//create an instance (new LP.LPInstance), then provide that object as argument
export function addInstance(_instance, _primitiveIndex, _spriteIndex, _actionIndex) {
    let ind = INSTANCES.add(_instance);
    setPrimitiveIndex(ind, _primitiveIndex);
    setSpriteIndex(ind, _spriteIndex);
    setActionIndex(ind, _actionIndex);
    return ind;
}

export function initInstances() {
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        var actionIndex = getActionIndex(i);
        if (actionIndex != -1) { //if index is -1, then there is no action for this instance
            var initFunction = getAction(actionIndex).getInitFunction();
            initFunction(i);
        }
    }
}

export function updateInstances(_delta) {
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        var actionIndex = getActionIndex(i);
        if (actionIndex != -1) { //if index is -1, then there is no action for this instance
            var updateFunction = getAction(actionIndex).getUpdateFunction();
            updateFunction(i, _delta);
        }
    }
}

//the instances are registered with game engine and they live in this file in the INSTANCES list. the following functions are used to access
//and change attrs of instances

export function getPrimitiveIndex(_index) {
    return INSTANCES.get(_index).primitiveIndex;
}
export function setPrimitiveIndex(_index, _primitiveIndex) {
    INSTANCES.get(_index).primitiveIndex = _primitiveIndex;
}
export function getSpriteIndex(_index) {
    return INSTANCES.get(_index).spriteIndex;
}
export function setSpriteIndex(_index, _spriteIndex) {
    INSTANCES.get(_index).spriteIndex = _spriteIndex;
}
export function getActionIndex(_index) {
    return INSTANCES.get(_index).actionIndex;
}
export function setActionIndex(_index, _actionIndex) {
    INSTANCES.get(_index).actionIndex = _actionIndex;
}
export function setX(_index, _x) {
    INSTANCES.get(_index).xprev = INSTANCES.get(_index).x;
    INSTANCES.get(_index).x = _x;
}
export function setY(_index, _y) {
    INSTANCES.get(_index).yprev = INSTANCES.get(_index).y;
    INSTANCES.get(_index).y = _y;
}
export function setPosition(_index, _p) { //takes in a point (vector) as argument
    INSTANCES.get(_index).xprev = INSTANCES.get(_index).x;
    INSTANCES.get(_index).yprev = INSTANCES.get(_index).y;

    INSTANCES.get(_index).x = _p.getX();
    INSTANCES.get(_index).y = _p.getY();
}
export function setRot(_index, _rot) {
    INSTANCES.get(_index).rotprev = INSTANCES.get(_index).rot;
    INSTANCES.get(_index).rot = _rot;
}
export function getX(_index) {
    return INSTANCES.get(_index).x;
}
export function getY(_index) {
    return INSTANCES.get(_index).y;
}
export function getPosition(_index) {
    return new LPVector(INSTANCES.get(_index).x,
        INSTANCES.get(_index).y);
}
export function getRot(_index) {
    return INSTANCES.get(_index).rot;
}
export function getPrevX(_index) {
    return INSTANCES.get(_index).prevX;
}
export function getPrevY(_index) {
    return INSTANCES.get(_index).prevY;
}
export function getPrevRot(_index) {
    return INSTANCES.get(_index).prevRot;
}
export function makeVar(_index, _value) {
    return INSTANCES.get(_index).vars.add(_value);
}
export function getVal(_index, _variableIndex) {
    return INSTANCES.get(_index).vars.get(_variableIndex);
}
export function setVal(_index, _variableIndex, _value) {
    INSTANCES.get(_index).vars.put(_value, _variableIndex);
}

export function setBoundingBox(_index, _p1, _p2) {
    INSTANCES.get(_index).boundingBox.set(_p1, _p2);
}

export function setBoundingBoxCoord(_index, _x1, _y1, _x2, _y2) {
    INSTANCES.get(_index).boundingBox.setCoord(_x1,_y1,_x2,_y2);
}

export function getBoundingBox(_index) { //returns the BoundingBox object of the primitive _index
    return INSTANCES.get(_index).boundingBox;
}
