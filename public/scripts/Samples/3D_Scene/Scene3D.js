import * as EN from '../../Engine/Engine.js';
import { objPyramid } from './objPyramid.js';
import { objCameraController } from './objCameraController.js';
import { TJS_loadMesh } from '../../Engine/modules/3D/TJS_module.js';

export function runScene() {
    EN.setPrintConsole(true);

    var mesh = TJS_loadMesh('/mesh1', 0xff0000);
    var mesh2 = TJS_loadMesh('/mesh1', 0x00ff00);
    var mesh3 = TJS_loadMesh('/mesh1', 0x0000ff);

    var camObject = new objCameraController(null);
    EN.addInstance(camObject);

    var pyramid = new objPyramid(mesh);
    pyramid.x = 5;
    EN.addInstance(pyramid);

    var pyr2 = new objPyramid(mesh2);
    pyr2.x = -5;
    pyr2.y = 3;
    EN.addInstance(pyr2);

    var pyr3 = new objPyramid(mesh3);
    pyr3.x = 0;
    pyr3.y = 5;
    EN.addInstance(pyr3);
}