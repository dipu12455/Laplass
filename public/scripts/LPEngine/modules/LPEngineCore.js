//import * as PIXI from './pixi.js';

import { getNormalsOfPrimitive, getPrimitive, transform_primitive } from './LPPrimitives.js';
import { v1Plusv2 } from './LPVector.js';
import { LPEventsInit } from './LPEvents.js';
import { INSTANCES, flushCollisions, initInstances, updateInstances, updateWorldMatrixForInstance } from './LPInstances.js';
import { collisionsInit } from './LPCollision.js';
import { LPVectorTest } from './tests/LPVector.test.js';
import { LPEventsTest } from './tests/LPEvents.test.js';
import { runTest } from './LPTest.js';
import { initTexts, resetTexts } from './LPTexts.js';
import { updateCamera } from './3D/LPDraw3D.js';
import { drawMesh } from './3D/LPModels3D.js';

// these variables need to be referenced from all functions
var app;
var drawObject;

var screenWidth, screenHeight;
var worldOriginX, worldOriginY, worldDelta;
var screenGrid = false;
var timeRun = true;
var printConsoleState = false;
var unitTestState = false;

var ThreeDMode = false;

//this function needs to be called before initialize(). This sets up the update operations that need to occur in each iteration of the game loop


export function runEngine(_window, _width, _height, _LPDraw) {
  screenWidth = _width;
  screenHeight = _height;
  worldOriginX = _width / 2;
  worldOriginY = _height / 2;
  worldDelta = 20; //one unit means 20 pixels. so (-5,2) means (-100,40) pixels
  app = new PIXI.Application({ width: _width, height: _height, background: '#ffffff' });
  _window.document.body.appendChild(app.view); //usually you would only work with document object, but LP needs the window object for event actions, so we are just taking in the whole window object.

  LPEventsInit(_window);

  drawObject = new PIXI.Graphics();
  app.stage.addChild(drawObject);

  //loop through the instances to execute their init functions
  initInstances();
  initTexts();
  collisionsInit();
  //run test if toggled
  runAllTests();
  //start running the ticker (gameLoop)
  app.ticker.add((delta) => {
    //text test end
    updateInstances(delta);

    flushCollisions(); //function that resets the collisionArray of each instance to -1
    //done after updating all instances. the next frame will have fresh collisionArray in all instances

    if (ThreeDMode) {
      updateCamera(); //update camera before any mesh drawing function
    }
    drawObject.clear();
    if (screenGrid == true) { draw_screen_grid(50, 50, 0x000000, 0xcccccc); }

    //draw all the instances, here the drawings from the client app would be drawn over the instances
    draw_instances();

    resetTexts();

  });

}
/* getting the screen width, height or any of the world delta values, needs to be done inside the instance's
init, update or draw functions. In any other place, the value will appear as undefined because the engine will
not have initialized yet*/
export function getScreenWidth() {
  return screenWidth;
}
export function getScreenHeight() {
  return screenHeight;
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

export function moveToScreenCoord(_p) { //change from LP's coordinate system to screen coords, coordinates are converted to pixel positions on screen
  var xx = worldOriginX + (_p[0] * worldDelta);
  var yy = worldOriginY - (_p[1] * worldDelta);
  return [xx, yy];
}

export function screenCoordtoWorldCoord(_p) { //this changes the pixel xy received by events into xy used in LP's coordinate system
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

export function rgbToHex(_r, _g, _b) { //rgb value provide in 0-1 range
  return PIXI.utils.rgb2hex([_r, _g, _b]);
}
export function showScreenGrid() { screenGrid = true; }
export function hideScreenGrid() { screenGrid = false; }

//draws a line between the head of two vectors (using vectors as point input)
export function draw_line(_p1, _p2, color) {
  var p1 = moveToScreenCoord(_p1);
  var p2 = moveToScreenCoord(_p2);
  drawObject.lineStyle(1, color, 1);
  drawObject.moveTo(p1[0], p1[1]);
  drawObject.lineTo(p2[0], p2[1]);
}

//takes a vector to take point input
export function draw_anchor(_p, color) { //point of array form [x,y]
  var v = moveToScreenCoord(_p);
  drawObject.lineStyle(0);
  drawObject.beginFill(color, 1);
  drawObject.drawCircle(v[0], v[1], 2);
  drawObject.endFill();
}

export function draw_circle(_p, _radius, color) { //point of array form [x,y]
  var v = moveToScreenCoord(_p);
  var r = _radius * getWorldDelta();
  drawObject.lineStyle(1, color, 1);
  drawObject.drawCircle(v[0], v[1], r);
  drawObject.endFill();
}

export function draw_rectangle(_x, _y, _width, _height, _lineColor, _fillColor, _filled) {
  var p = moveToScreenCoord([_x, _y]);
  var w = _width * getWorldDelta();
  var h = _height * getWorldDelta();

  if (_filled) {
    drawObject.beginFill(_fillColor);
    drawObject.lineStyle(1, _lineColor);
    drawObject.drawRect(p[0] - w / 2, p[1] - h / 2, w, h); //keep its origin in its center
    drawObject.endFill();
  } else {
    drawObject.lineStyle(1, _lineColor);
    drawObject.drawRect(p[0] - w / 2, p[1] - h / 2, w, h); //keep its origin in its center
  }
}

/*fragment shader coordinates and its screen dimensions need to work directly on the pixel of the screen,
it can't follow LPE coordinate system. Later when changing worldDelta for zooming purposes, we don't want
that changing the fragment grid. So hierarchically speaking, location of this fragment shader module will be 
below LPE and above PIXIjs, the boundary where the transition from PIXIjs to LPE is taking place.
fragment shader takes drawing calls for drawing a certain pixel directly onto the screen.*/

export var fragmentSize = 20;
export function setFragmentSize(_size) { fragmentSize = _size; }
export function getFragmentSize() { return fragmentSize; }

/*the following function is meant for fragment shader, its coords skips LPE coord and works directly onto the screen.
this function will later be moved into the fragment shader module.*/
/*the x and y need to be changed into grid inputs. the slot that is drawn will be the  closest one in the grid to the given x and y.
if you provide (draw a fragment in 32px by 41px), it will find the fragment slot at 20th by 40th, and fill that fragment*/
export function draw_fragment(_x, _y, _color) {
  //find the fragment that encloses the given point
  var fragX = Math.floor(_x / fragmentSize);
  var fragY = Math.floor(_y / fragmentSize);

  drawObject.beginFill(_color);
  drawObject.lineStyle(0);
  //multiply the fragment position by its size in pixels, to determine its position on the screen in terms of pixels
  drawObject.drawRect(fragX*fragmentSize, fragY*fragmentSize, fragmentSize, fragmentSize); //keep its origin in its center
  drawObject.endFill();
}

export var depthBuffer = [];
/* the number of columns of a depth buffer is same as the number of fragments that will fit in the screen width
based on their size. the number rows of the depth buffer is same as the number of fragments that will fit in the 
screen height*/
export function initializeDepthBuffer(_screenWidth, _screenHeight) {
  /*creates a 2D slot of the correct size, fills its value with 1. 1 means the farthest from the screen. 0 means closest possible
  distance from the screen*/

  let thisArray = [];
  var noOfFragmentsX = Math.ceil(_screenWidth / fragmentSize);
  var noOfFragmentsY = Math.ceil(_screenHeight / fragmentSize);

  for (let i = 0; i < noOfFragmentsY; i++) {
    thisArray[i] = []; // Initialize each row as an empty array

    for (let j = 0; j < noOfFragmentsX; j++) {
      thisArray[i][j] = 1; // Set initial value for each element in the row
    }
  }
  depthBuffer = thisArray;
}
export function setDepthValue(_x, _y, _value) {
  depthBuffer[_y][_x] = _value;
}
export function getDepthValue(_x, _y) {
  return depthBuffer[_y][_x];
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
    drawObject.lineStyle(0);
    drawObject.beginFill(_fillColor, 1);
    drawObject.drawPolygon(path);
    drawObject.endFill();
  }
  if (_wireframe == true) {
    drawObject.lineStyle(1, _lineColor, 1);
    drawObject.drawPolygon(path);
  }
}

/*remember this function flat-out draws a primitive.
if you want a primitive to follow an instance for example,
transform the primitive to the objects position and orientation
before you draw it*/

export function draw_primitive(_primitive) {
  var lineColor = _primitive.lineColor; //not using getLineColor() because inside LPE, we don't work with indices, just the object directly
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
    drawObject.lineStyle(1, lineColor, 1);
    drawObject.drawPolygon(path);
  } else {
    drawObject.lineStyle(0);
    drawObject.beginFill(fillColor, 1);
    drawObject.drawPolygon(path);
    drawObject.endFill();
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

function draw_instances() { //works on the instance currently selected
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

    //if instance is 3D, then draw the 3D primitive
    if (!current.isHidden() && current.is3D) {
      /*this can work in draw function because it doesn't need delta, 
      also it is technically a draw function*/
      updateWorldMatrixForInstance(current);
      //draws mesh projected 2D onto the screen, the world matrix tells where to position this mesh in 3D space
      drawMesh(current.mesh, current.matWorld);

    }

    //afer that run the draw event of this instance
    current.draw(); //run the draw function of this instance
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
