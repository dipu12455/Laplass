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

const v1 = new LP.LPVector(2,4);
const axis = new LP.LPVector(8,2);

const dotProd = LP.dotProduct(v1,axis);
const coefficient = dotProd/LP.sqr(axis.getMag());
const proj = LP.scalarXvector(coefficient,axis);

export function update(_delta){
  elapsed += _delta;
}

export function draw(){
  LP.draw_anchorV(v1,0xff0000);
  LP.draw_vector_origin(axis,0x000000,0x0000ff);

  LP.draw_anchorV(proj,0x00ff00);

  LP.draw_lineV(v1,proj,0x000000);
  //LP.draw_primitive(pentagon,0,0,0,0x00ff00,0xc9f0e8,true);
  //LP.draw_primitive(prim01,0,0,0,0x0000ff,0x0,true);
}

