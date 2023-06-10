import * as LP from './LPEngine/LPEngine.js';
import * as S3 from './scene_sat3Def.js';

var elapsed = 0;
var animate = 5;
var animate2 = 5;
var angle = 0;

//get the entity from def file
var ins1 = S3.ins1;

var coeffList, projPointList, min, max;

//define the axis we are testing on
const axis = new LP.LPVector(8, 2);
var printed = false;

export function update(_delta) {
  elapsed += _delta;
  animate = Math.cos(elapsed / 50.0);
  animate2 = Math.sin(elapsed / 50.0);
  angle += 0.3 * _delta;

  //update the attributes of the entity
  LP.setX(ins1,animate*5);
  LP.setY(ins1,0);
  LP.setRot(ins1,angle);
}

export function draw() {
  LP.draw_lineV(new LP.LPVector(0, 0), axis, 0x000000, 0x0000ff); //dont wanna see anchor just line

  var trpent = LP.transform_primitive(LP.PRIMITIVES.get(LP.getPrimitiveIndex(ins1)),LP.getX(ins1),LP.getY(ins1),LP.getRot(ins1));
  //get a list of coefficients for each point.
  coeffList = LP.getCoefficientsOfProjection(trpent, axis); //it outputs list of scalars
  //get index of the min and max points, to color them differently in both the axisVector plot and the x-axis plot
  min = LP.findMin(coeffList);
  max = LP.findMax(coeffList);
  //get a list of projected points of the pentagon
  projPointList = LP.projectPrimitiveOntoAxis(trpent, axis); //this outputs list of vectors

  //plot just the coefficients of projected point onto the x-axis
  draw_plotPointsXaxis(coeffList, 10, min, max); //scale of 10 because coeffs of proj are small

  //plot projected vectors on the axisVector itself
  draw_plotVectorList(projPointList, min, max);
  
  LP.drawNormals(trpent, new LP.LPVector(LP.getX(ins1), LP.getY(ins1)), 0x445500,0x00ff00);
  LP.draw_primitive(trpent,0x00ff00,0xc9f0e8,true);
  //LP.draw_primitive(LP.transform_primitive(prim01,0,0,-animate*4),0x0000ff,0x0,true);
}

//function to plot a list of points on xaxis
function draw_plotPointsXaxis(_pointsList, _scale, _min, _max){
  var i = 0;
  for (i = 0; i < _pointsList.getSize(); i += 1) {
    var p = _pointsList.get(i);
    if (i == _min) {
      LP.draw_anchor(p * _scale, 0, 0xff0000); //if min, draw red
      continue;
    }
    if (i == _max) {
      LP.draw_anchor(p * _scale, 0, 0x0000ff); //if max, draw green
      continue;
    }
    LP.draw_anchor(p * _scale, 0, 0x000000); //else draw black
  }
}

function draw_plotVectorList(_vectorList, _min, _max){
  var i = 0;
  for (i = 0; i < _vectorList.getSize(); i += 1) {
    var p = _vectorList.get(i);
    if (i == _min) {
      LP.draw_anchorV(p, 0xff0000); //if min, draw red
      continue;
    }
    if (i == _max) {
      LP.draw_anchorV(p, 0x0000ff); //if max, draw green
      continue;
    }
    LP.draw_anchorV(p, 0x000000); //else draw black
  } //draw each projected point (vectors) onto the axis
}