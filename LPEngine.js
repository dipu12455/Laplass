// this file is supposed to have implementation for pixijs inside its functions
// the functions of this file is exported to index.js
// index.js isn't supposed to show pixijs implementations

import * as PIXI from 'pixi.js';

// these variables need to be referenced from all functions
var app;
var graphics;
var sprite; 

export function init(_document){
  app = new PIXI.Application({ width: 640, height: 480, background: '#ffffff' });
  _document.body.appendChild(app.view);

  //create a global graphics object to compile drawing functions into
  graphics = new PIXI.Graphics();
}

export function spriteInit(){
  sprite = PIXI.Sprite.from('./images/apple.png');
  sprite.anchor.set(0.5);
  sprite.x = 320;
  sprite.y = 240;
}

export function runTicker(){
  // Add a ticker callback to move the sprite back and forth
  let elapsed = 0.0;
  app.ticker.add((delta) => {
    sprite.rotation -= 0.01 * delta;
  });
}

export function renderAll(){
  app.stage.addChild(sprite);
  app.stage.addChild(graphics);
}

export function lp_draw_line(x1,y1,x2,y2,color){
  graphics.lineStyle(1, color, 1);
  graphics.moveTo(x1, y1);
  graphics.lineTo(x2,y2);
}



