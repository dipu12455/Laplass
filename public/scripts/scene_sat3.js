import * as LP from './LPEngine/LPEngine.js';
import * as S3 from './scene_sat3Def.js';

var elapsed = 0;
var animate = 5;
var animate2 = 5;
var angle = 0;

//define a primitive
var prim01 = S3.prim01;

//pentagon
var pentagon = S3.pentagon;
var pentagonX, pentagonY;
var trpent;

var coeffList, projPointList, min, max;

//define the axis we are testing on
const axis = new LP.LPVector(8, 2);
var printed = false;
export function update(_delta) {
  elapsed += _delta;
  animate = Math.cos(elapsed / 50.0);
  animate2 = Math.sin(elapsed / 50.0);
  angle += 0.3 * _delta;
  pentagonX = 0;
  pentagonY = 0;
  var pentagonRot = angle;

  trpent = LP.transform_primitive(pentagon,pentagonX,pentagonY,pentagonRot);

  //get a list of coefficients for each point.
  coeffList = S3.getCoefficientsOfProjection(trpent, axis); //it outputs list of scalars
  //get index of the min and max points, to color them differently in both the axisVector plot and the x-axis plot
  min = S3.findMin(coeffList);
  max = S3.findMax(coeffList);

  //get a list of projected points of the pentagon
  projPointList = S3.projectPrimitiveOntoAxis(trpent, axis); //this outputs list of vectors

}


export function draw() {
  LP.draw_lineV(new LP.LPVector(0, 0), axis, 0x000000, 0x0000ff); //dont wanna see anchor just line

  //plot just the coefficients of projected point onto the x-axis
  var scale = 10; //these coefficients are very small, scale them to make them visible at worldDelta of 20
  var i = 0;
  for (i = 0; i < coeffList.getSize(); i += 1) {
    var p = coeffList.get(i);
    if (i == min) {
      LP.draw_anchor(p * scale, 0, 0xff0000); //if min, draw red
      continue;
    }
    if (i == max) {
      LP.draw_anchor(p * scale, 0, 0x0000ff); //if max, draw green
      continue;
    }
    LP.draw_anchor(p * scale, 0, 0x000000); //else draw black
  }

  //plot projected vectors on the axis itself
  var i = 0;
  for (i = 0; i < projPointList.getSize(); i += 1) {
    var p = projPointList.get(i);
    if (i == min) {
      LP.draw_anchorV(p, 0xff0000); //if min, draw red
      continue;
    }
    if (i == max) {
      LP.draw_anchorV(p, 0x0000ff); //if max, draw green
      continue;
    }
    LP.draw_anchorV(p, 0x000000); //else draw black
  } //draw each projected point (vectors) onto the axis

  S3.drawNormals(trpent, new LP.LPVector(pentagonX, pentagonY), 0x445500,0x00ff00);
  LP.draw_primitive(trpent,0x00ff00,0xc9f0e8,true);
  //LP.draw_primitive(LP.transform_primitive(prim01,0,0,-animate*4),0x0000ff,0x0,true);
}