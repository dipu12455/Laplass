import { isUnitTest } from './LPEngineCore.js';
import * as LPVectorTest from './tests/LPVector.test.js';

export function runAllTests(){
    if (isUnitTest()){
        console.log(`Running tests...`);
        LPVectorTest.runTest();
    }
    

}