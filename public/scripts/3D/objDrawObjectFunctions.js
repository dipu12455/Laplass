import * as LP from '../LPEngine/LPEngine.js';
import { scalarXVector_3D, v1Plusv2_3D, v2Minusv1_3D } from './modules/LPVector3D.js';

export function checkEvents(_instance) {
    if (LP.isPEventFired(LP.evKeyW_p)) {
        var vMovingForward = scalarXVector_3D(0.1, _instance.vLookDir);
        _instance.vCamera = v1Plusv2_3D(_instance.vCamera, vMovingForward);
    }
    if (LP.isPEventFired(LP.evKeyS_p)) {
        var vMovingForward = scalarXVector_3D(0.1, _instance.vLookDir);
        _instance.vCamera = v2Minusv1_3D(vMovingForward, _instance.vCamera);
    }
    if (LP.isPEventFired(LP.evKeyA_p)) {
        _instance.yaw += 1;
    }
    if (LP.isPEventFired(LP.evKeyD_p)) {
        _instance.yaw -= 1;
    }
    if (LP.isPEventFired(LP.evArrowUp_p)) {
        _instance.vCamera[1] += 0.1;
    }
    if (LP.isPEventFired(LP.evArrowDown_p)) {
        _instance.vCamera[1] -= 0.1;
    }
}