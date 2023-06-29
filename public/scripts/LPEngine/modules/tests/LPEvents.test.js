import { TEST, areAlmostEqualBoolean, areAlmostEqualScalar, areAlmostEqualVector, nameTheTest } from "../LPTest.js";

var testFunctionsArray = [];

var name = "LPEvents";





/* testFunctionsArray[0] = () => {
    nameTheTest(`dotProduct`);

    printTest(areAlmostEqualScalar(dotProduct([1, 2], [3, 4]), 11));
    printTest(areAlmostEqualScalar(dotProduct([-3, 1], [-7, -22]), -1));
    printTest(areAlmostEqualScalar(dotProduct([4, 7], [10000, 0.779]), 40005.453));
    printTest(areAlmostEqualScalar(dotProduct([999, -999], [723, 421]), 301698));
    //printtest for [1/2,3/7] and [0,0] for 0
    printTest(areAlmostEqualScalar(dotProduct([1 / 2, 3 / 7], [0, 0]), 0));
} */
export var LPEventsTest = new TEST();
LPEventsTest.setName(name);
LPEventsTest.setTestFunctionsArray(testFunctionsArray);