import { LPList } from "./LPList.js";

export class LPObject{
    constructor(){
        this.primitiveIndex = -1;
        this.spriteIndex = -1;
        // the following are all in LPE coordinate system
        this.x = 0;
        this.y = 0;
        this.rot = 0;
        this.xprev = 0;
        this.yprev = 0;
        this.rotprev = 0;
        this.hspeed = 0;
        this.vspeed = 0;
        this.vars = new LPList();
    }
    /*makeVar(_value){
        return this.vars.add(_value);
    }
    getVal(_variableIndex){
        return this.vars.get(_variableIndex);
    }
    setVal(_variableIndex, _value){
        this.vars.get(_variableIndex) = _value;
    }*/
    /*getPrimitiveIndex(){
        return this.primitiveIndex;
    }
    setPrimitiveIndex(_index, _primitiveIndex){
        this.primitiveIndex = _primitiveIndex;
    }
    getSpriteIndex(_index){
        return this.spriteIndex;
    }
    setSpriteIndex(_index, _spriteIndex){
        this.spriteIndex = _spriteIndex;
    }
    setX(_index, _x){
        this.xprev = this.x;
        this.x = _x;
    }
    setY(_index, _y){
        this.yprev = this.y;
        this.y = _y;
    }
    setRot(_index, _rot){
        this.rotprev = this.rot;
        this.rot = _rot;
    }
    getX(_index){ //this is a getter
        return this.x;
    }
    getY(_index){ //this is a getter
        return this.y;
    }
    getRot(_index){ //this is a getter
        return this.rot;
    }*/
}
export var INSTANCES = new LPList(); //list of all instances in LPE
//use the LPObject class to make a child class that is the game 'object'. define attributes and behaviors for that object class.
//then create an instance of that object class which is the 'instance', its this instance you add to the INSTANCES list.
//if you make changes to x or y or even the spriteindex, you change one instance of that object, not all of them.
//object files are part of game code, not LP code.

//the instances are registered with game engine and they live in this file in the INSTANCES list. the following functions are used to access
//and change attrs of instances

export function getPrimitiveIndex(_index){
    return INSTANCES.get(_index).primitiveIndex;
}
export function setPrimitiveIndex(_index, _primitiveIndex){
    INSTANCES.get(_index).primitiveIndex = _primitiveIndex;
}
export function getSpriteIndex(_index){
    return INSTANCES.get(_index).spriteIndex;
}
export function setSpriteIndex(_index, _spriteIndex){
    INSTANCES.get(_index).spriteIndex = _spriteIndex;
}
export function setX(_index, _x){
    INSTANCES.get(_index).xprev = INSTANCES.get(_index).x;
    INSTANCES.get(_index).x = _x;
}
export function setY(_index, _y){
    INSTANCES.get(_index).yprev = INSTANCES.get(_index).y;
    INSTANCES.get(_index).y = _y;
}
export function setRot(_index, _rot){
    INSTANCES.get(_index).rotprev = INSTANCES.get(_index).rot;
    INSTANCES.get(_index).rot = _rot;
}
export function getX(_index){
    return INSTANCES.get(_index).x;
}
export function getY(_index){
    return INSTANCES.get(_index).y;
}
export function getRot(_index){
    return INSTANCES.get(_index).rot;
}
export function getPrevX(_index){
    return INSTANCES.get(_index).prevX;
}
export function getPrevY(_index){
    return INSTANCES.get(_index).prevY;
}
export function getPrevRot(_index){
    return INSTANCES.get(_index).prevRot;
}

