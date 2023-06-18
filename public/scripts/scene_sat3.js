import * as LP from './LPEngine/LPEngine.js';
import * as S3 from './scene_sat3Def.js';
import { findMin } from './LPEngine/LPEngine.js';
import { findMax } from './LPEngine/LPEngine.js';

//get the entity from def file
var ins1 = S3.ins1;
var ins2 = S3.ins2;

var printed = false;
var initExecuted = false;

var testList = new LP.LPList();
/* testList.add(-1.595368791568188);
testList.add(-0.9453687915681881);
testList.add(-0.7953687915681881); */

/* testList.add(1.1969125277121258);
testList.add(0.6969125277121255);
testList.add(0.39691252771212554);
console.log(`testList ${testList.getPrint()}`);
console.log(`min ${testList.get(findMin(testList))}`);
console.log(`max ${testList.get(findMax(testList))}`);
var condition1 = 1.1969125277121258 < 0.6969125277121255;
var condition2 = 0.6969125277121255 < 1.1969125277121258;
console.log(`condition ${condition1}`);
console.log(`condition ${condition2}`); */


export function update(_delta) {
  if (initExecuted == false) {
    initExecuted = true;
    //run the createRoutine for instances, a set of routines to set preset state of each instance
    LP.initInstances();
  }
  LP.updateInstances(_delta);

  //put the pause event here for now
  if (LP.isEventFired(LP.evKeyG)) {
    LP.timeResume();
    LP.turnOffEvent(LP.evKeyG);
  }
  if (LP.isEventFired(LP.evKeyS)) {
    LP.timePause();
    LP.turnOffEvent(LP.evKeyS);
  }
  if (LP.isEventFired(LP.evKeyP)) {
    LP.printConsole();
    LP.turnOffEvent(LP.evKeyP);
  }
  //turn off all active events for a fresh start
  LP.turnOffEvents(); //this location is temporary, try to hide this from the client app of LPE
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

  //check collision between these two primitives, and if so draw a red dot
  if (LP.checkCollision(prim1, prim2)) {
    LP.draw_anchorV(new LP.LPVector(-5, 5), 0xff0000);
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