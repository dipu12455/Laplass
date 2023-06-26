import { isUnitTest } from "../LPEngineCore.js";
import { degtorad, getMag, getTheta, radtodeg } from "../LPVector.js";

export function runTest() {
    //execute the test functions, the test functions need to have similar name to original function, for readability
    getTheta_test();
    radtodeg_test();
    degtorad_test();
    getMag_test();
    rotateVector_test();

}
var name = "LPVector";
function nameTheTest(_nameOfFunctionBeingTested) {
    console.log(`${name} ${_nameOfFunctionBeingTested}():`);
}
function printTest(_obtained, _actual) {
    console.log(`Obtained: ${_obtained} Actual: ${_actual}`);
    if (areAlmostEqual(_obtained,_actual,0.1)) {
        console.log(`Passed.`)
    }else{
        console.error(`Failed.`);
    }
}
function areAlmostEqual(_a, _b, _tolerance) {
    return Math.abs(_a - _b) <= _tolerance;
}

function getTheta_test() {
    nameTheTest(`getTheta`);

    printTest(getTheta([2, 2]), 45);
    printTest(getTheta([-2, 2]), 135);
    printTest(getTheta([-2, -2]), -134.999);
    printTest(getTheta([0, 0]), 0);
}

function radtodeg_test() {
    nameTheTest(`radtodeg`);

    printTest(radtodeg(1), 57.29577);
    printTest(radtodeg(0.5), 28.64788975);
    printTest(radtodeg(2.5), 143.23944);
    printTest(radtodeg(-1), -57.29577);
    printTest(radtodeg(-0.5), -28.647889);
    printTest(radtodeg(-2.5), -143.239448);
    printTest(radtodeg(0), 0);
}

function degtorad_test() {
    nameTheTest(`degtorad`);

    printTest(degtorad(90), 1.5707963);
    printTest(degtorad(45), 0.78539816);
    printTest(degtorad(180), 3.141592653);
    printTest(degtorad(-90), -1.5707963);
    printTest(degtorad(-45), -0.785398);
    printTest(degtorad(-180), -3.141592);
    printTest(degtorad(0), 0);

}

function getMag_test() {
    nameTheTest(`getMag`);

    printTest(getMag([3, 4]), 5);
    printTest(getMag([1, 2]), 2.2360679);
    printTest(getMag([5, 12]), 13);

    printTest(getMag([-3, -4]), 5);
    printTest(getMag([-1, -2]), 2.2360679);
    printTest(getMag([-5, -12]), 13);

    printTest(getMag([0, 0]), 0);

}

function rotateVector_test(){
    nameTheTest(`rotateVector`);


}