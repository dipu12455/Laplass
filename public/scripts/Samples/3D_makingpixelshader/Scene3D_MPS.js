import * as LP from '../../LPEngine/LPEngine.js';
import { mesh } from './3DmodelResource.js';
import { objDrawObject_MPS } from './objDrawObject_MPS.js';

LP.setPrintConsole(true);

var objDO_MPS = new objDrawObject_MPS(mesh);
LP.addInstance(objDO_MPS);