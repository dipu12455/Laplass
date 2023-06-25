import { LPList } from "./LPList.js";

export class Property{
    constructor(_initFunction, _updateFunction, _drawFunction){
        this.initFunction = _initFunction;
        this.updateFunction = _updateFunction;
        this.drawFunction = _drawFunction;
    }
    getInitFunction(){
        return this.initFunction;
    }
    getUpdateFunction(){
        return this.updateFunction;
    }
    getDrawFunction(){
        return this.drawFunction;
    }
}

var PROPERTIES = new LPList();

export function addProperty(_initFunction, _updateFunction, _drawFunction){ //the parameter is an Property object
    var temp = new Property(_initFunction, _updateFunction, _drawFunction);
    return PROPERTIES.add(temp);
}

export function getProperty(_propertyIndex){
    return PROPERTIES.get(_propertyIndex);
}

//you don't need any more Property modifying functions because these are meant to
//be hard coded into the game