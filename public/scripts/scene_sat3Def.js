import * as LP from './LPEngine/LPEngine.js';

var temp;

//define a primitive
temp = new LP.Primitive(new LP.LPVector(0, 0));
temp.add(new LP.LPVector(2, 2)); //LPVectors are the so similar to vertices, so just using them
temp.add(new LP.LPVector(-2, 1));
temp.add(new LP.LPVector(-2, -2));
export var prim01 = LP.PRIMITIVES.add(temp);

//pentagon
temp = new LP.Primitive(new LP.LPVector(0, 0));
temp.add(new LP.LPVector(-5, 1));
temp.add(new LP.LPVector(0, 6));
temp.add(new LP.LPVector(5, 1));
temp.add(new LP.LPVector(3, -5));
temp.add(new LP.LPVector(-3, -5));
export var pentagon = LP.PRIMITIVES.add(temp);

//define action index
const acIns1 = 0;
const acTriangle = 1;

//create an instance and set its primitive index
export var ins1 = LP.INSTANCES.add(new LP.LPInstance());
LP.setPrimitiveIndex(ins1, pentagon);
LP.setActionIndex(ins1, acIns1);

/* export var triangle = LP.INSTANCES.add(new LP.LPInstance());
LP.setPrimitiveIndex(triangle, prim01);
LP.setActionIndex(triangle, acTriangle);

//see if this instance acts in its own accord. it also uses the acTriangle action, but they are initialized with different values in the create routine.
export var triangle2 = LP.INSTANCES.add(new LP.LPInstance());
LP.setPrimitiveIndex(triangle2, prim01);
LP.setActionIndex(triangle2, acTriangle); */

let i = 0;
for (i = 0; i < 3; i += 1){
    let ind = LP.INSTANCES.add(new LP.LPInstance());
    LP.setPrimitiveIndex(ind, prim01);
    LP.setActionIndex(ind,acTriangle);
}

export function createRoutinesOfInstance(_instanceIndex) { //this runs a routine once for an instance when they are first created
    var actionIndex = LP.getActionIndex(_instanceIndex);
    switch (actionIndex) {
        case acIns1:
            LP.makeVar(_instanceIndex, 0); //(0)elapsed = 0;
            break;
        case acTriangle:
            LP.makeVar(_instanceIndex, 0); //(0)elapsed = 0; //this is varslot '0' of a different instance
            LP.makeVar(_instanceIndex, Math.random() * 5); //(1)rand = something
            break;
    }
}

export function updateInstance(_instanceIndex, _delta) { //this functions runs for an instance each time the frame is updated
    var actionIndex = LP.getActionIndex(_instanceIndex);
    switch (actionIndex) {
        case acIns1:
            acIns1_function(_instanceIndex, _delta);
            break;
        case acTriangle:
            acTriangle_function(_instanceIndex, _delta);
            break;
        default:
        //do nothin
    }
}

function acIns1_function(_instanceIndex, _delta) {
    //the following is how we are using persistent variables on an each instance basis
    //the '0' is the index of that persistent variable for this particular instance
    //for now, the programmer remembers what index they are using for an instance's persitent variable,
    //but later when the programming language is developed, this job will be for the PL.
    
    var temp = LP.getVal(_instanceIndex, 0);
    LP.setVal(_instanceIndex, 0,  temp + _delta); //this.(0)elapsed += delta;
    var elapsed = LP.getVal(_instanceIndex, 0);
    var animate = Math.cos(elapsed / 50.0);
    var animate2 = Math.sin(elapsed / 50.0);

    LP.setRot(_instanceIndex, LP.getRot(_instanceIndex) + 0.3 * _delta);
    LP.setX(_instanceIndex, animate * 5);
    LP.setY(_instanceIndex, 0);
}

function acTriangle_function(_instanceIndex, _delta){
    var temp = LP.getVal(_instanceIndex, 0);
    LP.setVal(_instanceIndex, 0, temp + _delta);
    var elapsed = LP.getVal(_instanceIndex, 0);
    var animate = Math.cos(elapsed / 50.0);
    var animate2 = Math.sin(elapsed / 50.0);
    var rand = LP.getVal(_instanceIndex, 1);//... = (1)rand

    LP.setRot(_instanceIndex, LP.getRot(_instanceIndex) - rand * _delta);
    LP.setX(_instanceIndex, animate * rand);
    LP.setY(_instanceIndex, animate2 * rand);
}
