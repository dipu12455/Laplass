import { LPList } from "./LPList.js";
import { findAverage, findLeftPerpendicular, getMag, getTheta, getUnitVector, sqr, sumOfSqr, v2Minusv1 } from './LPVector.js';
import { dotProduct } from './LPVector.js';
import { scalarXvector, v1Plusv2 } from './LPVector.js';
import { draw_anchor, draw_line, printConsole, setPrintConsole } from './LPEngineCore.js';
import { Primitive, addPrimitiveVertex, getBoundingBox, getNormalsOfPrimitive, getPrimitive, transform_primitive } from "./LPPrimitives.js";
import { INSTANCES } from "./LPInstances.js";

var collisionPerFrame = 0;
var collisionPatternList = [];
export function collisionsInit() { //call this after all instances are added to LPE, best call it after instancesInit()
  let i = 0;
  for (i = 0; i < INSTANCES.getSize(); i += 1) {
    collisionPatternList[i] = [];
  }//each element of this array will hold elements equal to number of instances
  //if n is number of instances in LPE, the main array has n slots, and each of those n slots have n slots

  //now loop through all and fill with 0. 0 means pattern not encountered. 1 means pattern encountered
  i = 0;
  for (i = 0; i < INSTANCES.getSize(); i += 1) {
    let j = 0;
    for (j = 0; j < INSTANCES.getSize(); j += 1) {
      collisionPatternList[i][j] = 0;
    }
  }
}

function resetCollisionPatternList() {
  let i = 0;
  for (i = 0; i < collisionPatternList.length; i += 1) {
    let j = 0;
    for (j = 0; j < collisionPatternList.length; j += 1) {
      collisionPatternList[i][j] = 0;
    }
  }

}

//function to analyze collisions between all registered instances of LPE.
//if the instance is switched into 'physical' mode, this function will teleport two overlapping instances to their MTV
export function getCollisions() {
  let i = 0;
  for (i = 0; i < INSTANCES.getSize(); i += 1) {
    var current = INSTANCES.get(i);
    if (current.getPrimitiveIndex() == -1) continue; //skip collision check for instance with no primitive
    if (current.is3D) continue; //skip collision check for 3D instances

    let j = 0;
    for (j = 0; j < INSTANCES.getSize(); j += 1) {
      var target = INSTANCES.get(j);
      if (target.getPrimitiveIndex() == -1) continue; //skip collision check for instance with no primitive
      if (target.is3D) continue; //skip collision check for 3D instances

      //if checking collision with self, skip to next
      if (target.id == current.id) {
        continue;
      }
      //check if pattern already encountered, to only calculate collision between unique instances each frame
      if (collisionPatternList[current.id][target.id] == 1 ||
        collisionPatternList[target.id][current.id] == 1) {

        continue;
      }
      else {
        //if not, record this collision
        collisionPatternList[current.id][target.id] = 1;
        collisionPatternList[target.id][current.id] = 1;

      }
      //first check for bounding box overlap, if so... then check for SAT collision
      if (isOverlapBoundingBox(current, target)) {

        var collision = checkCollisionPrimitivesInstances(current, target);
        var angleOfContact = collision[1];
        if (collision[0] == 1) {
          //save the instance index of target  and the angle of contact inside the current instance
          current.collisionListAdd([target.getId(), angleOfContact]);
          //here, check if these two instances are physical, and if so
          //move them apart, then exchange their linear momentum
          if (current.isPhysical() && target.isPhysical()) {
            unOverlapInstances(current, target, collision);
            updateAcchByExchangeOfMomenta(current, target); //this function has direct access to instances. it will directly add acch to those instances
          }

        }
      }
    }
  }
  //reset the collisionPatternList
  resetCollisionPatternList();
}

//changes the velocity of both instances according to their mutual momentum transfer
function updateAcchByExchangeOfMomenta(_instance1, _instance2) {
  //obtain mass and velocities of each instance
  var m1 = _instance1.getMass(); var v1 = _instance1.getVelocity();
  var m2 = _instance2.getMass(); var v2 = _instance2.getVelocity();

  //calculate their respective momenta
  var p1 = scalarXvector(m1, v1);
  var p2 = scalarXvector(m2, v2);

  //now p1dash (the new momentum) is equal to p2
  var p1dash = p2;
  /*mass stays constant, so the new momentum is compensated by change in velocity
  p1dash = m1 * v1dash => v1dash = p1dash / m1 */
  var v1dash = scalarXvector(1 / m1, p1dash);

  //similarly for 2nd instance
  var p2dash = p1;
  var v2dash = scalarXvector(1 / m2, p2dash);

  //now you have initial and final velocities of both instance
  //their difference yields the acceleration that would be be caused by their exchange of momentum
  var acc1 = v2Minusv1(v1, v1dash);
  var acc2 = v2Minusv1(v2, v2dash);

  //now add these accelerations to each instance's previous acceleration
  var acc1Prev = _instance1.getAcceleration();
  _instance1.setAcceleration(v1Plusv2(acc1Prev, acc1));

  //likewise for 2nd instance
  var acc2Prev = _instance2.getAcceleration();
  _instance2.setAcceleration(v1Plusv2(acc2Prev, acc2));
}
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
    var edgePointIndexes1 = findEdgePoints(_primitive1, normalList.get(i));
    let min1 = edgePointIndexes1[0]; let max1 = edgePointIndexes1[1];
    let prim1edgePoint1 = projOfuOnv(_primitive1.get(min1), normalList.get(i));
    let prim1edgePoint2 = projOfuOnv(_primitive1.get(max1), normalList.get(i));
    //let projPointList1 = projectPrimitiveOntoAxis(_primitive1, normalList.get(i));
    let center1 = findAverage(prim1edgePoint1, prim1edgePoint2);

    //repeat the above for the second primitive
    var edgePointIndexes2 = findEdgePoints(_primitive2, normalList.get(i));
    let min2 = edgePointIndexes2[0]; let max2 = edgePointIndexes2[1];
    let prim2edgePoint1 = projOfuOnv(_primitive2.get(min2), normalList.get(i));
    let prim2edgePoint2 = projOfuOnv(_primitive2.get(max2), normalList.get(i));
    //let projPointList1 = projectPrimitiveOntoAxis(_primitive1, normalList.get(i));
    let center2 = findAverage(prim2edgePoint1, prim2edgePoint2);


    let distanceBetweenCenters = 0;
    distanceBetweenCenters = getMag(v2Minusv1(center1, center2));

    let halfwidth1 = 0;
    halfwidth1 = getMag(v2Minusv1(prim1edgePoint1, center1));

    let halfwidth2 = 0;
    halfwidth2 = getMag(v2Minusv1(prim2edgePoint1, center2));

    //finally find overlap using the following formula
    var distance = distanceBetweenCenters - halfwidth1 - halfwidth2
    overlap = distance < 0

    distances.add(Math.abs(distance)); //need the abs min value later

    if (overlap == false) break;

  }
  if (overlap == true) {
    minOverlapAxis = normalList.get(findMin(distances));
    var vU_minOverlapAxis = getUnitVector(minOverlapAxis);
    var minDistance = distances.get(findMin(distances));
    return [1, vU_minOverlapAxis[0], vU_minOverlapAxis[1], minDistance];
  } else {
    return [0, -1, -1, -1];
  }

}

function printFrame(_placePoint, projPointList1, projPointList2, center1, center2, distanceBetweenCenters, halfwidth1, halfwidth2) {
  drawListOfPoints(_placePoint, projPointList1, 0xff0000);
  drawListOfPoints(_placePoint, projPointList2, 0x0000ff);
  draw_anchor(v1Plusv2(_placePoint, center1), 0x00ff00);
  draw_anchor(v1Plusv2(_placePoint, center2), 0x00ff00);
  draw_line([-_placePoint[0], 5], [-_placePoint[0] + distanceBetweenCenters, 5], 0xff0000);
  draw_line([-_placePoint[0], 6], [-_placePoint[0] + halfwidth1, 6], 0x0000ff);
  draw_line([-_placePoint[0], 7], [-_placePoint[0] + halfwidth2, 7], 0x0000ff);

  draw_line([-_placePoint[0], 4], [-_placePoint[0] + (distanceBetweenCenters - halfwidth1 - halfwidth2), 4], 0xff0000);
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

export function checkCollisionPrimitivesInstances(_instance1, _instance2) {
  //if instances don't have primitives, skip collision check
var prim1index = _instance1.getPrimitiveIndex();
var prim2index = _instance2.getPrimitiveIndex();
  if (prim1index == -1 || prim2index == -1) {
    console.error(`Instance with undefined primitive.`);
    return [0, -1];
  }
  //obtain the first primitive transformed into the orientation of its instance
  var prim1 = transform_primitive(getPrimitive(prim1index),
    _instance1.getX(), _instance1.getY(), _instance1.getRot());

  //obtain the second primitive tranformed into the orientation of its instance
  var prim2 = transform_primitive(getPrimitive(prim2index),
    _instance2.getX(), _instance2.getY(), _instance2.getRot());

  //check collision between these two primitives
  return checkCollisionPrimitives(prim1, prim2);
}



//if two instances overlap by n units, it moves each instance n/2 units away from one another, in the 
//direction of the vector that passes through their centers.
function unOverlapInstances(_instance1, _instance2, _collision) {
  var center1 = _instance1.findCenterOfInstancePrimitive();
  var center2 = _instance2.findCenterOfInstancePrimitive();

  var vectorBetweenCenters = v2Minusv1(center1, center2);
  //this is the direction of the vector to move them apart
  var vU_dirToMoveApart = getUnitVector(vectorBetweenCenters);
  //this is the magnitude by which to move each instance apart
  var distToMoveApart = _collision[3] / 2; //should be half

  //remember that MTV would work, but sometimes shapes pass through each other.
  //this way of finding direction also works, using two centers and all
  //just the mag is what you need
  _instance1.setPosition([_instance1.getX() - vU_dirToMoveApart[0] * distToMoveApart,
    _instance1.getY() - vU_dirToMoveApart[1] * distToMoveApart]);
  _instance2.setPosition([_instance2.getX() + vU_dirToMoveApart[0] * distToMoveApart,
    _instance2.getY() + vU_dirToMoveApart[1] * distToMoveApart]);
}

function isOverlapBoundingBox(_instance1, _instance2) {
  //get boundingbox of instance1 and turn it into a primitive
  var bbox1 = getBoundingBox(_instance1.getPrimitiveIndex());
  //now transform this bbox into prim then, to xyrot of instance
  var bbox1prim = transform_primitive(primFromBoundingBox(bbox1),
  _instance1.getX(), _instance1.getY(), _instance1.getRot());

  //get boundingbox of instance2 and turn it into a primitive
  var bbox2 = getBoundingBox(_instance2.getPrimitiveIndex());
  //now transform this bbox into prim then, to xyrot of instance
  var bbox2prim = transform_primitive(primFromBoundingBox(bbox2), 
  _instance2.getX(), _instance2.getY(), _instance2.getRot());

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
  const coefficient = dotProd / sumOfSqr(_v[0], _v[1]) /* sqr(getMag(_v)) */;
  return coefficient; //this is a scalar
}

//function that returns the index of the min and max points of a primitive projected on an axis (edgepoints)
function findEdgePoints(_primitive, _axisVector) {
  var i = 0;
  var min = dotProduct(_primitive.get(0), _axisVector);
  var max = min;
  var minIndex = 0; var maxIndex = 0;
  for (i = 0; i < _primitive.getSize(); i += 1) {
    var point = _primitive.get(i);
    var value = dotProduct(point, _axisVector);
    if (value < min) {
      min = value;
      minIndex = i;
    }
    if (value > max) {
      max = value;
      maxIndex = i;
    }
  }
  return [minIndex, maxIndex];
}

//put the draw functions in the draw function of the scene file

export function draw_plotVectorList(_vectorList) {
  var i = 0;
  for (i = 0; i < _vectorList.getSize(); i += 1) {
    var p = _vectorList.get(i);
    draw_anchor(p, 0x000000); //else draw black
  } //draw each projected point (vectors) onto the axis
}

export function drawListOfPoints(_place, _pointList, _color) {
  let i = 0;
  for (i = 0; i < _pointList.getSize(); i += 1) {
    let p = _pointList.get(i);
    draw_anchor(v1Plusv2(_place, p), _color);
  }
}
