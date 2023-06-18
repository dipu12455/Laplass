//import * as PIXI from './pixi.js';

import { getLineColor, getNormalsOfPrimitive } from './LPPrimitives.js';
import { LPVector, transformVector, v1Plusv2 } from './LPVector.js';
import { LPEventsInit } from './LPEvents.js';
import { initInstances, updateInstances } from './LPInstances.js';

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
    updateInstances(delta);

    drawObject.clear(); //clear drawing of last calls
    if (screenGrid == true) { draw_screen_grid(50, 50, 0x000000, 0xcccccc); }
    _LPDraw(); //run the draw operations defined by the client app
  });

}

export function getWorldOrigin() {
  return new LPVector(worldOriginX, worldOriginY);
}

export function getWorldDelta() {
  return worldDelta;
}

export function setWorldDelta(_worldDelta) {
  worldDelta = _worldDelta;
}

function moveToScreenCoord(_p) { //change from LP's coordinate system to screen coords, coordinates are converted to pixel positions on screen
  var xx = worldOriginX + (_p.getX() * worldDelta);
  var yy = worldOriginY - (_p.getY() * worldDelta);
  return new LPVector(xx, yy);
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

export function draw_line(x1, y1, x2, y2, color) {
  drawObject.lineStyle(1, color, 1);
  drawObject.moveTo(worldOriginX + (x1 * worldDelta), worldOriginY - (y1 * worldDelta));
  drawObject.lineTo(worldOriginX + (x2 * worldDelta), worldOriginY - (y2 * worldDelta));
}

export function draw_anchor(x, y, color) {
  drawObject.lineStyle(0);
  drawObject.beginFill(color, 1);
  drawObject.drawCircle(worldOriginX + (x * worldDelta), worldOriginY - (y * worldDelta), 2);
  drawObject.endFill();
}

//draws a line between the head of two vectors (using vectors as point input)
export function draw_lineV(_v1, _v2, color) {
  var v1 = moveToScreenCoord(_v1);
  var v2 = moveToScreenCoord(_v2);
  drawObject.lineStyle(1, color, 1);
  drawObject.moveTo(v1.getX(), v1.getY());
  drawObject.lineTo(v2.getX(), v2.getY());
}

//takes a vector to take point input
export function draw_anchorV(_v, color) {
  var v = moveToScreenCoord(_v);
  drawObject.lineStyle(0);
  drawObject.beginFill(color, 1);
  drawObject.drawCircle(v.getX(), v.getY(), 2);
  drawObject.endFill();
}

export function draw_vector_origin(_v, _lineColor, _anchorColor) {
  var origin = new LPVector(0, 0);
  draw_lineV(origin, _v, _lineColor);
  draw_anchorV(_v, _anchorColor);
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
    path[j] = vertex2.getX();
    path[j + 1] = vertex2.getY();
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
    draw_lineV(_p, v1Plusv2(_p, normals.get(i)), _primColor, _secColor);
  }
}

function draw_screen_grid(_width, _height, _primColor, _secColor) {
  //draw grid lines
  //line y-axis lines
  var n = _height / 2;
  while (true) {
    draw_line(-_width / 2, n, _width / 2, n, _secColor);
    n -= 1;
    if (n < -_height / 2) break;
  }
  //line y-axis lines
  n = -_width / 2;
  while (true) {
    draw_line(n, _height / 2, n, -_height / 2, _secColor);
    n += 1;
    if (n > _width / 2) break;
  }

  //draw the origin
  draw_line(-_width / 2, 0, _width / 2, 0, _primColor);
  draw_line(0, _height / 2, 0, -_height / 2, _primColor);
}
