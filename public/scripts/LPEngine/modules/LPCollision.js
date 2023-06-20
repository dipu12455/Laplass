import { LPList } from "./LPList.js";
import { getUnitVector, sqr } from './LPVector.js';
import { dotProduct } from './LPVector.js';
import { scalarXvector } from './LPVector.js';
import { draw_anchor, draw_anchorV, isPrintConsole, timePause, turnOffPrintConsole } from './LPEngineCore.js';
import { getNormalsOfPrimitive, getPrimitive, transform_primitive } from "./LPPrimitives.js";
import { getPrimitiveIndex, getRot, getX, getY, selectInstance, unSelectAll } from "./LPInstances.js";

/* a function that takes in two primitives and checks if they have collision. These can be just two ordinary primitives, or primitives that represent collision points of
a physics object, or they could be primitives that represent the bounding box of a sprite.  Be sure to pass in primitives that have been transformed into their instance's (x,y,rot),
then you have the accurate orientation of each primitive for this function. This function utilizes the SAT collision detection algorithm. */
export function checkCollision(_primitive1, _primitive2) {
  var mtvList = new LPList();
  //first make a list of axisVectors which is a list of normals of both primitives. TODO: parallel normals need not be evaluated twice.
  var normalList = getNormalsOfPrimitive(_primitive1);
  var normalList2 = getNormalsOfPrimitive(_primitive2);
  normalList.append(normalList2);
  let i = 0;

  //iterate through the  normallist
  for (i = 0; i < normalList.getSize(); i += 1) {
    //find coefficients of projection of vertices of first primitive on this axisVector
    let pointList1 = getCoefficientsOfProjection(_primitive1, normalList.get(i));
    //now find min and max value of the list of points
    let min1 = findMin(pointList1); let max1 = findMax(pointList1);
    //find the average of the min and max value to obtain center of this primitive
    let center1 = (pointList1.get(max1) + pointList1.get(min1)) / 2;

    //repeat the above for the second primitive
    let pointList2 = getCoefficientsOfProjection(_primitive2, normalList.get(i));
    let min2 = findMin(pointList2); let max2 = findMax(pointList2);
    let center2 = (pointList2.get(max2) + pointList2.get(min2)) / 2;

    //think of all these values plotted on the x-axis (like a number line)

    //find the distance between the centers, do (larger - smaller), imagine their larger and smaller values on the x-axis. the larger would be on the right and the smaller would be on the left.
    //this is a way to make sure to always have shape1 on the left, and shape2 on the right.
    let distanceBetweenCenters = 0;
    if (center1 > center2) distanceBetweenCenters = center1 - center2;
    if (center2 > center1) distanceBetweenCenters = center2 - center1;

    //find halfwidth1, this is always the halfwidth of primitive that has smaller center value on the x-axis
    let halfwidth1 = 0;
    if (center1 < center2) halfwidth1 = pointList1.get(max1) - center1;
    if (center2 < center1) halfwidth1 = pointList2.get(max2) - center2;

    //find halfwidth2, this is always the halfwidth of primitive that has larger center value on the x-axis
    let halfwidth2 = 0;
    if (center1 > center2) halfwidth2 = center1 - pointList1.get(min1);
    if (center2 > center1) halfwidth2 = center2 - pointList2.get(min2);

    //finally find overlap using the following formula
    var distance = distanceBetweenCenters - halfwidth1 - halfwidth2
    var overlap = distance < 0;
    mtvList.add(distance); //any recorded distance is guaranteed to be less than zero

    if (overlap == false) break;
  }
  //try to put return statements after most usage is finished with data structures, otherwise compiler will delete the data before function reaches the return statement
  if (overlap == true) {
    //find which overlap was the closest to zero
    var ind = findMax(mtvList);
    var smallestOverLapVectorDirection = getUnitVector(normalList.get(ind)); //the index of closest-to-zero value in mtvlist has same index as the index of the normal in the normalList. Only need direction of this vector, so change to unit vector
    var smallestOverLapVectorMagnitude = mtvList.get(ind); //that distance just found, is the mag of this Minimum Translation Vector (MTV)
    
    return [smallestOverLapVectorDirection.getX(),
    smallestOverLapVectorDirection.getY(),
      smallestOverLapVectorMagnitude,
      1]; //if overlap didn't return false for the above loop of all the normals, then there is collision, which is the `1` value of the array that is returned. Respectively, it returns unit vector i, unit vector j and the mag of mtv, then overlap (0/1).
  } else {
    return [-1, -1, -1, 0]; //exit out of this algorithm, because even a single lack of overlap in a normal means there is no collision.
  }

}

export function checkCollisionInstances(_instanceIndex1, _instanceIndex2) {
  //obtain the first primitive transformed into the orientation of its instance
  selectInstance(_instanceIndex1);
  var prim1 = transform_primitive(getPrimitive(getPrimitiveIndex()),
    getX(), getY(), getRot());
  unSelectAll();

  //obtain the second primitive tranformed into the orientation of its instance
  selectInstance(_instanceIndex2);
  var prim2 = transform_primitive(getPrimitive(getPrimitiveIndex()),
    getX(), getY(), getRot());
  unSelectAll();

  //check collision between these two primitives
  return checkCollision(prim1, prim2);
}

//takes a primitive and only returns a list of the coefficient of each point with the axis
export function getCoefficientsOfProjection(_primitive, _axisVector) {
  var i = 0;
  var pointList = new LPList();
  for (i = 0; i < _primitive.getSize(); i += 1) {
    var point = _primitive.get(i);

    //get the projection
    const proj = coeffOfProjuOnv(point, _axisVector);

    pointList.add(proj);
  }
  return pointList;
}

//returns a list of vectors that are projected on the given axisVector
export function projectPrimitiveOntoAxis(_primitive, _axisVector) {
  var i = 0;
  var projPointList = new LPList();
  for (i = 0; i < _primitive.getSize(); i += 1) {
    var point = _primitive.get(i);

    const proj = projOfuOnv(point, _axisVector);

    projPointList.add(proj);
  }
  return projPointList;
}



//takes a list and finds the min, returns the index of the min value of the list
export function findMin(_list /*type LPList*/) { //TODO: what if there are more that one min values? it is possible for two different vertices to have equal projection vector
  var min = 0;
  var value = 0;
  min = _list.get(0); //important to initialize the min var to the first value of the list
  var index = 0;
  var i = 0;
  for (i = 1; i < _list.getSize(); i += 1) {
    value = _list.get(i); //switch values per iteration for comparison
    if (value < min) {
      min = value;
      index = i;
    }
  }
  return index;
}

//takes a list and finds the max, returns the index of the max value of the list
export function findMax(_list) {
  var max = 0;
  var value = 0;
  max = _list.get(0); //important to initialize the max var to the first value of the list
  var index = 0;
  var i = 0;
  for (i = 1; i < _list.getSize(); i += 1) {
    value = _list.get(i); //switch values per iteration for comparison
    if (value > max) {
      max = value;
      index = i;
    }
  }
  return index;
}

function projOfuOnv(_u, _v) {
  const proj = scalarXvector(coeffOfProjuOnv(_u, _v), _v);
  return proj;
}

function coeffOfProjuOnv(_u, _v) {
  const dotProd = dotProduct(_u, _v);
  const coefficient = dotProd / sqr(_v.getMag());
  return coefficient; //this is a scalar
}

//put the draw functions in the draw function of the scene file

//function to plot a list of points on xaxis
export function draw_plotPointsXaxis(_pointsList, _scale, _min, _max) {
  var i = 0;
  for (i = 0; i < _pointsList.getSize(); i += 1) {
    var p = _pointsList.get(i);
    if (i == _min) {
      draw_anchor(p * _scale, 0, 0xff0000); //if min, draw red
      continue;
    }
    if (i == _max) {
      draw_anchor(p * _scale, 0, 0x0000ff); //if max, draw green
      continue;
    }
    draw_anchor(p * _scale, 0, 0x000000); //else draw black
  }
}

export function draw_plotVectorList(_vectorList, _min, _max) {
  var i = 0;
  for (i = 0; i < _vectorList.getSize(); i += 1) {
    var p = _vectorList.get(i);
    if (i == _min) {
      draw_anchorV(p, 0xff0000); //if min, draw red
      continue;
    }
    if (i == _max) {
      draw_anchorV(p, 0x0000ff); //if max, draw green
      continue;
    }
    draw_anchorV(p, 0x000000); //else draw black
  } //draw each projected point (vectors) onto the axis
}