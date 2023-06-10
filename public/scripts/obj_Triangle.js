import * as LP from './LPEngine/LPEngine.js';

export class obj_Triangle extends LP.LPObject {
    constructor(){
        super();
        this.elapsed = 0;
    }
    update(_delta) {
        this.elapsed += _delta;
        var animate = Math.cos(this.elapsed / 50.0);
        var animate2 = Math.sin(this.elapsed / 50.0);
        this.rot -= 0.3 * _delta;

        this.x = animate * 5;
        this.y = animate2 * 5;
    }
}