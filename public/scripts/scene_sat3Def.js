import * as LP from './LPEngine/LPEngine.js';

//define a primitive
var pmTriangle = LP.addPrimitive(new LP.Primitive());
LP.loadPrimitive(pmTriangle, '/pmTriangle');

//pentagon
var pmPentagon = LP.addPrimitive(new LP.Primitive());
LP.loadPrimitive(pmPentagon, '/pmPentagon');

var pentagonInitFunction = (_instanceIndex) => {
    LP.makeVar(_instanceIndex, 0); //(0)elapsed = 0;
}

var pentagonUpdatefunction = (_instanceIndex, _delta) => { //the update function of each action needs to contain the exact same parameters.
    //the following is how we are using persistent variables on an each instance basis
    //the '0' is the index of that persistent variable for this particular instance
    //for now, the programmer remembers what index they are using for an instance's persitent variable,
    //but later when the programming language is developed, this job will be for the PL.
    
    var temp = LP.getVal(_instanceIndex, 0);
    LP.setVal(_instanceIndex, 0,  temp + _delta); //this.(0)elapsed += delta;
    var elapsed = LP.getVal(_instanceIndex, 0);
    var animate = Math.cos(elapsed / 50.0);
    var animate2 = Math.sin(elapsed / 50.0);
    var animateSlower = Math.cos(elapsed / 100.0);

    LP.setRot(_instanceIndex, LP.getRot(_instanceIndex) + 1.4 * _delta);
    LP.setX(_instanceIndex, animateSlower * 5);
    LP.setY(_instanceIndex, 0);
}

var triangleInit = (_instanceIndex) => {
    LP.makeVar(_instanceIndex, 150); //(0)elapsed = 0;
}

var triangleUpdate = (_instanceIndex, _delta) => {
    var temp = LP.getVal(_instanceIndex, 0);
    LP.setVal(_instanceIndex, 0,  temp + _delta); //this.(0)elapsed += delta;
    var elapsed = LP.getVal(_instanceIndex, 0);
    var animate = Math.cos(elapsed / 50.0);
    var animate2 = Math.sin(elapsed / 50.0);
    var animateSlower = Math.cos(elapsed / 100.0);

    LP.setRot(_instanceIndex, LP.getRot(_instanceIndex) + 1.0 * _delta);
    LP.setX(_instanceIndex, animateSlower * 10);
    LP.setY(_instanceIndex, 0);
}

//define action indices
const acPentagon = LP.addAction(new LP.Action(pentagonInitFunction,pentagonUpdatefunction));
const acTriangle = LP.addAction(new LP.Action(triangleInit, triangleUpdate));

//create an instance
export var ins1 = LP.addInstance(new LP.LPInstance(), pmPentagon, -1, acPentagon);
export var ins2 = LP.addInstance(new LP.LPInstance(), pmTriangle, -1, acTriangle);

