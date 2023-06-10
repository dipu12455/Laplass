import * as LP from './LPEngine/LPEngine.js';

//define a primitive
export var prim01 = new LP.Primitive(new LP.LPVector(0,0));
prim01.add(new LP.LPVector(2,2)); //LPVectors are the so similar to vertices, so just using them
prim01.add(new LP.LPVector(-2,1));
prim01.add(new LP.LPVector(-2,-2));

//pentagon
export var pentagon = new LP.Primitive(new LP.LPVector(0,0));
pentagon.add(new LP.LPVector(-5,1));
pentagon.add(new LP.LPVector(0,6));
pentagon.add(new LP.LPVector(5,1));
pentagon.add(new LP.LPVector(3,-5));
pentagon.add(new LP.LPVector(-3,-5));

//returns a list of vectors that are projected on the given axisVector
export function projectPrimitiveOntoAxis(_primitive, _axisVector){
  var i = 0;
  var projPointList = new LP.LPList();
  for(i = 0; i < _primitive.getSize(); i += 1){
    var point = _primitive.get(i);

    const proj = projOfuOnv(point,_axisVector);

    projPointList.add(proj);
  }
  return projPointList;
}

//takes a primitive and only returns a list of the coefficient of each point with the axis
export function getCoefficientsOfProjection(_primitive, _axisVector){
  var i = 0;
  var pointList = new LP.LPList();
  for(i = 0; i < _primitive.getSize(); i += 1){
    var point = _primitive.get(i);
    
    //get the projection
    const proj = coeffOfProjuOnv(point,_axisVector);

    pointList.add(proj);
  }
  return pointList;
}

//takes a list and finds the min, returns the index of the min value of the list
export function findMin(_list /*type LPList*/){ //TODO: what if there are more that one min values? it is possible for two different vertices to have equal projection vector
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
export function findMax(_list){
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

function projOfuOnv(_u,_v){
  const proj = LP.scalarXvector(coeffOfProjuOnv(_u,_v),_v);
  return proj;
}

function coeffOfProjuOnv(_u,_v){
  const dotProd = LP.dotProduct(_u,_v);
  const coefficient = dotProd/LP.sqr(_v.getMag());
  return coefficient; //this is a scalar
}

//primitive needs to be defined in vertex list
function getNormalsOfPrimitive(_primitive){
  var i = 0;
  var normalList = new LP.LPList();
  for (i = 0; i < _primitive.getSize(); i += 1){
    var p1; var p2;
    if (i == 0){
      p1 = _primitive.get(_primitive.getSize()-1);
      p2 = _primitive.get(i);
    }
    else{
      p1 = _primitive.get(i-1);
      p2 = _primitive.get(i);
    }

    var normal = LP.findLeftPerpendicular(LP.v2Minusv1(p1,p2));
    normalList.add(normal);
  }
  return normalList;
}

//put inside the draw function of a scene
export function drawNormals(_primitive,_p,_primColor, _secColor){
  var normals = getNormalsOfPrimitive(_primitive);
  var i = 0;
  for (i = 0; i < normals.getSize(); i += 1){
    LP.draw_lineV(_p,LP.v1Plusv2(_p,normals.get(i)),_primColor,_secColor);
  }
}

