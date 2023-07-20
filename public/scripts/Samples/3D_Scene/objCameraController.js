import * as EN from '../../Engine/Engine.js';

export class objCameraController extends EN.GameObject_3D {
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
        if (EN.isPEventFired(EN.evKeyW_p)) {
            var vMovingForward = EN.scalarXVector_3D(0.1, EN.getLookDir());
            EN.setCamera(EN.v1Plusv2_3D(EN.getCamera(), vMovingForward));
        }
        if (EN.isPEventFired(EN.evKeyS_p)) {
            var vMovingForward = EN.scalarXVector_3D(0.1, EN.getLookDir());
            EN.setCamera(EN.v2Minusv1_3D(vMovingForward, EN.getCamera()));
        }
        if (EN.isPEventFired(EN.evKeyA_p)) {
            EN.setCameraYaw(EN.getCameraYaw() + 1);
        }
        if (EN.isPEventFired(EN.evKeyD_p)) {
            EN.setCameraYaw(EN.getCameraYaw() - 1);
        }
        if (EN.isPEventFired(EN.evKeyR_p)){
            EN.setCamera(EN.v1Plusv2_3D(EN.getCamera(), [0, 0.1, 0]));
        }
        if (EN.isPEventFired(EN.evKeyF_p)){
            EN.setCamera(EN.v1Plusv2_3D(EN.getCamera(), [0, -0.1, 0]));
        }
    }
}

