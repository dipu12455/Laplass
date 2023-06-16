import * as LP from './LPEngine/LPEngine.js';

//define a primitive
var pmTriangle = LP.addPrimitive(new LP.Primitive());
LP.loadPrimitive(pmTriangle, '/pmTriangle');

//pentagon
var pmPentagon = LP.addPrimitive(new LP.Primitive());
LP.loadPrimitive(pmPentagon, '/pmPentagon');

//load arrow
var pmArrow = LP.addPrimitive(new LP.Primitive());
LP.loadPrimitive(pmArrow, '/pmArrow');

//load square
var pmSquare = LP.addPrimitive(new LP.Primitive());
LP.loadPrimitive(pmSquare, '/pmSquare');

var pentagonInitFunction = (_instanceIndex) => {
    LP.makeVar(_instanceIndex, 0); //(0)elapsed = 0;
}

var triangleInitFunction = (_instanceIndex) => {
    LP.makeVar(_instanceIndex, 0); //(0)elapsed = 0; //this is varslot '0' of a different instance
    LP.makeVar(_instanceIndex, Math.random() * 5); //(1)rand = something
}

var dummyInitFunction = (_instanceIndex) => {
    //just placeholder
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

    LP.setRot(_instanceIndex, LP.getRot(_instanceIndex) + 0.3 * _delta);
    LP.setX(_instanceIndex, animate * 5);
    LP.setY(_instanceIndex, 0);
}

var triangleUpdatefunction = (_instanceIndex, _delta) => {
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

var mouseTriUpdateFunction = (_instanceIndex, _delta) => {
    LP.setPosition(_instanceIndex, LP.getMousePosition());

    //define a test bounding box
    var boundingBox = new LP.BoundingBox(new LP.LPVector(-3,3), new LP.LPVector(3,-3));
    if (LP.evMouseClickRegion(boundingBox)){
        console.log(`Clicked in the region bruv`);
    }
    //console.log(`${LP.getX(_instanceIndex)} ${LP.getY(_instanceIndex)}`);
}

var dragObjectInit = (_instanceIndex) => {
    LP.makeVar(_instanceIndex, 0); //(0)dragging=false
}

var dragObjectUpdate = (_instanceIndex, _delta) => {
    var xx = LP.getX(_instanceIndex);
    var yy = LP.getY(_instanceIndex);
    var bboxp1 = new LP.LPVector(xx-1, yy+1);
    var bboxp2 = new LP.LPVector(xx+1, yy-1); //making sure bounding box moves with this instance
    //we are having boundingbox be drawn around the origin of this instance
    //its primitives origin will also be at the center
    var boundingBox = new LP.BoundingBox(bboxp1,bboxp2);

    if(LP.evMouseDownRegion(boundingBox)){
        LP.setVal(_instanceIndex,0,1); //(0)dragging = true
    }
    if(LP.getVal(_instanceIndex,0) == 1){ // if ((0)dragging = true)
        LP.setPosition(_instanceIndex,LP.getMousePosition());
    }
    if (LP.evMouseUp()){
        LP.setVal(_instanceIndex,0,0); //(0)dragging = false
    }
}

//define action indices
const acPentagon = LP.addAction(new LP.Action(pentagonInitFunction,pentagonUpdatefunction));
const acTriangle = LP.addAction(new LP.Action(triangleInitFunction, triangleUpdatefunction));
const acMouseTri = LP.addAction(new LP.Action(dummyInitFunction, mouseTriUpdateFunction));
const acDragObject = LP.addAction(new LP.Action(dragObjectInit, dragObjectUpdate));

//create an instance
export var ins1 = LP.addInstance(new LP.LPInstance(), pmPentagon, -1, acPentagon);

let i = 0;
for (i = 0; i < 3; i += 1){
    let ind = LP.addInstance(new LP.LPInstance(), pmTriangle, -1, acTriangle);
}

export var mouseTri = LP.addInstance(new LP.LPInstance(), pmArrow, -1, acMouseTri);

export var dragSquare = LP.addInstance(new LP.LPInstance(), pmSquare, -1, acDragObject);

export var dragSquare2 = LP.addInstance(new LP.LPInstance(), pmSquare, -1, acDragObject);
LP.setPosition(dragSquare2,new LP.LPVector(-5,5));

export var dragSquare3 = LP.addInstance(new LP.LPInstance(), pmSquare, -1, acDragObject);
LP.setPosition(dragSquare3,new LP.LPVector(5,0));

