import { screenCoordtoWorldCoord } from "../LPEvents.js";
import { TEST, areAlmostEqualBoolean, areAlmostEqualScalar, areAlmostEqualVector, nameTheTest, printTest } from "../LPTest.js";

var testFunctionsArray = [];

var name = "LPEvents";

//if unitTesting is switched on in LPEngine, the LPEvents module prints out its own console logs when events are fired through JS
//also events need to be fired manually to be tested
//regular functions can still be tested here
 
export var LPEventsTest = new TEST();
LPEventsTest.setName(name);
LPEventsTest.setTestFunctionsArray(testFunctionsArray);