import { LPList } from "./LPList.js";
import { LPVector } from './LPVector.js';
import { sqr } from './LPVector.js';
import { rotateVector } from './LPVector.js';
import { dotProduct } from './LPVector.js';
import { scalarXvector } from './LPVector.js';
import { v2Minusv1 } from './LPVector.js';
import { findLeftPerpendicular } from './LPVector.js';
import { v1Plusv2 } from './LPVector.js';


//returns a list of vectors that are projected on the given axisVector
export function projectPrimitiveOntoAxis(_primitive, _axisVector){
    var i = 0;
    var projPointList = new LPList();
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
    var pointList = new LPList();
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
    const proj = scalarXvector(coeffOfProjuOnv(_u,_v),_v);
    return proj;
  }
  
  function coeffOfProjuOnv(_u,_v){
    const dotProd = dotProduct(_u,_v);
    const coefficient = dotProd/sqr(_v.getMag());
    return coefficient; //this is a scalar
  }