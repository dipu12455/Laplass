import * as LP from './LPEngine/LPEngine.js';

var elapsed = 0;

//define a primitive
var prim01 = new LP.Primitive(0,0);
prim01.add(new LP.LPVector(2,2)); //LPVectors are the so similar to vertices, so just using them
prim01.add(new LP.LPVector(-2,1));
prim01.add(new LP.LPVector(-2,-2));

//pentagon
var pentagon = new LP.Primitive(0,0);
pentagon.add(new LP.LPVector(-5,1));
pentagon.add(new LP.LPVector(0,6));
pentagon.add(new LP.LPVector(5,1));
pentagon.add(new LP.LPVector(3,-5));
pentagon.add(new LP.LPVector(-3,-5));

function projectPrimitiveOntoAxis(_primitive, _axisVector){
  var i = 0;
  var projPointList = new LP.LPList();
  for(i = 0; i < _primitive.getSize(); i += 1){
    var point = _primitive.get(i);

    const proj = projOfuOnv(point,_axisVector);

    projPointList.add(proj);
  }
  return projPointList;
}
function coeffOfProjuOnv(_u,_v){
  const dotProd = LP.dotProduct(_u,_v);
  const coefficient = dotProd/LP.sqr(_v.getMag());
  return coefficient; //this is a scalar
}

function projOfuOnv(_u,_v){
  const proj = LP.scalarXvector(coeffOfProjuOnv(_u,_v),_v);
  return proj;
}

const axis = new LP.LPVector(8,2);

export function update(_delta){
  elapsed += _delta;
}

var printed=false;
export function draw(){
  LP.draw_lineV(new LP.LPVector(0,0), axis,0x000000,0x0000ff); //dont wanna see anchor just line

  //draw projected points on the axis
  const pointList = projectPrimitiveOntoAxis(pentagon,axis);
  var i = 0;
  for (i = 0; i < pointList.getSize(); i += 1){
    var p = pointList.get(i);
    LP.draw_anchorV(p,0xff0000);
  }

  //draw only the coefficients of those points but plot them on the x-axis to see their values in a graph
  const pointList2 = testFunc1(pentagon,axis);
  var scale = 10; //these coefficients are very small, scale them to make them visible at worldDelta of 20
  var i = 0;
  for (i = 0; i < pointList2.getSize(); i += 1){
    var p = pointList2.get(i);
    LP.draw_anchor(p*scale,0,0x0000ff);
  }

  //debug
  if (printed == false){
    printed=true;
    var list = new LP.LPList();
    list.add(-10);
    list.add(4);
    list.add(7.3);
    list.add(7.47);
    list.add(-10.5);

    //print the list
    console.log(`The list: ${list.getArray()}`);
    //print the min and max
    console.log(`the min ${findMin(list)} the max ${findMax(list)}`);
  }

  //drawNormals(pentagon, 0x445500,0x00ff00);

  //LP.draw_primitive(pentagon,0,0,0,0x00ff00,0xc9f0e8,true);
  //LP.draw_primitive(prim01,0,0,0,0x0000ff,0x0,true);
}

//primitive needs to be defined in vertex list
function getNormalsOfPrimitive(_primitive){
  var i = 0;
  var normalList = new LP.LPList();
  for (i = 0; i < _primitive.getSize(); i += 1){
    var p1; var p2;
    if (i == 0){
      p1 = pentagon.get(_primitive.getSize()-1);
      p2 = pentagon.get(i);
    }
    else{
      p1 = pentagon.get(i-1);
      p2 = pentagon.get(i);
    }

    var normal = LP.findLeftPerpendicular(LP.v2Minusv1(p1,p2));
    normalList.add(normal);
  }
  return normalList;
}

function drawNormals(_primitive, _primColor, _secColor){
  var normals = getNormalsOfPrimitive(_primitive);
  var i = 0;
  for (i = 0; i < normals.getSize(); i += 1){
    LP.draw_vector_origin(normals.get(i),_primColor,_secColor);
  }
}

//takes a primitive and only returns a list of the coefficient of each point with the axis
function testFunc1(_primitive,_axisVector){
  var i = 0;
  var pointList = new LP.LPList();
  for(i = 0; i < _primitive.getSize(); i += 1){
    var point = _primitive.get(i);

    const proj = coeffOfProjuOnv(point,_axisVector);

    pointList.add(proj);
  }
  return pointList;
}

//takes a list and finds the min, returns the index of the min value of the list
function findMin(_list /*type LPList*/){ //TODO: what if there are more that one min values? it is possible for two different vertices to have equal projection vector
  var min = 0;
  var index = 0;
  var i = 0;
  for (i = 0; i < _list.getSize(); i += 1){
    let value = _list.get(i);
    if (value < min){
      min = value;
      index = i;
    }
  }
  return index;
}

//takes a list and finds the max, returns the index of the max value of the list
function findMax(_list){
  var max = 0;
  var index = 0;
  var i = 0;
  for (i = 0; i < _list.getSize(); i += 1){
    let value = _list.get(i);
    if (value > max){
      max = value;
      index = i;
    }
  }
  return index;
}

