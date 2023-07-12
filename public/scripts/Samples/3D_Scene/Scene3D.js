import * as LP from '../../LPEngine/LPEngine.js';
import { mesh } from './3DmodelResource.js';
import { objPyramid } from './objPyramid.js';
import { objCameraController } from './objCameraController.js';

LP.setPrintConsole(false);

var camObject = new objCameraController(null);
LP.addInstance(camObject);

var pyramid = new objPyramid(mesh);
pyramid.x = 1;
LP.addInstance(pyramid);

var pyr2 = new objPyramid(mesh);
pyr2.x = -1;
LP.addInstance(pyr2);