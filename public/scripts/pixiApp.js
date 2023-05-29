const app = new PIXI.Application({ width: 640, height: 480, background: '#ffffff' });
document.body.appendChild(app.view);

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

