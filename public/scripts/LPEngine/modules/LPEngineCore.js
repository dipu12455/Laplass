//import * as PIXI from './pixi.js';

import { getNormalsOfPrimitive, getPrimitive, transform_primitive } from './LPPrimitives.js';
import { v1Plusv2 } from './LPVector.js';
import { LPEventsInit } from './LPEvents.js';
import { INSTANCES, flushCollisions, getPrimitiveIndex, getRot, getX, getY, initInstances, isHidden, selectInstance, unSelectAll, updateInstances } from './LPInstances.js';
import { getCollisions } from './LPCollision.js';

// these variables need to be referenced from all functions
var app;
var drawObject;

var worldOriginX, worldOriginY, worldDelta;
var screenGrid = false;
var timeRun = true;
var printConsoleState = false;

var LPDraw; //variable to hold the user coded draw function

//this function needs to be called before initialize(). This sets up the update operations that need to occur in each iteration of the game loop


export function runEngine(_window, _width, _height, _LPDraw) {
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

  //start running the ticker (gameLoop)
  app.ticker.add((delta) => {
    getCollisions();
    
    updateInstances(delta);

    flushCollisions(); //function that resets the collisionArray of each instance to -1
    //done after updating all instances. the next frame will have fresh collisionArray in all instances

    drawObject.clear(); //clear drawing of last calls
    if (screenGrid == true) { draw_screen_grid(50, 50, 0x000000, 0xcccccc); }

    //draw all the instances, here the drawings from the client app would be drawn over the instances
    draw_instances();

    _LPDraw(); //run the draw operations defined by the client app
  });

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

function moveToScreenCoord(_p) { //change from LP's coordinate system to screen coords, coordinates are converted to pixel positions on screen
  var xx = worldOriginX + (_p[0] * worldDelta);
  var yy = worldOriginY - (_p[1] * worldDelta);
  return [xx, yy];
}

export function runTicker() {

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

export function printConsole() {
  printConsoleState = true;
}
export function turnOffPrintConsole() {
  printConsoleState = false;
}
export function isPrintConsole() {
  return printConsoleState;
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
  drawObject.drawCircle(_p[0], _p[1], 2);
  drawObject.endFill();
}

export function draw_vector_origin(_v, _lineColor, _anchorColor) {
  var origin = [0, 0];
  draw_line(origin, _v, _lineColor);
  draw_anchor(_v, _anchorColor);
}

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
    selectInstance(i);
    if (!isHidden()) {
      var trans = transform_primitive(getPrimitive(getPrimitiveIndex()),
        getX(), getY(), getRot());
      draw_primitive(trans);
    }
    unSelectAll();
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
