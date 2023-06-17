import * as LP from './LPEngine/LPEngine.js';
import * as S3 from './scene_sat3Def.js';

//get the entity from def file
var ins1 = S3.ins1;
var ins2 = S3.ins2;

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
  //obtain the first primitive transformed into the orientation of its instance
  var prim1 = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex(ins1)),
    LP.getX(ins1),
    LP.getY(ins1),
    LP.getRot(ins1));

  //obtain the second primitive tranformed into the orientation of its instance
  var prim2 = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex(ins2)),
    LP.getX(ins2),
    LP.getY(ins2),
    LP.getRot(ins2));

  //check collision between these two primitives, and if so output to console.
  if (LP.checkCollision(prim1, prim2)) {
    console.log(`HELLLL EFFINNNN YYEAAAHHHH!!!!!`);
  }
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