import * as EN from '../../Engine/Engine.js';
import { objPyramid } from './objPyramid.js';
import { objCameraController } from './objCameraController.js';
import { objDrawObjectXZ } from './objDrawObjectXZ.js';

export function runScene() {
    EN.setPrintConsole(true);

    var mesh = EN.TJS_loadMesh('/mesh1', 0xff0000);
    var mesh2 = EN.TJS_loadMesh('/mesh1', 0x00ff00);
    var mesh3 = EN.TJS_loadMesh('/mesh1', 0x0000ff);

    var camObject = new objCameraController(null);
    EN.addInstance(camObject);

    var pyramid = new objPyramid(mesh);
    pyramid.x = 5;
    pyramid.y = 1;
    EN.setFollowedInstance_3D(pyramid);
    pyramid.selected = true;
    EN.addInstance(pyramid);

    var pyr2 = new objPyramid(mesh2);
    pyr2.x = -5;
    pyr2.y = 1;
    EN.addInstance(pyr2);

    var pyr3 = new objPyramid(mesh3);
    pyr3.x = 0;
    pyr3.y = 1;
    pyr3.z = 0;
    EN.addInstance(pyr3);

    var drawObjectXZ = new objDrawObjectXZ();
    EN.addInstance(drawObjectXZ);
}