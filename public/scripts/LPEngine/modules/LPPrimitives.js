import { LPList } from "./LPList.js";
import { LPVector } from './LPVector.js';
import { v2Minusv1 } from './LPVector.js';
import { findLeftPerpendicular } from './LPVector.js';
import { transformVector } from "./LPVector.js";

export class Primitive extends LPList{
    constructor(_origin){
      super();
      this.xorigin = _origin.getX();
      this.yorigin = _origin.getY();
    }
    getOrigin(){
      return new LPVector(this.xorigin,this.yorigin);
    }
    setOrigin(_origin){
      this.xorigin = _origin.getX();
      this.yorigin = _origin.getY();
    }
    getPrint(){
      var i = 0;
      var output = ``;
      for (i = 0; i < this.getSize();i += 1){
        output = output.concat(this.get(i).getPrint());
      }
      return output;
    }
  }

  export var PRIMITIVES = new LPList(); //list of all primitives in LPE

  //primitive needs to be defined in vertex list
  export function getNormalsOfPrimitive(_primitive){
    var i = 0;
    var normalList = new LPList();
    for (i = 0; i < _primitive.getSize(); i += 1){
      var p1; var p2;
      if (i == 0){
        p1 = _primitive.get(_primitive.getSize()-1);
        p2 = _primitive.get(i);
      }
      else{
        p1 = _primitive.get(i-1);
        p2 = _primitive.get(i);
      }
  
      var normal = findLeftPerpendicular(v2Minusv1(p1,p2));
      normalList.add(normal);
    }
    return normalList;
  }

  export function transform_primitive(_primitive, _x, _y, _rot){
    var i = 0;
    var output = new Primitive(new LPVector(0,0)); //this function sets origin to (0,0) for now
    for (i = 0; i < _primitive.getSize(); i += 1){
      //get the vertex
      var vertex = _primitive.get(i);
  
      //translate the vertex to prim's rot and coord, using new var to leave prim's vertex untouched.
      var vertex2 = transformVector(vertex,_x,_y,vertex.getTheta()+_rot);
  
      //add this transformed vertex to new primitive
      output.add(vertex2);
    }
    return output;
  }