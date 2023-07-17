
import { List } from "./List.js";
import { getTheta, v2Minusv1 } from './Vector.js';
import { findLeftPerpendicular } from './Vector.js';
import { transformVector } from "./Vector.js";



export class BoundingBox {
  constructor(_p1, _p2) {
      this.p1 = [0, 0];
      this.p2 = [0, 0];
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

export class Primitive extends List {
  constructor() { //in this case the _primitivePath is the route to the server for the primitive text file
    super();
    this.origin = [0, 0];
    this.lineColor = 0x000000;
    this.fillColor = 0x000000;
    this.wireframe = true;
    this.boundingBox = new BoundingBox([0, 0], [0, 0]);
  }
  getPrint() {
    var i = 0;
    var output = ``;
    for (i = 0; i < this.getSize(); i += 1) {
      output = output.concat(this.get(i).getPrint());
    }
    return output;
  }
  set(_origin, _lineColor, _fillColor, _wireframe, _boundingBox) {
    this.origin = _origin;
    this.lineColor = _lineColor;
    this.fillColor = _fillColor;
    this.wireframe = _wireframe;
    this.boundingBox = _boundingBox;
  }
  copyAttributes (_primitive) { //doesn't copy the vertices, just the primitive data
    this.origin = _primitive.origin;
    this.lineColor = _primitive.lineColor;
    this.fillColor = _primitive.fillColor;
    this.wireframe = _primitive.wireframe;
    this.boundingBox = _primitive.boundingBox;
  }
}

var PRIMITIVES = new List(); //list of all primitives in LPE

export function addPrimitive(_primitivePath) {
  var ind = PRIMITIVES.add(new Primitive());
  loadPrimitive(ind, _primitivePath);
  return ind;
}

export function getPrimitive(_index) {
  return PRIMITIVES.get(_index);
}

export function addPrimitiveVertex(_index, _vx, _vy) {
  var temp = [_vx,_vy];
  PRIMITIVES.get(_index).add(temp);
}

export function loadPrimitive(_index, _primitivePath) {
  var verticesString = '';
  //get the primitive file from the route that is provided as argument
  fetch(_primitivePath)
    .then(response => response.text())
    .then(data => {
      //do something with text data
      addPrimitiveFromString(_index, data); //the data variable doesn't exist outside this block, even when value is passed through
    })
    .catch(error => {
      console.error('Error:', error);
    })

}

function addPrimitiveFromString(_index, _primString) {
  //parse the string and add the vertices to primitive
  //the first five fields in the string file is xorigin, yorigin, lineColor, fillColor, wireframe(T/F), bboxp1x,bboxp1y,bboxp2x,bboxp2y
  let fields = _primString.split(',');
  setOrigin(_index, [parseFloat(fields[0]), parseFloat(fields[1])]);
  setLineColor(_index, fields[2]); //hex is considered string in javascript (apparently...), so with or without quotes, the hex still yields the correct color value
  setFillColor(_index, fields[3]);
  setWireframe(_index, stringToBool(fields[4]));
  setBoundingBox(_index, [parseFloat(fields[5]), parseFloat(fields[6])], [parseFloat(fields[7]), parseFloat(fields[8])]);

  let i = 9;
  for (i = 9; i < fields.length; i += 2) {
    addPrimitiveVertex(_index, parseFloat(fields[i]), parseFloat(fields[i + 1]));
  }
}

//primitive needs to be defined in vertex list
export function getNormalsOfPrimitive(_primitive) {
  var i = 0;
  var normalList = new LPList();
  for (i = 0; i < _primitive.getSize(); i += 1) {
    var p1; var p2;
    if (i == 0) {
      p1 = _primitive.get(_primitive.getSize() - 1);
      p2 = _primitive.get(i);
    }
    else {
      p1 = _primitive.get(i - 1);
      p2 = _primitive.get(i);
    }

    var normal = findLeftPerpendicular(v2Minusv1(p1, p2));
    normalList.add(normal);
  }
  return normalList; //this is a list of LPVector objects
}

export function transform_primitive(_primitive, _x, _y, _rot) {
  var i = 0;
  var output = new Primitive(); //this function sets origin to (0,0) for now

  // copy the usual values to the new primitive
  output.set(_primitive.origin,
    _primitive.lineColor,
    _primitive.fillColor,
    _primitive.wireframe,
    _primitive.boundingBox);

  for (i = 0; i < _primitive.getSize(); i += 1) {
    //get the vertex
    var vertex = _primitive.get(i);

    //translate the vertex to prim's rot and coord, using new var to leave prim's vertex untouched.
   
    var vertex2 = transformVector(vertex, _x, _y, getTheta(vertex) + _rot);

    //add this transformed vertex to new primitive
    output.add(vertex2);
  }
  return output;
}


//setters
export function setOrigin(_index, _origin) { //takes a vector as input
  PRIMITIVES.get(_index).origin = _origin;
}
export function setLineColor(_index, _lineColor) {
  PRIMITIVES.get(_index).lineColor = _lineColor;
}
export function setFillColor(_index, _fillColor) {
  PRIMITIVES.get(_index).fillColor = _fillColor;
}
export function setWireframe(_index, _wireframe) {
  PRIMITIVES.get(_index).wireframe = _wireframe;
}


//getters
export function getOrigin(_index) {
  return PRIMITIVES.get(_index).origin;
}
export function getLineColor(_index) {
  return PRIMITIVES.get(_index).lineColor;
}
export function getFillColor(_index, _fillColor) {
  return PRIMITIVES.get(_index).fillColor;;
}
export function getWireframe(_index, _wireframe) {
  return PRIMITIVES.get(_index).wireframe;
}

export function setBoundingBox(_index, _p1, _p2) {
  PRIMITIVES.get(_index).boundingBox.set(_p1, _p2);
}

export function getBoundingBox(_index) { //returns the BoundingBox object of the primitive _index
  return PRIMITIVES.get(_index).boundingBox;
}


function stringToBool(_string) {
  if (_string == '1') return true;
  if (_string == '0') return false;
}

export function copyPrimitive(_primitive){
  var newPrim =  new Primitive();
  newPrim.set(_primitive.origin,
    _primitive.lineColor,
    _primitive.fillColor,
    _primitive.wireframe,
    _primitive.boundingBox);

  var i = 0;
  for (i = 0; i < _primitive.getSize(); i += 1) {
    newPrim.add(_primitive.get(i));
  }
  return newPrim;
}

