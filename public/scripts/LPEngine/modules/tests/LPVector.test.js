import { degtorad, dotProduct, findAverage, findLeftPerpendicular, getMag, getTheta, getUnitVector, getVectorRTHeta, isVectorWithinRange, radtodeg, rotateVector, scalarXvector, sqr, sumOfSqr, transformVector, v1Plusv2, v2Minusv1 } from "../LPVector.js";
import { TEST, printTest, areAlmostEqualBoolean, areAlmostEqualScalar, areAlmostEqualVector, nameTheTest } from "../LPTest.js";



var name = "LPVector";

var testFunctionsArray = [];

testFunctionsArray[0] = () => {
    nameTheTest(`dotProduct`);

    printTest(areAlmostEqualScalar(dotProduct([1, 2], [3, 4]), 11));
    printTest(areAlmostEqualScalar(dotProduct([-3, 1], [-7, -22]), -1));
    printTest(areAlmostEqualScalar(dotProduct([4, 7], [10000, 0.779]), 40005.453));
    printTest(areAlmostEqualScalar(dotProduct([999, -999], [723, 421]), 301698));
    printTest(areAlmostEqualScalar(dotProduct([1 / 2, 3 / 7], [0, 0]), 0));
}

testFunctionsArray[1] = () => {
    nameTheTest(`scalarXvector`);

    printTest(areAlmostEqualVector(scalarXvector(3, [-7, 2]), [-21, 6]));
    printTest(areAlmostEqualVector(scalarXvector(-100000, [27, 3 / 5]), [-2700000, -60000]));
    printTest(areAlmostEqualVector(scalarXvector(0, [3 / 4, -(1 / 99)]), [0, 0]));
}

testFunctionsArray[2] = () => {
    nameTheTest(`v2Minusv1`);
    printTest(areAlmostEqualVector(v2Minusv1([3, 5], [7, 8]), [4, 3]));
}

testFunctionsArray[3] = () => {
    nameTheTest(`v1Plusv2`);
    printTest(areAlmostEqualVector(v1Plusv2([3, 5], [7, 8]), [10, 13]));
}

testFunctionsArray[4] = () => {
    nameTheTest(`findLeftPerpendicular`);
    printTest(areAlmostEqualVector(findLeftPerpendicular([3, 5]), [-5, 3]));
    printTest(areAlmostEqualVector(findLeftPerpendicular([0, 0]), [0, 0]));
    printTest(areAlmostEqualVector(findLeftPerpendicular([1, 0]), [0, 1]));
    printTest(areAlmostEqualVector(findLeftPerpendicular([0, 1]), [-1, 0]));
}

testFunctionsArray[5] = () => {
    nameTheTest(`findAverage`);
    printTest(areAlmostEqualVector(findAverage([3, 5], [7, 8]), [5, 6.5]));
    printTest(areAlmostEqualVector(findAverage([0, 0], [0, 0]), [0, 0]));
    printTest(areAlmostEqualVector(findAverage([1, 0], [0, 1]), [0.5, 0.5]));
    printTest(areAlmostEqualVector(findAverage([3 / 7, -(4 / 13)], [7 / 21, Math.PI / 32]), [0.38095, -0.10475]));
}
testFunctionsArray[6] = () => {
    nameTheTest(`radtodeg`);

    printTest(areAlmostEqualScalar(radtodeg(1), 57.29577));
    printTest(areAlmostEqualScalar(radtodeg(0.5), 28.64788975));
    printTest(areAlmostEqualScalar(radtodeg(2.5), 143.23944));
    printTest(areAlmostEqualScalar(radtodeg(-1), -57.29577));
    printTest(areAlmostEqualScalar(radtodeg(-0.5), -28.647889));
    printTest(areAlmostEqualScalar(radtodeg(-2.5), -143.239448));
    printTest(areAlmostEqualScalar(radtodeg(0), 0));

}

testFunctionsArray[7] = () => {
    nameTheTest(`degtorad`);

    printTest(areAlmostEqualScalar(degtorad(90), 1.5707963));
    printTest(areAlmostEqualScalar(degtorad(45), 0.78539816));
    printTest(areAlmostEqualScalar(degtorad(180), 3.141592653));
    printTest(areAlmostEqualScalar(degtorad(-90), -1.5707963));
    printTest(areAlmostEqualScalar(degtorad(-45), -0.785398));
    printTest(areAlmostEqualScalar(degtorad(-180), -3.141592));
    printTest(areAlmostEqualScalar(degtorad(0), 0));

}

testFunctionsArray[8] = () => {
    nameTheTest(`sqr`);
    printTest(areAlmostEqualScalar(sqr(3), 9));
    printTest(areAlmostEqualScalar(sqr(0), 0));
    printTest(areAlmostEqualScalar(sqr(-3), 9));
}

testFunctionsArray[9] = () => {
    nameTheTest(`sumOfSqr`);
    printTest(areAlmostEqualScalar(sumOfSqr(3, 4), 25));
    printTest(areAlmostEqualScalar(sumOfSqr(0, 0), 0));
    printTest(areAlmostEqualScalar(sumOfSqr(-3, -4), 25));
}

testFunctionsArray[10] = () => {
    nameTheTest(`getTheta`);

    printTest(areAlmostEqualScalar(getTheta([2, 2]), 45));
    printTest(areAlmostEqualScalar(getTheta([-2, 2]), 135));
    printTest(areAlmostEqualScalar(getTheta([-2, -2]), -134.999));
    printTest(areAlmostEqualScalar(getTheta([0, 0]), 0));
}

testFunctionsArray[11] = () => {
    nameTheTest(`getMag`);

    printTest(areAlmostEqualScalar(getMag([3, 4]), 5));
    printTest(areAlmostEqualScalar(getMag([1, 2]), 2.2360679));
    printTest(areAlmostEqualScalar(getMag([5, 12]), 13));

    printTest(areAlmostEqualScalar(getMag([-3, -4]), 5));
    printTest(areAlmostEqualScalar(getMag([-1, -2]), 2.2360679));
    printTest(areAlmostEqualScalar(getMag([-5, -12]), 13));

    printTest(areAlmostEqualScalar(getMag([0, 0]), 0));

}

testFunctionsArray[12] = () => {
    nameTheTest(`getVectorRTheta`);

    printTest(areAlmostEqualVector(getVectorRTHeta(3, 30), [2.598, 1.5]));
    printTest(areAlmostEqualVector(getVectorRTHeta(-92, 49), [-60.3566, -69.4332]));
    printTest(areAlmostEqualVector(getVectorRTHeta(3, -33), [2.51601, -1.63389]));
    printTest(areAlmostEqualVector(getVectorRTHeta(3, 290), [1.026, -2.819]));
}

testFunctionsArray[13] = () => {
    nameTheTest(`isVectorWithinRange`);

    printTest(areAlmostEqualBoolean(isVectorWithinRange([3,4],5,10),true));
    printTest(areAlmostEqualBoolean(isVectorWithinRange([-9,47],-9,13),false));
    printTest(areAlmostEqualBoolean(isVectorWithinRange([0,0],0,0),true));
}

testFunctionsArray[14] = () => {
    nameTheTest(`rotateVector`);

    printTest(areAlmostEqualVector(rotateVector([1,0],90),[0,1]));
    printTest(areAlmostEqualVector(rotateVector([1,0],180),[-1,0]));
    printTest(areAlmostEqualVector(rotateVector([1,0],270),[0,-1]));
    printTest(areAlmostEqualVector(rotateVector([1,0],360),[1,0]));
    printTest(areAlmostEqualVector(rotateVector([1,0],450),[0,1]));
}

testFunctionsArray[15] = () => {
    nameTheTest(`getUnitVector`);

    printTest(areAlmostEqualVector(getUnitVector([-3,5]),[-0.514496,0.857493]));
    printTest(areAlmostEqualVector(getUnitVector([0,0]),[0,0]));
    printTest(areAlmostEqualVector(
        getUnitVector([Math.PI/Math.sqrt(371), Math.sin(320)/Math.atan(Math.PI)]),
        [0.433456, -0.9011744]));
}

testFunctionsArray[16] = () => {
    nameTheTest(`transformVector`);

    printTest(areAlmostEqualVector(transformVector([1,0],-3,-5,90),[-3,-4]));
    printTest(areAlmostEqualVector(
        transformVector([Math.PI/Math.sqrt(371), Math.sin(320)/Math.atan(Math.PI)],-3,-5,-32),
        [-2.68609390347,-5.20749382626]));
}

export var LPVectorTest = new TEST();
LPVectorTest.setName(name);
LPVectorTest.setTestFunctionsArray(testFunctionsArray);

