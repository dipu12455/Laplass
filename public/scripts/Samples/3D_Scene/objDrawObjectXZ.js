import * as EN from '../../Engine/Engine.js';
import { getRandomInteger } from "./functions.js";

export class objDrawObjectXZ extends EN.GameObject {
    constructor() {
        super();
        this.elapsed = 0;
        this.init = () => {
            this.elapsed = getRandomInteger(0, 100); //this is not part of parent class, only for child class
        };
        this.update = (_delta) => {
            this.elapsed += _delta;
            this.animate = Math.cos(this.elapsed / 50.0);
        };
        this.draw = () => {
            //to draw certain operations into a different view, select that view. then do your drawing, and finally unselect all view
            EN.selectXZview();
            EN.draw_anchor([this.animate, this.animate], 0x00ff00); //just to show regardless 2D or 3D, all draw functions work just fine
            EN.unselectAllView();

            EN.selectXYview();
            EN.draw_anchor([this.animate, 0], 0x0000ff); //just to show regardless 2D or 3D, all draw functions work just fine
            EN.unselectAllView();
        };
    }
}