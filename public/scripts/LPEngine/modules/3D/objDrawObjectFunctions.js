import * as LP from '../../LPEngine.js';
import { getCamera, getCameraYaw, getLookDir, setCamera, setCameraYaw } from './LPDraw3D.js';
import { scalarXVector_3D, v1Plusv2_3D, v2Minusv1_3D } from './LPVector3D.js';

export function checkEvents(_instance) {
    if (LP.isPEventFired(LP.evKeyW_p)) {
        var vMovingForward = scalarXVector_3D(0.1, getLookDir());
        setCamera(v1Plusv2_3D(getCamera(), vMovingForward));
    }
    if (LP.isPEventFired(LP.evKeyS_p)) {
        var vMovingForward = scalarXVector_3D(0.1, getLookDir());
        setCamera(v2Minusv1_3D(getCamera(), vMovingForward));
    }
    if (LP.isPEventFired(LP.evKeyA_p)) {
        setCameraYaw(getCameraYaw() + 1);
    }
    if (LP.isPEventFired(LP.evKeyD_p)) {
        setCameraYaw(getCameraYaw() - 1);
    }
    if (LP.isPEventFired(LP.evArrowUp_p)) {
        _instance.Y += 0.1;
    }
    if (LP.isPEventFired(LP.evArrowDown_p)) {
        _instance.Y -= 0.1;
    } //raise the triangle up and down
    if (LP.isPEventFired(LP.evArrowLeft_p)) {
        _instance.rot += 1;
    }
    if (LP.isPEventFired(LP.evArrowRight_p)) {
        _instance.rot -= 1;
    }
    if (LP.isPEventFired(LP.evKeyQ_p)) {
        _instance.rotY += 1;
    }
    if (LP.isPEventFired(LP.evKeyE_p)) {
        _instance.rotY -= 1;
    }
}