import * as LP from '../LPEngine/LPEngine.js';

export class objDrawObject_2DACTIQ extends LP.LPGameObject {
    constructor() {
        super();
        this.elapsed = 0;


        this.init = () => {


        };
        this.update = (_delta) => {
            this.elapsed += _delta;
            var animate = Math.sin(this.elapsed / 50.0);
            this.setX(animate*2);
        };
        this.draw = () => {
            LP.draw_anchor(this.getPosition(),0xff0000);

        };
    }
}
