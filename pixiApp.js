// this file is supposed to have implementation for pixijs inside its functions
// the functions of this file is exported to index.js
// index.js isn't supposed to show pixijs implementations

import * as PIXI from 'pixi.js';

export function runGraphics(_document){
  const app = new PIXI.Application({ width: 640, height: 480, background: '#ffffff' });

  _document.body.appendChild(app.view);

  let sprite = PIXI.Sprite.from('./images/apple.png');
  sprite.anchor.set(0.5);
  sprite.x = 320;
  sprite.y = 240;

  app.stage.addChild(sprite);

  // Add a ticker callback to move the sprite back and forth
  let elapsed = 0.0;
  app.ticker.add((delta) => {
    sprite.rotation -= 0.01 * delta;
  });
}
