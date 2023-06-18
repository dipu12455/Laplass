import { LPList } from "./LPList.js";
import { getAction } from "./LPActions.js";
import { LPVector } from "./LPVector.js";
import { isTimeRunning } from "./LPEngineCore.js";

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

var selectedInstance = -1; //remembers which instance is being worked on, stores an instanceIndex, -1 means nothing is selected
export function selectInstance(_index){
    selectedInstance = _index;
}
export function getSelectedInstance(){
    if (selectedInstance == -1) console.error(`No instance selected.`);
    return selectedInstance;
}
export function unSelectAll(){
    selectedInstance = -1;
}

//create an instance (new LP.LPInstance), then returns its index for use in other functions
export function addInstance(_primitiveIndex, _spriteIndex, _actionIndex) {
    let ind = INSTANCES.add(new LPInstance());
    selectInstance(ind);
    setPrimitiveIndex(_primitiveIndex);
    setSpriteIndex(_spriteIndex);
    setActionIndex(_actionIndex);
    unSelectAll();
    return ind;
}

export function initInstances() {
    let i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1) {
        selectInstance(i);
        var actionIndex = getActionIndex();
        if (actionIndex != -1) { //if index is -1, then there is no action for this instance
            var initFunction = getAction(actionIndex).getInitFunction();
            initFunction();
        }
        unSelectAll();
    }
}

export function updateInstances(_delta) {
    let i = 0;
    if (isTimeRunning()) { //allows the ability to pause all action, drawing loop still continues, just instances don't update their orientations so everything freezes in place.
        for (i = 0; i < INSTANCES.getSize(); i += 1) {
            selectInstance(i);
            var actionIndex = getActionIndex();
            if (actionIndex != -1) { //if index is -1, then there is no action for this instance
                var updateFunction = getAction(actionIndex).getUpdateFunction();
                updateFunction(_delta);
            }
            unSelectAll();
        }
    }
}

//the instances are registered with game engine and they live in this file in the INSTANCES list. the following functions are used to access
//and change attrs of instances

export function getPrimitiveIndex() {
    return INSTANCES.get(getSelectedInstance()).primitiveIndex;
}
export function setPrimitiveIndex(_primitiveIndex) {
    INSTANCES.get(getSelectedInstance()).primitiveIndex = _primitiveIndex;
}
export function getSpriteIndex() {
    return INSTANCES.get(getSelectedInstance()).spriteIndex;
}
export function setSpriteIndex(_spriteIndex) {
    INSTANCES.get(getSelectedInstance()).spriteIndex = _spriteIndex;
}
export function getActionIndex() {
    return INSTANCES.get(getSelectedInstance()).actionIndex;
}
export function setActionIndex( _actionIndex) {
    INSTANCES.get(getSelectedInstance()).actionIndex = _actionIndex;
}
export function setX(_x) {
    INSTANCES.get(getSelectedInstance()).xprev = INSTANCES.get(getSelectedInstance()).x;
    INSTANCES.get(getSelectedInstance()).x = _x;
}
export function setY(_y) {
    INSTANCES.get(getSelectedInstance()).yprev = INSTANCES.get(getSelectedInstance()).y;
    INSTANCES.get(getSelectedInstance()).y = _y;
}
export function setPosition(_p) { //takes in a point (vector) as argument
    INSTANCES.get(getSelectedInstance()).xprev = INSTANCES.get(getSelectedInstance()).x;
    INSTANCES.get(getSelectedInstance()).yprev = INSTANCES.get(getSelectedInstance()).y;

    INSTANCES.get(getSelectedInstance()).x = _p.getX();
    INSTANCES.get(getSelectedInstance()).y = _p.getY();
}
export function setRot(_rot) {
    INSTANCES.get(getSelectedInstance()).rotprev = INSTANCES.get(getSelectedInstance()).rot;
    INSTANCES.get(getSelectedInstance()).rot = _rot;
}
export function getX() {
    return INSTANCES.get(getSelectedInstance()).x;
}
export function getY() {
    return INSTANCES.get(getSelectedInstance()).y;
}
export function getPosition() {
    return new LPVector(INSTANCES.get(getSelectedInstance()).x,
        INSTANCES.get(getSelectedInstance()).y);
}
export function getRot() {
    return INSTANCES.get(getSelectedInstance()).rot;
}
export function getPrevX() {
    return INSTANCES.get(getSelectedInstance()).prevX;
}
export function getPrevY() {
    return INSTANCES.get(getSelectedInstance()).prevY;
}
export function getPrevRot() {
    return INSTANCES.get(getSelectedInstance()).prevRot;
}
export function makeVar( _value) {
    return INSTANCES.get(getSelectedInstance()).vars.add(_value);
}
export function getVal(_variableIndex) {
    return INSTANCES.get(getSelectedInstance()).vars.get(_variableIndex);
}
export function setVal(_variableIndex, _value) {
    INSTANCES.get(getSelectedInstance()).vars.put(_value, _variableIndex);
}

export function setBoundingBox(_p1, _p2) {
    INSTANCES.get(getSelectedInstance()).boundingBox.set(_p1, _p2);
}

export function setBoundingBoxCoord(_x1, _y1, _x2, _y2) {
    INSTANCES.get(getSelectedInstance()).boundingBox.setCoord(_x1, _y1, _x2, _y2);
}

export function getBoundingBox() { //returns the BoundingBox object of the primitive _index
    return INSTANCES.get(getSelectedInstance()).boundingBox;
}
