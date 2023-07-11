import * as LP from '../../LPEngine/LPEngine.js';
import { mesh } from './3DmodelResource.js';
import { objPyramid } from './objPyramid.js';
import { objCameraController } from './objCameraController.js';

LP.setPrintConsole(false);

var camObject = new objCameraController(null);
LP.addInstance(camObject);

var pyramid = new objPyramid(mesh);
LP.addInstance(pyramid);

var pyr2 = new objPyramid(mesh);
LP.addInstance(pyr2);