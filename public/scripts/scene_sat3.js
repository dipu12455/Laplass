import * as LP from './LPEngine/LPEngine.js';
import * as S3 from './scene_sat3Def.js';

var elapsed = 0;

//define a primitive
var prim01 = S3.prim01;

//pentagon
var pentagon = S3.pentagon;

//define the axis we are testing on
const axis = new LP.LPVector(8,2);

export function update(_delta){
  elapsed += _delta;
}

var printed=false;
export function draw(){
  LP.draw_lineV(new LP.LPVector(0,0), axis,0x000000,0x0000ff); //dont wanna see anchor just line

  //get a list of coefficients for each point.
  const pointList1 = S3.getCoefficientsOfProjection(pentagon,axis);
  //get index of the min and max points, to color them differently in both the axisVector plot and the x-axis plot
  var min = S3.findMin(pointList1);
  var max = S3.findMax(pointList1);
  
   //plot just the coefficients of projected point onto the x-axis
   var scale = 10; //these coefficients are very small, scale them to make them visible at worldDelta of 20
   var i = 0;
   for (i = 0; i < pointList1.getSize(); i += 1){
     var p = pointList1.get(i);
     if (i == min){
      LP.draw_anchor(p*scale,0,0xff0000); //if min, draw red
      continue;     }
     if (i == max){
      LP.draw_anchor(p*scale,0,0x0000ff); //if max, draw green
      continue;
     }
     LP.draw_anchor(p*scale,0,0x000000); //else draw black
   }
  
  //now draw projected points of the pentagon on the axis
  const pointList2 = S3.projectPrimitiveOntoAxis(pentagon,axis); //get a list of the projected points
  var i = 0;
  for (i = 0; i < pointList2.getSize(); i += 1){
    var p = pointList2.get(i);
    if (i == min){
      LP.draw_anchorV(p,0xff0000); //if min, draw red
      continue;
     }
     if (i == max){
      LP.draw_anchorV(p,0x0000ff); //if max, draw green
      continue;
     }
     LP.draw_anchorV(p,0x000000); //else draw black
  } //draw each projected point (vectors) onto the axis

  //drawNormals(pentagon, 0x445500,0x00ff00);

  //LP.draw_primitive(pentagon,0,0,0,0x00ff00,0xc9f0e8,true);
  //LP.draw_primitive(prim01,0,0,0,0x0000ff,0x0,true);
}