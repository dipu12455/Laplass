import { LPList } from "./LPList.js";

export class Action{
    constructor(_initFunction, _updateFunction){
        this.initFunction = _initFunction;
        this.updateFunction = _updateFunction;
    }
    getInitFunction(){
        return this.initFunction;
    }
    getUpdateFunction(){
        return this.updateFunction;
    }
}

var ACTIONS = new LPList();

export function addAction(_action){ //the parameter is an Action object
    return ACTIONS.add(_action);
}

export function getAction(_actionIndex){
    return ACTIONS.get(_actionIndex);
}

//you don't need any more action modifying functions because these are meant to
//be hard coded into the game