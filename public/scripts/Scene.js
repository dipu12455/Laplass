import * as LP from './LPEngine/LPEngine.js';
import * as Scene from './SceneDef.js';

//get the entity from def file
var ins1 = Scene.ins1;
var ins2 = Scene.ins2;

var printed = false;
var initExecuted = false;

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
  LP.selectInstance(ins1);
  var prim1 = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()),
    LP.getX(),LP.getY(),LP.getRot());
    LP.unSelectAll();

  //obtain the second primitive tranformed into the orientation of its instance
  LP.selectInstance(ins2);
  var prim2 = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()),
  LP.getX(),LP.getY(),LP.getRot()); 
  LP.unSelectAll();

  //check collision between these two primitives, and if so draw a red dot
  if (LP.checkCollision(prim1, prim2)) {
    LP.draw_anchorV(new LP.LPVector(-5, 5), 0xff0000);
  }
  let i = 0;
  for (i = 0; i < LP.INSTANCES.getSize(); i += 1) {
    LP.selectInstance(i);
    draw_instance(); //call the update action of each instance
    LP.unSelectAll();
  }
}

function draw_instance() {
  var trans = LP.transform_primitive(LP.getPrimitive(LP.getPrimitiveIndex()),
  LP.getX(),LP.getY(),LP.getRot());

  LP.draw_primitive(trans);//, 0x00ff00, 0xc9f0e8, true);
}