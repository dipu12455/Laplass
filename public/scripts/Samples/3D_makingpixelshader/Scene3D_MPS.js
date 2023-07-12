import * as LP from '../../LPEngine/LPEngine.js';
import { mesh1, mesh2 } from './3DmodelResource.js';
import { objDrawObject_MPS } from './objDrawObject_MPS.js';

LP.setPrintConsole(true);

var objDO_MPS = new objDrawObject_MPS(mesh1);
objDO_MPS.x = -2;
LP.addInstance(objDO_MPS);

var objDO_MPS2 = new objDrawObject_MPS(mesh2);
objDO_MPS2.x = 2;
LP.addInstance(objDO_MPS2);