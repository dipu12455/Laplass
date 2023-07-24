//import * as PIXI from './pixi.js';

import { getNormalsOfPrimitive, getPrimitive, transform_primitive } from './Primitives.js';
import { v1Plusv2 } from './Vector.js';
import { LPEventsInit } from './Events.js';
import { INSTANCES, flushCollisions, getFollowedInstance_3D, initInstances, updateInstances } from './Instances.js';
import { collisionsInit } from './Collision.js';
import { LPVectorTest } from './tests/LPVector.test.js';
import { LPEventsTest } from './tests/LPEvents.test.js';
import { runTest } from './Test.js';
import { draw_text, initTexts, resetTexts } from './Texts.js';
import { TJS_init, TJS_render } from './3D/TJS_module.js';
import { draw_follow_grid } from './FollowGrid.js';

class View {
  constructor(_canvas, _worldDelta, _drawObject) {
    this.width = _canvas.clientWidth;
    this.height = _canvas.clientHeight;
    this.drawObject = _drawObject;
    this.worldOriginX = this.width / 2;
    this.worldOriginY = this.height / 2;
    this.worldDelta = _worldDelta;
  }
}
// these variables need to be referenced from all functions
var app;
var selectedView;

export var mainView, XYview, XZview;
var worldOriginX, worldOriginY, worldDelta;
var screenWidth, screenHeight; //this is local coord, not pixel coord
var screenGrid = false;
var timeRun = true;
var printConsoleState = false;
var unitTestState = false;

export var ThreeDMode = false;

//this function needs to be called before initialize(). This sets up the update operations that need to occur in each iteration of the game loop


export function initEngine(_window, _underlayCanvas, _overlayCanvas, _XYcanvas, _XZcanvas) {
  var width = _overlayCanvas.clientWidth;
  var height = _overlayCanvas.clientHeight;
  worldOriginX = width / 2;
  worldOriginY = height / 2;
  worldDelta = 20; //one unit means 20 pixels. so (-5,2) means (-100,40) pixels

  mainView = new View(_overlayCanvas, 20, new PIXI.Graphics());

  //initialize the main PIXI canvas
  app = new PIXI.Application({
    view: _overlayCanvas,
    backgroundAlpha: 0,
    width: mainView.width,
    height: mainView.height
  });

  XYview = new View(_XYcanvas, 20, new PIXI.Graphics());

  //initialize the two mini canvas of XY and XZ
  var XYapp = new PIXI.Application({
    view: _XYcanvas,
    backgroundAlpha: 0,
    width: XYview.width,
    height: XYview.height
  });


  XZview = new View(_XZcanvas, 20, new PIXI.Graphics());

  var XZapp = new PIXI.Application({
    view: _XZcanvas,
    backgroundAlpha: 0,
    width: XZview.width,
    height: XZview.height
  });
  /*no need to append the canvas created by PIXI to the html body,
  here you created your own canvas object, 
  then making pixi use this canvas object as its 'view'*/

  //now pass on the underlay canvas to TJS_module.js
  TJS_init(_underlayCanvas);

  LPEventsInit(_window);

  //draw object for main canvas
  app.stage.addChild(mainView.drawObject);
  selectedView = mainView;

  XYapp.stage.addChild(XYview.drawObject);
  XZapp.stage.addChild(XZview.drawObject);


  initTexts();
  runAllTests();

  //update screen dimension variables for later use
  screenWidth = width / worldDelta;
  screenHeight = height / worldDelta;
}

var instanceInitialized = false;
export function runEngine() {
  //start running the ticker (gameLoop)
  app.ticker.add((delta) => {
    //if instances not initialized, initialize them
    if (instanceInitialized == false) {
      instanceInitialized = true;
      //loop through the instances to execute their init functions
      initInstances();
      collisionsInit();
    }

    //text test end
    updateInstances(delta);

    flushCollisions(); //function that resets the collisionArray of each instance to -1
    //done after updating all instances. the next frame will have fresh collisionArray in all instances

    mainView.drawObject.clear(); //run the clear function for the drawObject of each view
    XYview.drawObject.clear();
    XZview.drawObject.clear();
    if (screenGrid == true) { draw_screen_grid(50, 50, 0x000000, 0xcccccc); }

    //draw all the instances, here the drawings from the client app would be drawn over the instances
    draw_instances();

    resetTexts();
  });

}

function draw_instances() { //works on the instance currently selected
  //generate a 3D scene frist
  TJS_render();
  /*similarity test:
  load the same mesh in both Draw3D and TJS, keep camera at [0,0,0] looking at
  z into the screen (that is [0,0,1] for Draw3D but [0,0,-1] for TJS). Place the mesh
  5 units away from the camera. When activating both renderings, and keeping camera settings the
  same (such as FOV), the mesh in both images should have the same apparent size. This will
  make sure that render size is same regardless of renderer for a single LPE app*/

  //draw 2D instances as overlay, including 2D draw calls from 3D instances
  let i = 0;
  for (i = 0; i < INSTANCES.getSize(); i += 1) {
    var current = INSTANCES.get(i);
    if (!current.isHidden() && !current.is3D) { //if not hidden and has a primitive, then draw the primtive
      if (current.getPrimitiveIndex() != -1) {
        var trans = transform_primitive(getPrimitive(current.getPrimitiveIndex()),
          current.getX(), current.getY(), current.getRot());
        draw_primitive(trans);
      }
    }
    //afer that run the draw event of this instance
    current.draw(); //run the draw function of this instance
  }
  draw_follow_grid();
}


export function getApp() {
  return app;
}
export function getWorldOrigin() {
  return [worldOriginX, worldOriginY];
}

export function getWorldDelta() {
  return worldDelta;
}

export function setWorldDelta(_worldDelta) {
  worldDelta = _worldDelta;
}

export function getScreenWidth() {
  return screenWidth;
}
export function getScreenHeight() {
  return screenHeight;
}


export function moveToScreenCoord(_p) { //change from engine's coordinate system to screen coords, coordinates are converted to pixel positions on screen
  var xx = selectedView.worldOriginX + (_p[0] * selectedView.worldDelta);
  var yy = selectedView.worldOriginY - (_p[1] * selectedView.worldDelta);
  return [xx, yy];
}

export function screenCoordtoWorldCoord(_p) { //this changes the pixel xy received by events into xy used in engine's coordinate system
  if (getWorldDelta() <= 0) console.error(`worldDelta cannot be zero`);
  var xx = (_p[0] - getWorldOrigin()[0]) / getWorldDelta();
  var yy = (getWorldOrigin()[1] - _p[1]) / getWorldDelta(); //these are simply opposites of changing worldcoord into pixels
  return [xx, yy];
}

export function timePause() {
  timeRun = false;
  console.log(`time: ${timeRun}`);
}
export function timeResume() {
  timeRun = true;
  console.log(`time: ${timeRun}`);
}
export function isTimeRunning() {
  return timeRun;
}

export function printConsole(_string) {
  if (printConsoleState == true) console.log(_string);
}
export function setPrintConsole(_state) {
  printConsoleState = _state;
}

export function setUnitTest(_state) {
  unitTestState = _state;
}

export function isUnitTest() {
  return unitTestState;
}
//this function is where you add new tests to run
function runAllTests() {
  if (isUnitTest()) {
    console.log(`Running tests...`);
    runTest(LPVectorTest);
    runTest(LPEventsTest);
    //runTest(...)
  }
}

export function set3DMode(_state) {
  ThreeDMode = _state;
}

export function is3DMode() {
  return ThreeDMode;
}

export function rgbToHex(_r, _g, _b) { //rgb value provide in 0-1 range
  return PIXI.utils.rgb2hex([_r, _g, _b]);
}
export function showScreenGrid() { screenGrid = true; }
export function hideScreenGrid() { screenGrid = false; }

//draws a line between the head of two vectors (using vectors as point input)
export function draw_line(_p1, _p2, color) {
  var p1 = moveToScreenCoord(_p1);
  var p2 = moveToScreenCoord(_p2);
  selectedView.drawObject.lineStyle(1, color, 1);
  selectedView.drawObject.moveTo(p1[0], p1[1]);
  selectedView.drawObject.lineTo(p2[0], p2[1]);
}



//TODO: the following function need to be changed into view centric
export function getSelectedView(){
  return selectedView;
}
export function setSelectedView(_view){
  selectedView = _view;
}

//takes a vector to take point input
export function draw_anchor(_p, color) { //point of array form [x,y]
  var v = moveToScreenCoord(_p);
  selectedView.drawObject.lineStyle(0);
  selectedView.drawObject.beginFill(color, 1);
  selectedView.drawObject.drawCircle(v[0], v[1], 2);
  selectedView.drawObject.endFill();
}

export function draw_circle(_p, _radius, color) { //point of array form [x,y]
  var v = moveToScreenCoord(_p);
  var r = _radius * getWorldDelta();
  selectedView.drawObject.lineStyle(1, color, 1);
  selectedView.drawObject.drawCircle(v[0], v[1], r);
  selectedView.drawObject.endFill();
}

export function draw_vector_origin(_v, _lineColor, _anchorColor) {
  var origin = [0, 0];
  draw_line(origin, _v, _lineColor);
  draw_anchor(_v, _anchorColor);
}

/*this function is used when a polygon is only required for one frame, if you want persistent polygons,
define a primitive then use the draw_primitive function*/
export function draw_polygon(_vertexList, _lineColor, _wireframe, _fillColor, _shaded) {
  var i = 0;
  var j = 0;
  var path = [];

  for (i = 0; i < _vertexList.getSize(); i += 1) {
    var vertex = _vertexList.get(i);
    var vertex2 = moveToScreenCoord(vertex);
    path[j] = vertex2[0];
    path[j + 1] = vertex2[1];
    j = j + 2;
  }

  if (_shaded == true) {
    selectedView.drawObject.lineStyle(0);
    selectedView.drawObject.beginFill(_fillColor, 1);
    selectedView.drawObject.drawPolygon(path);
    selectedView.drawObject.endFill();
  }
  if (_wireframe == true) {
    selectedView.drawObject.lineStyle(1, _lineColor, 1);
    selectedView.drawObject.drawPolygon(path);
  }
}

/*remember this function flat-out draws a primitive.
if you want a primitive to follow an instance for example,
transform the primitive to the objects position and orientation
before you draw it*/

export function draw_primitive(_primitive) {
  var lineColor = _primitive.lineColor; //not using getLineColor() because inside engine, we don't work with indices, just the object directly
  var fillColor = _primitive.fillColor;
  var wireframe = _primitive.wireframe;

  var i = 0;
  var j = 0;
  var path = [];

  for (i = 0; i < _primitive.getSize(); i += 1) {
    var vertex = _primitive.get(i);
    var vertex2 = moveToScreenCoord(vertex);
    path[j] = vertex2[0];
    path[j + 1] = vertex2[1];
    j = j + 2;
  }
  if (wireframe == true) {
    selectedView.drawObject.lineStyle(1, lineColor, 1);
    selectedView.drawObject.drawPolygon(path);
  } else {
    selectedView.drawObject.lineStyle(0);
    selectedView.drawObject.beginFill(fillColor, 1);
    selectedView.drawObject.drawPolygon(path);
    selectedView.drawObject.endFill();
  }
} // this is inside engineCore and not Primitives because it used PIXI functions. I don't want more than one file to import PIXI

//put inside the draw function of a scene
export function drawNormals(_primitive, _p, _primColor, _secColor) {
  var normals = getNormalsOfPrimitive(_primitive);
  var i = 0;
  for (i = 0; i < normals.getSize(); i += 1) {
    draw_line(_p, v1Plusv2(_p, normals.get(i)), _primColor, _secColor);
  }
}

function draw_screen_grid(_width, _height, _primColor, _secColor) {
  //draw grid lines
  //line y-axis lines
  var n = _height / 2;
  while (true) {
    draw_line([-_width / 2, n], [_width / 2, n], _secColor);
    n -= 1;
    if (n < -_height / 2) break;
  }
  //line y-axis lines
  n = -_width / 2;
  while (true) {
    draw_line([n, _height / 2], [n, -_height / 2], _secColor);
    n += 1;
    if (n > _width / 2) break;
  }

  //draw the origin
  draw_line([-_width / 2, 0], [_width / 2, 0], _primColor);
  draw_line([0, _height / 2], [0, -_height / 2], _primColor);
}


