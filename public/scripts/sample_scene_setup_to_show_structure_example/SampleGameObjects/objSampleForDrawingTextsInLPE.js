//code that demonstrates how to draw text in LPE

import * as LP from '../../LPEngine/LPEngine.js';//refactor the path as needed

export class objSampleForDrawingTextsInLPE extends LP.LPGameObject{
    constructor() {
        super();
        this.elapsed = 0;
        this.X = 0;
        this.textSize = 0.5;

        this.init = () => {
        };

        this.update = (_delta) => {
            this.elapsed += _delta;
            var animate = Math.cos(this.elapsed / 50.0);
            this.X = -7 + animate * 9;
        }

        this.draw = () => {
            LP.draw_anchor([-5, 5], 0xff0000);
            if (this.X < 0) { //to check conditional rendering of text
                LP.draw_text(`Hello World ${this.X}`, [this.X, 5], this.textSize, 0x00ff00);
            }
            LP.draw_text("This is second text", [5, 3], this.textSize, 0xff0000);
        }
    }
}