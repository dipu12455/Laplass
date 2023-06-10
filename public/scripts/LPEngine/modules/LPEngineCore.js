//import * as PIXI from './pixi.js';

import { Primitive } from './LPList.js';
import {LPVector, transformVector} from './LPVector.js';

// these variables need to be referenced from all functions
var app;
var drawObject;
var drawOperations; //variable to hold the user coded draw function
var worldOriginX, worldOriginY, worldDelta;
var screenGrid=false;
var updateOperations;

export function init(_document, _width, _height){
  worldOriginX = _width/2;
  worldOriginY = _height/2;
  worldDelta = 20; //one unit means 20 pixels. so (-5,2) means (-100,40) pixels
  app = new PIXI.Application({ width: _width, height: _height, background: '#ffffff' });
  _document.body.appendChild(app.view);

  drawObject = new PIXI.Graphics();
  app.stage.addChild(drawObject);
}

export function getWorldDelta(){
  return worldDelta;
}

export function setWorldDelta(_worldDelta){
  worldDelta = _worldDelta;
}

function moveToWorldCoord(_p){
  var xx = worldOriginX+(_p.getX()*worldDelta);
  var yy = worldOriginY-(_p.getY()*worldDelta);
  return new LPVector(xx,yy);
}

export function getTicker(){
  return app.ticker;
}
export function defineDrawOperations(_drawOperations){
  drawOperations = _drawOperations;
}

export function showScreenGrid(){screenGrid=true;}
export function hideScreenGrid(){screenGrid=false;}

export function draw(){
  drawObject.clear(); //clear drawing of last calls
  if(screenGrid==true){draw_screen_grid(50,50,0x000000,0xcccccc);}
  drawOperations(); //user defined draw functions called in order, only call draw functions of LP.
}

export function draw_line(x1,y1,x2,y2,color){
  drawObject.lineStyle(1, color, 1);
  drawObject.moveTo(worldOriginX+(x1*worldDelta), worldOriginY-(y1*worldDelta));
  drawObject.lineTo(worldOriginX+(x2*worldDelta),worldOriginY-(y2*worldDelta));
}

export function draw_anchor(x,y,color){
  drawObject.lineStyle(0);
  drawObject.beginFill(color,1);
  drawObject.drawCircle(worldOriginX+(x*worldDelta),worldOriginY-(y*worldDelta),2);
  drawObject.endFill();
}

//draws a line between the head of two vectors (using vectors as point input)
export function draw_lineV(_v1,_v2,color){
  var v1 = moveToWorldCoord(_v1);
  var v2 = moveToWorldCoord(_v2);
  drawObject.lineStyle(1, color, 1);
  drawObject.moveTo(v1.getX(), v1.getY());
  drawObject.lineTo(v2.getX(),v2.getY());
}

//takes a vector to take point input
export function draw_anchorV(_v,color){
  var v = moveToWorldCoord(_v);
  drawObject.lineStyle(0);
  drawObject.beginFill(color,1);
  drawObject.drawCircle(v.getX(),v.getY(),2);
  drawObject.endFill();
}

export function draw_vector_origin(_v, _lineColor, _anchorColor){
  var origin = new LPVector(0,0);
  draw_lineV(origin, _v,_lineColor);
  draw_anchorV(_v,_anchorColor);
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

export function draw_primitive(_primitive,_lineColor,_fillColor, _wireframe){
  var i = 0;
  var j = 0;
  var path = [];

  for (i = 0; i < _primitive.getSize(); i += 1){
    var vertex = _primitive.get(i);
    var vertex2 = moveToWorldCoord(vertex);
    path[j]=vertex2.getX();
    path[j+1] = vertex2.getY();
    j = j + 2;
  }
  if (_wireframe == true) {
    drawObject.lineStyle(1,_lineColor,1);
    drawObject.drawPolygon(path);
  }else{
    drawObject.lineStyle(0);
    drawObject.beginFill(_fillColor,1);
    drawObject.drawPolygon(path);
    drawObject.endFill();
  }
}

function draw_screen_grid(_width, _height, _primColor, _secColor){
  //draw grid lines
  //line y-axis lines
  var n = _height/2;
  while(true){
    draw_line(-_width/2,n,_width/2,n,_secColor);
    n -= 1;
    if (n < -_height/2) break;
  }
  //line y-axis lines
  n = -_width/2;
  while(true){
    draw_line(n,_height/2,n,-_height/2,_secColor);
    n += 1;
    if (n > _width/2) break;
  }

  //draw the origin
  draw_line(-_width/2,0,_width/2,0,_primColor);
  draw_line(0,_height/2,0,-_height/2,_primColor);
}
