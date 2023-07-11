import * as LP from '../../LPEngine/LPEngine.js';
import { getFragmentSize, setFragmentSize, getScreenWidth, getScreenHeight, draw_fragment } from '../../LPEngine/modules/LPEngineCore.js';
import { getRandomInteger } from './functions.js';

export class objDrawObject_MPS extends LP.LPGameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.elapsed = getRandomInteger(0, 100); //this is not part of parent class, only for child class
        this.x = 0;
        this.z = 5;

        this.init = () => {
        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.rotateMyself(_delta);

        };
        this.draw = () => {
            //this is an LPE module in progress, don't use LP prefix for internal module functions
            setFragmentSize(20);
            draw_fragment(37.29, 42, 0xff0000); //fragment works on pixel coord

            //populate a line of fragments
            var noOfFragmentsX = Math.ceil(311 / getFragmentSize()); //no of fragments that will fit in the screen width
            //if a partial number of fragments, then the ceiling value will round that up. eg, if we can only fit 20.5 fragments,
            // it will simply draw 21 fragments
            LP.printConsole(`noOfFragmentsX: ${noOfFragmentsX} vs without floor ${311 / getFragmentSize()}`);
            for (var i = 0; i < noOfFragmentsX; i++) {
            }
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

