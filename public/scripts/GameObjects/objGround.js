import * as LP from '../LPEngine/LPEngine.js';

export class objGround extends LP.LPGameObject{
    constructor() {
        super();
        this.init = () => {
            this.setPosition(0,-11);
        };
        this.update = (_delta) => {
        };
        this.draw = () => {
        };
    }
}