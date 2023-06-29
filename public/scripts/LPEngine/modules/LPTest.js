export class TEST{
    constructor(){
        this.name = "";
        this.testFunctionsArray = [];
    }
    setName(_name){
        this.name = _name;
    }
    setTestFunctionsArray(_testFunctionsArray){
        this.testFunctionsArray = _testFunctionsArray;
    }
}


export function nameTheTest(_nameOfFunctionBeingTested) {
    console.log(`${_nameOfFunctionBeingTested}():`);
}

export function printTest(_areAlmostEqual) {
    if (_areAlmostEqual) {
        console.log(`Passed.`)
    } else {
        console.error(`Failed.`);
    }
}
export var areAlmostEqualScalar = (_a, _b) => {
    console.log(`obtained: ${_a} actual: ${_b}`);
    return Math.abs(_a - _b) <= 0.1;
}

export var areAlmostEqualVector = (_a, _b) => {
    console.log(`obtained: ${_a} actual: ${_b}`);
    let condition1 = Math.abs(_a[0] - _b[0]) <= 0.1;
    let condition2 = Math.abs(_a[1] - _b[1]) <= 0.1;
    return condition1 && condition2;
}

export var areAlmostEqualBoolean = (_a, _b) => {
    console.log(`obtained: ${_a} actual: ${_b}`);
    return _a == _b;
}

export function runTest(_test) {
    //execute the test functions, the test functions need to have similar name to original function, for readability
    let i = 0;
    console.log(`Running tests for ${_test.name}:`);
    for (i = 0; i < _test.testFunctionsArray.length; i++) {
        _test.testFunctionsArray[i]();
    }

}


