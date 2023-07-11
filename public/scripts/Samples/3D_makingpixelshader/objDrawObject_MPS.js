import * as LP from '../../LPEngine/LPEngine.js';
import { getFragmentSize, setFragmentSize, getScreenWidth, getScreenHeight, draw_fragment, initializeDepthBuffer } from '../../LPEngine/modules/LPEngineCore.js';
import { getRandomInteger } from './functions.js';

export class objDrawObject_MPS extends LP.LPGameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.elapsed = getRandomInteger(0, 100); //this is not part of parent class, only for child class
        this.x = 0;
        this.z = 8;

        this.init = () => {
            //this is an LPE module in progress, don't use LP prefix for internal module functions
            setFragmentSize(20); //set fragment size before anything else
            initializeDepthBuffer(getScreenWidth(), getScreenHeight());
        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.rotateMyself(_delta);

        };
        this.draw = () => {
            //draw_fragment(x,y,,0x000000);
            draw_fragment(32,32,0.1,0xff00ff);
            draw_fragment(32,32,0.5,0x0000ff);

            LP.setPrintConsole(false);
        };
    }
    checkEvents() {
    }
    rotateMyself(_delta) {
        this.elapsed += _delta;
        //update theta
        var theta = this.elapsed * 0.5;
        this.rotY = theta;

    }
}

