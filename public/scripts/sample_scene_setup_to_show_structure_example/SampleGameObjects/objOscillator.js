//makes an instance oscillate using the sine and cosine functions

import * as LP from '../LPEngine/LPEngine.js'; //refactor the path as needed

export class objOscillator extends LP.LPGameObject {
    constructor() {
        super();
        this.elapsed = 0;
        this.init = () => {
        };

        this.update = (_delta) => {
            this.elapsed += _delta;
            var animate = Math.cos(this.elapsed / 50.0);
            var animate2 = Math.sin(this.elapsed / 50.0);
            var animateSlower = Math.cos(this.elapsed / 100.0);

            this.setRot(this.getRot() + 1.4 * _delta);
            this.setX(-5);
            this.setY(0);
        };

        this.draw = () => {
        }
    }
}