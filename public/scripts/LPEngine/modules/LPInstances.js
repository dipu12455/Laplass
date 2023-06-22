import { LPList } from "./LPList.js";
import { getAction } from "./LPActions.js";
import { isPrintConsole, isTimeRunning, turnOffPrintConsole } from "./LPEngineCore.js";
import { turnOffEvents } from "./LPEvents.js";

export class BoundingBox {
    constructor(_p1, _p2) {
        this.p1 = [0,0];
        this.p2 = [0,0];
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
        this.actionIndex = -1;
        this.boundingBox = new BoundingBox([0,0],[0,0]);
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
function fetchInstance(){
    //fetches the currently selected instance object
    return INSTANCES.get(getSelectedInstance());
}
export function unSelectAll() {
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
            if (actionIndex != -1 && !isFrozen()) { //if index is -1, then there is no action for this instance
                var updateFunction = getAction(actionIndex).getUpdateFunction();
                updateFunction(_delta);
                //translate the instance according to their speed
                setX(getX()+getHSpeed()*_delta);
                setY(getY()+getVSpeed()*_delta);
                setRot(getRot()+getRSpeed()*_delta);
            }
            unSelectAll();
        }
        turnOffEvents(); //only for non-persistent events
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
export function getActionIndex() {
    return fetchInstance().actionIndex;
}
export function setActionIndex(_actionIndex) {
    fetchInstance().actionIndex = _actionIndex;
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

export function setHSpeed(_hspeed){
    fetchInstance().hspeed = _hspeed;
}
export function setVSpeed(_vspeed){
    fetchInstance().vspeed = _vspeed;
}
export function setRSpeed(_rspeed){
    fetchInstance().rspeed = _rspeed;
}
export function getHSpeed(){
    return fetchInstance().hspeed;
}
export function getVSpeed(){
    return fetchInstance().vspeed;
}
export function getRSpeed(){
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

export function collisionListAdd(_instanceIndex){
    fetchInstance().collisionList.add(_instanceIndex);
    if (isPrintConsole()) console.log(`Added ${_instanceIndex} to collisionList of ${getSelectedInstance()}`);
}

//checks the collision list to see if this current instance has collision with the provided instance
export function checkCollision(_instanceIndex){
    var i = 0;
    for (i = 0; i < fetchInstance().collisionList.getSize(); i += 1){
        if (fetchInstance().collisionList.get(i) == _instanceIndex){
            if (isPrintConsole()) console.log(`Yes, collision of ${getSelectedInstance()} with ${_instanceIndex}`);
            return true;
        }
    }
    return false;
    
}

export function flushCollisions(){
    var i = 0;
    for (i = 0; i < INSTANCES.getSize(); i += 1){
        selectInstance(i);
        fetchInstance().collisionList = new LPList();
        unSelectAll();
    }
}