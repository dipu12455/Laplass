import * as LP from '../LPEngine/LPEngine.js';

export class objSpaceship extends LP.LPInstance{
    constructor() {
        super();
        this.elapsed = 0;
        this.init = () => {
        };

        this.update = (_delta) => {
            this.elapsed += _delta;
            var animate = Math.cos(this.elapsed / 50);

            this.newSetX(animate*7);
            LP.printConsole(`x: ${this.x} y: ${this.y}`);
        };

        this.draw = () => {
            LP.draw_anchor([this.x, this.y], 0xff0000);
            LP.draw_text(`(${Math.floor(this.x)} ${Math.floor(this.y)}`,[this.x, this.y-0.2], 0.5, 0x000000);
        }
    }
}