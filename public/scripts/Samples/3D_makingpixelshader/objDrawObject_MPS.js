import * as LP from '../../LPEngine/LPEngine.js';
import { getFragmentSize, setFragmentSize, getScreenWidth, getScreenHeight, draw_fragment, initializeDepthBuffer } from '../../LPEngine/modules/LPEngineCore.js';
import { getRandomInteger } from './functions.js';

export class objDrawObject_MPS extends LP.LPGameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.elapsed = getRandomInteger(0, 100); //this is not part of parent class, only for child class
        this.x = 0;
        this.z = 3;

        this.init = () => {
            
        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
            this.rotateMyself(_delta);

        };
        this.draw = () => {
            LP.setPrintConsole(false);
        };
    }
    checkEvents() {
        if (LP.isPEventFired(LP.evKeyW_p)) {
            var vMovingForward = LP.scalarXVector_3D(0.1, LP.getLookDir());
            LP.setCamera(LP.v1Plusv2_3D(LP.getCamera(), vMovingForward));
        }
        if (LP.isPEventFired(LP.evKeyS_p)) {
            var vMovingForward = LP.scalarXVector_3D(0.1, LP.getLookDir());
            LP.setCamera(LP.v2Minusv1_3D(LP.getCamera(), vMovingForward));
        }
        if (LP.isPEventFired(LP.evKeyA_p)) {
            LP.setCameraYaw(LP.getCameraYaw() + 1);
        }
        if (LP.isPEventFired(LP.evKeyD_p)) {
            LP.setCameraYaw(LP.getCameraYaw() - 1);
        }
    }
    rotateMyself(_delta) {
        this.elapsed += _delta;
        //update theta
        var theta = this.elapsed * 0.5;
        this.rotY = theta;

    }
}

