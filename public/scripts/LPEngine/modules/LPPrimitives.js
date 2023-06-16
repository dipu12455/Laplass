import { LPList } from "./LPList.js";
import { LPVector } from './LPVector.js';
import { v2Minusv1 } from './LPVector.js';
import { findLeftPerpendicular } from './LPVector.js';
import { transformVector } from "./LPVector.js";

export class BoundingBox {
  constructor(_p1, _p2) {
    this.p1 = new LPVector(_p1.getX(), _p1.getY());
    this.p2 = new LPVector(_p2.getX(), _p2.getY());
  }
  set(_p1, _p2) {
    this.p1.setVector2(_p1);
    this.p2.setVector2(_p2);
  }
  getP1() {
    return this.p1;
  }
  getP2() {
    return this.p2;
  }
}

export class Primitive extends LPList {
  constructor() { //in this case the _primitivePath is the route to the server for the primitive text file
    super();
    this.xorigin = 0;
    this.yorigin = 0;
    this.lineColor = 0x000000;
    this.fillColor = 0x000000;
    this.wireframe = true;
    this.boundingBox = new BoundingBox(new LPVector(0, 0), new LPVector(0, 0));
  }
  getPrint() {
    var i = 0;
    var output = ``;
    for (i = 0; i < this.getSize(); i += 1) {
      output = output.concat(this.get(i).getPrint());
    }
    return output;
  }
  set(_xorigin, _yorigin, _lineColor, _fillColor, _wireframe, _boundingBox) {
    this.xorigin = _xorigin;
    this.yorigin = _yorigin;
    this.lineColor = _lineColor;
    this.fillColor = _fillColor;
    this.wireframe = _wireframe;
    this.boundingBox.set(_boundingBox.getP1(), _boundingBox.getP2());
  }
}

var PRIMITIVES = new LPList(); //list of all primitives in LPE

export function addPrimitive(_primitive) {
  return PRIMITIVES.add(_primitive);
}

export function getPrimitive(_index) {
  return PRIMITIVES.get(_index);
}

export function addPrimitiveVertex(_index, _vx, _vy) {
  PRIMITIVES.get(_index).add(new LPVector(_vx, _vy));
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
  //the first five fields in the string file is xorigin, yorigin, lineColor, fillColor, and wireframe(T/F)
  let fields = _primString.split(',');
  setOrigin(_index, new LPVector(parseFloat(fields[0]), parseFloat(fields[1])));
  setLineColor(_index, fields[2]); //hex is considered string in javascript (apparently...), so with or without quotes, the hex still yields the correct color value
  setFillColor(_index, fields[3]);
  setWireframe(_index, stringToBool(fields[4]));

  let i = 5;
  for (i = 5; i < fields.length; i += 2) {
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
  return normalList;
}

export function transform_primitive(_primitive, _x, _y, _rot) {
  var i = 0;
  var output = new Primitive(); //this function sets origin to (0,0) for now

  // copy the usual values to the new primitive
  output.set(_primitive.xorigin,
    _primitive.yorigin,
    _primitive.lineColor,
    _primitive.fillColor,
    _primitive.wireframe,
    _primitive.boundingBox);

  for (i = 0; i < _primitive.getSize(); i += 1) {
    //get the vertex
    var vertex = _primitive.get(i);

    //translate the vertex to prim's rot and coord, using new var to leave prim's vertex untouched.
    var vertex2 = transformVector(vertex, _x, _y, vertex.getTheta() + _rot);

    //add this transformed vertex to new primitive
    output.add(vertex2);
  }
  return output;
}


//setters
export function setOrigin(_index, _origin) { //takes a vector as input
  PRIMITIVES.get(_index).xorigin = _origin.getX();
  PRIMITIVES.get(_index).yorigin = _origin.getY();
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
export function setBoundingBox(_index, _p1, _p2) {
  PRIMITIVES.get(_index).boundingBox.set(_p1, _p2);
}

//getters
export function getOrigin(_index) {
  return new LPVector(PRIMITIVES.get(_index).xorigin, PRIMITIVES.get(_index).yorigin);
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
export function getBoundingBox(_index){ //returns the BoundingBox object of the primitive _index
  return PRIMITIVES.get(_index).boundingBox;
}

function stringToBool(_string) {
  if (_string == '1') return true;
  if (_string == '0') return false;
}

