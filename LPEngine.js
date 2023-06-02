// this file is supposed to have implementation for pixijs inside its functions
// the functions of this file is exported to index.js
// index.js isn't supposed to show pixijs implementations

import * as PIXI from 'pixi.js';

// these variables need to be referenced from all functions
var app;
var drawObject;
var drawOperations; //variable to hold the user coded draw function
var worldOriginX, worldOriginY, worldDelta;
var animate = 10; //animating this variable for testing

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


export function update(){
  //update
}
export function setDrawOperations(_drawOperations){
  drawOperations = _drawOperations;
}


function draw(){
  drawObject.clear(); //clear drawing of last calls
  draw_line(0,0,1*animate,1.5*animate);
  drawOperations(); //user defined draw functions called in order, only call draw functions of LP.
}

export function runTicker(){
  // Add a ticker callback to move the sprite back and forth
  let elapsed = 0.0;
  app.ticker.add((delta) => {
    //sprite.rotation -= 0.01 * delta;
    animate -= 0.01 * delta;
    draw();
  });
}

export function draw_line(x1,y1,x2,y2,color){
  drawObject.lineStyle(1, color, 1);
  drawObject.moveTo(worldOriginX+(x1*worldDelta), worldOriginY-(y1*worldDelta));
  drawObject.lineTo(worldOriginX+(x2*worldDelta),worldOriginY-(y2*worldDelta));
}

export function draw_screen_grid(_width, _height, _primColor, _secColor){
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



