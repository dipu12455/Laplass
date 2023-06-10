import * as LP from './LPEngine/LPEngine.js';
import { obj_Pentagon } from './obj_Pentagon.js';
import { obj_Triangle } from './obj_triangle.js';

var temp;

//define a primitive
temp = new LP.Primitive(new LP.LPVector(0,0));
temp.add(new LP.LPVector(2,2)); //LPVectors are the so similar to vertices, so just using them
temp.add(new LP.LPVector(-2,1));
temp.add(new LP.LPVector(-2,-2));
export var prim01 = LP.PRIMITIVES.add(temp);

//pentagon
temp = new LP.Primitive(new LP.LPVector(0,0));
temp.add(new LP.LPVector(-5,1));
temp.add(new LP.LPVector(0,6));
temp.add(new LP.LPVector(5,1));
temp.add(new LP.LPVector(3,-5));
temp.add(new LP.LPVector(-3,-5));
export var pentagon = LP.PRIMITIVES.add(temp);

//create an instance and set its primitive index
export var ins1 = LP.INSTANCES.add(new obj_Pentagon());
LP.setPrimitiveIndex(ins1,pentagon);

//make an instance of a different object, and this object has completely different behavior
export var triangle = LP.INSTANCES.add(new obj_Triangle());
LP.setPrimitiveIndex(triangle, prim01);