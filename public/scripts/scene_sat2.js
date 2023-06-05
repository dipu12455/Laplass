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

function projOfuOnv(_u,_v){
  const dotProd = LP.dotProduct(_u,_v);
  const coefficient = dotProd/LP.sqr(_v.getMag());
  const proj = LP.scalarXvector(coefficient,_v);
  return proj;
}

const axis = new LP.LPVector(8,2);
const pointList = projectPrimitiveOntoAxis(pentagon,axis);

export function update(_delta){
  elapsed += _delta;
}

var printed=false;
export function draw(){
  LP.draw_vector_origin(axis,0x000000,0x0000ff);

  var i = 0;
  for (i = 0; i < pointList.getSize(); i += 1){
    var p = pointList.get(i);
    LP.draw_anchorV(p,0xff0000);
  }

  var pentagonNormals = getNormalsOfPrimitive(pentagon);
  i = 0;
  for (i = 0; i < pentagonNormals.getSize(); i += 1){
    LP.draw_vector_origin(pentagonNormals.get(i),0x445500,0x00ff00);
  }
  printed=true;

  LP.draw_primitive(pentagon,0,0,0,0x00ff00,0xc9f0e8,true);
  //LP.draw_primitive(prim01,0,0,0,0x0000ff,0x0,true);
}

//define primitive in vertex list
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

