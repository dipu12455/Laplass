const app = new PIXI.Application({ width: 640, height: 480, background: '#ffffff' });
document.body.appendChild(app.view);

let sprite = PIXI.Sprite.from('./images/sample.png');
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
    });

