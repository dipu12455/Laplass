import { LPList } from "./LPList.js";
import { findLeftPerpendicular, getMag, getTheta, getUnitVector, sqr, v2Minusv1 } from './LPVector.js';
import { dotProduct } from './LPVector.js';
import { scalarXvector } from './LPVector.js';
import { draw_anchor, printConsole } from './LPEngineCore.js';
import { Primitive, addPrimitiveVertex, getNormalsOfPrimitive, getPrimitive, transform_primitive } from "./LPPrimitives.js";
import { INSTANCES, collisionListAdd, getBoundingBox, getPrimitiveIndex, getRot, getSelectedInstance, getX, getY, selectInstance, unSelectAll } from "./LPInstances.js";

//check collision between circles
export function checkCollisionCircles(_p1, _r1, _p2, _r2) {
  var lineBetweenCenters = v2Minusv1(_p2, _p1);
  var distanceBetweenCenters = getMag(lineBetweenCenters);
  var overlap = distanceBetweenCenters - _r1 - _r2 < 0;
  var angleOfContact = getTheta(findLeftPerpendicular(lineBetweenCenters));
  if (overlap == true) {
    return [1, angleOfContact];
  } else {
    return [0, - 1];
  }
}

/* a function that takes in two primitives and checks if they have collision. These can be just two ordinary primitives, or primitives that represent collision points of
a physics object, or they could be primitives that represent the bounding box of a sprite.  Be sure to pass in primitives that have been transformed into their instance's (x,y,rot),
then you have the accurate orientation of each primitive for this function. This function utilizes the SAT collision detection algorithm. */
export function checkCollisionPrimitives(_primitive1, _primitive2) {
  //first make a list of axisVectors which is a list of normals of both primitives. TODO: parallel normals need not be evaluated twice.
  var normalList = getNormalsOfPrimitive(_primitive1);
  var normalList2 = getNormalsOfPrimitive(_primitive2);
  normalList.append(normalList2);
  var distances = new LPList();
  var overlap = false;
  var minOverlapAxis = [];
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
    distanceBetweenCenters = Math.abs(center1 - center2);

    //find halfwidth1, this is always the halfwidth of primitive that has smaller center value on the x-axis
    let halfwidth1 = 0;
    halfwidth1 = Math.abs(pointList1.get(max1) - center1);

    //find halfwidth2, this is always the halfwidth of primitive that has larger center value on the x-axis
    let halfwidth2 = 0;
    halfwidth2 = Math.abs(pointList2.get(max2) - center2);

    //finally find overlap using the following formula
    var distance = distanceBetweenCenters - halfwidth1 - halfwidth2
    distances.add(distance);
    overlap = distance < 0;

    if (overlap == false) break;

  }
  if (overlap == true) {
    minOverlapAxis = normalList.get(findMin(distances));
    //find perpendicular of minOverlapAxis, then find theta of that vector
    var angleOfContact = getTheta(minOverlapAxis);
    return [1, angleOfContact, Math.abs(distances.get(findMin(distances)))]; //the last element is the length of the overlap
  } else {
    return [0, -1, -1];
  }
}

export function checkPointInsidePrimitive(_p, _primitive) {
  //first make a list of axisVectors which is a list of normals of both primitives. TODO: parallel normals need not be evaluated twice.
  var normalList = getNormalsOfPrimitive(_primitive);
  var overlap = false;
  let i = 0;

  //iterate through the  normallist
  for (i = 0; i < normalList.getSize(); i += 1) {
    //find coefficients of projection of vertices of primitive on this axisVector
    let pointList = getCoefficientsOfProjection(_primitive, normalList.get(i));
    //now find min and max value of the list of points
    let min = pointList.get(findMin(pointList)); let max = pointList.get(findMax(pointList));

    //think of all these values plotted on the x-axis (like a number line)

    //project the given point to this axisVector
    var projPoint = coeffOfProjuOnv(_p, normalList.get(i));

    //if this projected point lies between min and max, then overlap is true with this axisVector
    if (projPoint > min && projPoint < max) {
      overlap = true;
    } else {
      overlap = false;
      break; //if a single non-overlap found, point doesn't exist within the primitive
    }
  }
  return overlap;
}

export function checkCollisionPrimitivesInstances(_instanceIndex1, _instanceIndex2) {
  //if instances don't have primitives, skip collision check
  selectInstance(_instanceIndex1); var prim1index = getPrimitiveIndex(); unSelectAll();
  selectInstance(_instanceIndex2); var prim2index = getPrimitiveIndex(); unSelectAll();
  if (prim1index == -1 || prim2index == -1) {
    console.error(`Instance with undefined primitive.`);
    return [0, -1];
  }
  //obtain the first primitive transformed into the orientation of its instance
  selectInstance(_instanceIndex1);
  var prim1 = transform_primitive(getPrimitive(prim1index),
    getX(), getY(), getRot());
  unSelectAll();

  //obtain the second primitive tranformed into the orientation of its instance
  selectInstance(_instanceIndex2);
  var prim2 = transform_primitive(getPrimitive(prim2index),
    getX(), getY(), getRot());
  unSelectAll();

  //check collision between these two primitives
  return checkCollisionPrimitives(prim1, prim2);
}

//function to analyze collisions between all registered instances of LPE.
//if the instance is switched into 'physical' mode, this function will teleport two overlapping instances to their MTV
export function getCollisions() {
  let i = 0;
  for (i = 0; i < INSTANCES.getSize(); i += 1) {
    //checking collision of each instance with every other instances
    selectInstance(i); var current = getSelectedInstance();
    if (getPrimitiveIndex() == -1) continue; //skip collision check for instance with no primitive
    unSelectAll();
    //obtain the instance to check collision for

    let j = 0;
    for (j = 0; j < INSTANCES.getSize(); j += 1) {
      selectInstance(j); var target = getSelectedInstance();
      if (getPrimitiveIndex() == -1) continue; //skip collision check for instance with no primitive
      unSelectAll(); //get the target instance to check collision with

      //if checking collision with self, skip to next
      if (target == current) {
        continue;
      }
      //first check for bounding box overlap, if so... then check for SAT collision
      if (isOverlapBoundingBox(current, target)) {

        var collision = checkCollisionPrimitivesInstances(current, target);
        var angleOfContact = collision[1];
        if (collision[0] == 1) {
          //save the instance index of target  and the angle of contact inside the current instance

          selectInstance(current);
          collisionListAdd([target, angleOfContact]); unSelectAll();
        }
      }
    }
  }
}

function isOverlapBoundingBox(_instanceIndex1, _instanceIndex2) {
  //get boundingbox of instance1 and turn it into a primitive
  selectInstance(_instanceIndex1);
  var bbox1 = getBoundingBox();
  //now transform this bbox into prim then, to xyrot of instance
  var bbox1prim = transform_primitive(primFromBoundingBox(bbox1), getX(), getY(), getRot());
  unSelectAll();

  //get boundingbox of instance2 and turn it into a primitive
  selectInstance(_instanceIndex2);
  var bbox2 = getBoundingBox();
  //now transform this bbox into prim then, to xyrot of instance
  var bbox2prim = transform_primitive(primFromBoundingBox(bbox2), getX(), getY(), getRot());
  unSelectAll();

  return checkCollisionPrimitives(bbox1prim, bbox2prim);
}

export function primFromBoundingBox(_bbox) {
  var x1 = _bbox.getP1()[0], y1 = _bbox.getP1()[1], x2 = _bbox.getP2()[0], y2 = _bbox.getP2()[1];
  var prim = new Primitive();
  prim.add([x1, y1]);
  prim.add([x2, y1]);
  prim.add([x2, y2]);
  prim.add([x1, y2]);
  return prim;
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
  const coefficient = dotProd / sqr(getMag(_v));
  return coefficient; //this is a scalar
}

//put the draw functions in the draw function of the scene file

//function to plot a list of points on xaxis
export function draw_plotPointsXaxis(_pointsList, _scale, _min, _max) {
  var i = 0;
  for (i = 0; i < _pointsList.getSize(); i += 1) {
    var p = _pointsList.get(i);
    if (i == _min) {
      draw_anchor([p * _scale, 0], 0xff0000); //if min, draw red
      continue;
    }
    if (i == _max) {
      draw_anchor([p * _scale, 0], 0x0000ff); //if max, draw green
      continue;
    }
    draw_anchor([p * _scale, 0], 0x000000); //else draw black
  }
}

export function draw_plotVectorList(_vectorList, _min, _max) {
  var i = 0;
  for (i = 0; i < _vectorList.getSize(); i += 1) {
    var p = _vectorList.get(i);
    if (i == _min) {
      draw_anchor(p, 0xff0000); //if min, draw red
      continue;
    }
    if (i == _max) {
      draw_anchor(p, 0x0000ff); //if max, draw green
      continue;
    }
    draw_anchor(p, 0x000000); //else draw black
  } //draw each projected point (vectors) onto the axis
}
