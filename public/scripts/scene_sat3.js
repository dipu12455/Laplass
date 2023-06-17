import * as LP from './LPEngine/LPEngine.js';
import * as S3 from './scene_sat3Def.js';

var elapsed = 0;
var animate = 5;
var animate2 = 5;
var angle = 0;

//get the entity from def file
var ins1 = S3.ins1;
var triangle = S3.triangle;
var triangle2 = S3.triangle2;

var coeffList, projPointList, min, max;

//define the axis we are testing on
const axis = new LP.LPVector(8, 2);
var printed = false;
var initExecuted = false;

export function update(_delta) {
  if (initExecuted == false) {
    initExecuted = true;
    //run the createRoutine for instances, a set of routines to set preset state of each instance
    LP.initInstances();
  }
  LP.updateInstances(_delta);
}

export function draw() {
  LP.draw_lineV(new LP.LPVector(0, 0), axis, 0x000000, 0x0000ff); //dont wanna see anchor just line

  var trpent = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex(ins1)), LP.getX(ins1), LP.getY(ins1), LP.getRot(ins1));
  //get a list of coefficients for each point.
  coeffList = LP.getCoefficientsOfProjection(trpent, axis); //it outputs list of scalars
  //get index of the min and max points, to color them differently in both the axisVector plot and the x-axis plot
  min = LP.findMin(coeffList);
  max = LP.findMax(coeffList);
  //get a list of projected points of the pentagon
  projPointList = LP.projectPrimitiveOntoAxis(trpent, axis); //this outputs list of vectors

  //plot just the coefficients of projected point onto the x-axis
  LP.draw_plotPointsXaxis(coeffList, 10, min, max); //scale of 10 because coeffs of proj are small

  //plot projected vectors on the axisVector itself
  LP.draw_plotVectorList(projPointList, min, max);

  LP.drawNormals(trpent, new LP.LPVector(LP.getX(ins1), LP.getY(ins1)), 0x445500, 0x00ff00);
  LP.draw_primitive(trpent, 0x00ff00, 0xc9f0e8, true);
  //LP.draw_primitive(LP.transform_primitive(prim01,0,0,-animate*4),0x0000ff,0x0,true);
  let i = 0;
  for (i = 0; i < LP.INSTANCES.getSize(); i += 1) {
    draw_instance(i); //call the update action of each instance
  }
}

function draw_instance(_instanceIndex) {
  var trans = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex(_instanceIndex)),
    LP.getX(_instanceIndex),
    LP.getY(_instanceIndex),
    LP.getRot(_instanceIndex));

  LP.draw_primitive(trans);//, 0x00ff00, 0xc9f0e8, true);
}