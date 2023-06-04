import * as PIXI from 'pixi.js';
import {LPVector} from './LPVector.js';
import {rotateVector} from './LPVector.js';

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

export function draw_vector_origin(_v, _lineColor, _anchorColor){
  draw_line(0,0,_v.getX(),_v.getY(),_lineColor);
  draw_anchor(_v.getX(),_v.getY(),_anchorColor);
}

export function draw_primitive(_primitive,_x,_y,_rot,_color){
  var i = 0;
  for (i = 0; i < _primitive.getSize(); i += 3){

    //get the vertices
    var v1 = _primitive.get(i);
    var v2 = _primitive.get(i+1);
    var v3 = _primitive.get(i+2);

    //vertices are still at origin, rotate them here
    var v1_rot = rotateVector(v1,v1.getTheta()+_rot);
    var v2_rot = rotateVector(v2,v2.getTheta()+_rot);
    var v3_rot = rotateVector(v3,v3.getTheta()+_rot);

    //translate the rotated vertices to x and y
    draw_line(v1_rot.getX()+_x,v1_rot.getY()+_y,v2_rot.getX()+_x,v2_rot.getY()+_y,_color);
    draw_line(v2_rot.getX()+_x,v2_rot.getY()+_y,v3_rot.getX()+_x,v3_rot.getY()+_y,_color);
    draw_line(v3_rot.getX()+_x,v3_rot.getY()+_y,v1_rot.getX()+_x,v1_rot.getY()+_y,_color);
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
