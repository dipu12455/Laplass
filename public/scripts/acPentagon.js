import * as LP from './LPEngine/LPEngine.js';

elapsed = 0;

export function update(_delta, _instanceIndex) {
        this.elapsed += _delta;
        var animate = Math.cos(this.elapsed / 50.0);
        var animate2 = Math.sin(this.elapsed / 50.0);
        this.rot += 0.3 * _delta;

        this.x = animate * 5;
        this.y = 0;
    }
