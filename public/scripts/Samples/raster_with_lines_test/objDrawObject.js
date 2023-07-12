import { draw_fragment, draw_line_PIXI, fragmentSize } from "../../LPEngine/modules/LPEngineCore.js";
import * as LP from "../../LPEngine/LPEngine.js";


export class objDrawObject extends LP.LPGameObject {
    constructor() {
        super();
        this.elapsed = 0;
        this.init = () => {
        };

        this.update = (_delta) => {
            this.elapsed += _delta;
        };
        this.draw = () => {
            LP.draw_text(`elapsed: ${this.elapsed}`, [-15, -11], 0.7, 0x000000);

            var noOfPixelsX = 600;
            var noOfPixelsY = 350;

            for (var j = 0; j < noOfPixelsY; j += 1) {
                for (var i = 0; i < noOfPixelsX; i += 1) {
                    var R = getRandomNumber(0, 255);
                    R = R / 255;
                    var G = getRandomNumber(0, 255);
                    G = G / 255;
                    var B = getRandomNumber(0, 255);
                    B = B / 255;
                    draw_line_PIXI(32 + i, 32 + j, LP.rgbToHex(R, G, B));
                }
            }
            LP.setPrintConsole(false);

        };
    }
    drawWithRect() {
        var noOfFragmentsX = Math.ceil(600 / fragmentSize);
        var noOfFragmentsY = Math.ceil(350 / fragmentSize);
        for (var j = 0; j < noOfFragmentsY; j += 1) {
            for (var i = 0; i < noOfFragmentsX; i += 1) {
                var R = getRandomNumber(0, 255);
                R = R / 255;
                var G = getRandomNumber(0, 255);
                G = G / 255;
                var B = getRandomNumber(0, 255);
                B = B / 255;
                //LP.printConsole("R: " + R + " G: " + G + " B: " + B);
                draw_fragment(32 + (i * fragmentSize), 80 + (j * fragmentSize), LP.rgbToHex(R, G, B));
            }
        }
    }
}

export function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

