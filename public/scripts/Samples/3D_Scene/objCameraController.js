import * as LP from '../../LPEngine/LPEngine.js';

export class objCameraController extends LP.LPGameObject_3D {
    constructor(_mesh) {
        super(_mesh); //provide the mesh to its parent class
        this.init = () => {

        };
        this.update = (_delta) => {
            this.checkEvents(); //this is a seperated function into another file, moves the camera with WASD and Up/Down
        };
        this.draw = () => {
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
}

