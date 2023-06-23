import { LPList } from "./LPList.js";

export class Property{
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

var PROPERTIES = new LPList();

export function addProperty(_property){ //the parameter is an Property object
    return PROPERTIES.add(_property);
}

export function getProperty(_propertyIndex){
    return PROPERTIES.get(_propertyIndex);
}

//you don't need any more Property modifying functions because these are meant to
//be hard coded into the game