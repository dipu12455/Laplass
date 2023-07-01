import { checkPointInsidePrimitive, primFromBoundingBox } from "./LPCollision.js";
import { getWorldDelta, getWorldOrigin, isUnitTest, setPrintConsole} from "./LPEngineCore.js";
import { getRot, getX, getY } from "./LPInstances.js";
import { transform_primitive } from "./LPPrimitives.js";

var mouseX = 0, mouseY = 0;

//event codes
export const evMouseClick = 0;
export const evMouseDown = 1;
export const evMouseUp = 2;
export const evKeyG = 3;
export const evKeyS = 4;
export const evKeyP = 5;
export const evKeyW = 6;
export const evKeyA = 7;
export const evKeyD = 8;

var eventArray = [];
eventArray[evMouseClick] = false; //evMouseClick
eventArray[evMouseDown] = false; //evMouseDown
eventArray[evMouseUp] = false; //evMouseUp
eventArray[evKeyG] = false; //KeyG non-sensitive to capital
eventArray[evKeyS] = false; //KeyS non-sensitive to capital
eventArray[evKeyP] = false; //KeyP non-sensitive to capital
eventArray[evKeyW] = false; //KeyG non-sensitive to capital
eventArray[evKeyA] = false; //KeyS non-sensitive to capital
eventArray[evKeyD] = false; //KeyP non-sensitive to capital

//persistent event codes
export const evKeyG_p = 0;
export const evKeyS_p = 1;
export const evKeyP_p = 2;
export const evKeyW_p = 3;
export const evKeyA_p = 4;
export const evKeyD_p = 5;

var eventArray_p = [];
eventArray_p[evKeyG_p] = false;
eventArray_p[evKeyS_p] = false;
eventArray_p[evKeyP_p] = false;
eventArray_p[evKeyW_p] = false;
eventArray_p[evKeyA_p] = false;
eventArray_p[evKeyD_p] = false;

//all functions in this module are exported for testing purposes, and for usage inside the LPE.
//the functions that are not allowed to be used by the client app are not included in LPEngine.js

//unit testing is a little different for this module at this time
//the events need to be triggered by the user, and then if unitTesting is switched on in LPEngine, this module will just print to console
//the regular functions towards the end can still be tested as normal in LPEvents.test.js

//test function, takes in window object of the DOM then attaches a mousemove event listener to it.
export function LPEventsInit(_window) {
    _window.addEventListener('mousemove', function (event) {
        mouseX = event.clientX - 8;
        mouseY = event.clientY - 10; //the pixels were off
        if (isUnitTest()) console.log(`JS: Mouse position: ${mouseX}, ${mouseY}`);
    });
    //registers an event listener with the window object, then passes a function to execute when event is fired.
    //the function updates these variable which the client app can access using the exported functions

    // Add the event listener for the click event
    _window.addEventListener('click', function (event) {
        if (isUnitTest()) console.log(`JS: Mouse click`);
        fireEvent(evMouseClick);
    });

    //mousedown event
    _window.addEventListener('mousedown', function (event) {
        //check if the left mouse button (primary button) was pressed
        if (isUnitTest()) console.log(`JS: Mouse down`);
        if (event.button == 0) {
            fireEvent(evMouseDown);
        }
    });

    _window.addEventListener('mouseup', function (event) {
        //check if the left mouse button was released
        if (isUnitTest()) console.log(`JS: Mouse up`);
        if (event.button == 0) {
            fireEvent(evMouseUp);
        }
    }); //this event fires when a button is released after being pressed. it won't fire just by detection the button is released. the button needs to be pressed first, then released later for this event to fire. so the evMouseUpState var for example, will still need to be turned off after event is read, just like for evMouseClickState and evMouseClick()

    _window.addEventListener('keydown', function (event) {
        var keyCode = event.code;
        if (keyCode == 'KeyG') {
            if (isUnitTest()) console.log(`JS: Keydown KeyG`);
            fireEvent(evKeyG);
            firePEvent(evKeyG_p);
            //setPrintConsole(false);
        }
        if (keyCode == 'KeyS') {
            if (isUnitTest()) console.log(`JS: Keydown KeyS`);
            fireEvent(evKeyS);
            firePEvent(evKeyS_p);
        }
        if (keyCode == 'KeyP') {
            if (isUnitTest()) console.log(`JS: Keydown KeyP`);
            fireEvent(evKeyP);
            firePEvent(evKeyP_p);
            //setPrintConsole(true);
        }
        if (keyCode == 'KeyW') {
            if (isUnitTest()) console.log(`JS: Keydown KeyW`);
            fireEvent(evKeyW);
            firePEvent(evKeyW_p);
        }
        if (keyCode == 'KeyA') {
            if (isUnitTest()) console.log(`JS: Keydown KeyA`);
            fireEvent(evKeyA);
            firePEvent(evKeyA_p);
        }
        if (keyCode == 'KeyD') {
            if (isUnitTest()) console.log(`JS: Keydown KeyD`);
            fireEvent(evKeyD);
            firePEvent(evKeyD_p);
        }
    });
    /*keyboard events are different. If you want to move a player when the key is pressed,
    the event needs to stay fired (true) until the key is released. THat's when the keyup
    event becomes in charge of turning off the event.
    But if you want a single click keypress function, then don't put a keyup event for it,
    and instead turnoff the event in the place where it gets consumed.*/

    _window.addEventListener('keyup', function (event) {
        var keyCode = event.code;
        if (keyCode == 'KeyG') {
            if (isUnitTest()) console.log(`JS: Keyup KeyG`);
            turnOffPEvent(evKeyG_p);
        }
        if (keyCode == 'KeyS') {
            if (isUnitTest()) console.log(`JS: Keyup KeyS`);
            turnOffPEvent(evKeyS_p);
        }
        if (keyCode == 'KeyP') {
            if (isUnitTest()) console.log(`JS: Keyup KeyP`);
            turnOffPEvent(evKeyP_p);
        }
        if (keyCode == 'KeyW') {
            if (isUnitTest()) console.log(`JS: Keyup KeyW`);
            turnOffPEvent(evKeyW_p);
        }
        if (keyCode == 'KeyA') {
            if (isUnitTest()) console.log(`JS: Keyup KeyA`);
            turnOffPEvent(evKeyA_p);
        }
        if (keyCode == 'KeyD') {
            if (isUnitTest()) console.log(`JS: Keyup KeyD`);
            turnOffPEvent(evKeyD_p);
        }
    });
}

export function screenCoordtoWorldCoord(_p) { //this changes the pixel xy received by events into xy used in LP's coordinate system
    if (getWorldDelta() <= 0) console.error(`worldDelta cannot be zero`);
    var xx = (_p[0] - getWorldOrigin()[0]) / getWorldDelta();
    var yy = (getWorldOrigin()[1] - _p[1]) / getWorldDelta(); //these are simply opposites of changing worldcoord into pixels
    return [xx, yy];
}

//the mouse coord need to be translated from pixels to worldCoord
export function getMousePosition() {
    return screenCoordtoWorldCoord([mouseX, mouseY]);
}

export function fireEvent(_event) {
    eventArray[_event] = true;
}
// reads an eventstate to see if its true or false
export function isEventFired(_event) {
    return eventArray[_event];
}

export function turnOffEvent(_event) {
    eventArray[_event] = false;
}

export function firePEvent(_event) {
    eventArray_p[_event] = true;
}
export function isPEventFired(_event) {
    return eventArray_p[_event];
}
export function turnOffPEvent(_event) {
    eventArray_p[_event] = false;
}

//turn off all events, usually done at the end of the instances update loop.
//If none of the instances in the list consumed the event, then turn off the events.
export function turnOffEvents() {
    let i = 0;
    for (i = 0; i < eventArray.length; i += 1) {
        eventArray[i] = false;
    }
}

//checks if a mouse click event occured within the provided bounding box
//takes a BoundingBox object as input
/* export function evMouseClickRegion(_boundingBox) {
    if (isEventFired(evMouseClick)) {
        var pos = getMousePosition(); //can't use mouseX/mouseY vars directly because boundingbox is in terms of LP coord
        var primbbox = transform_primitive(primFromBoundingBox(_boundingBox), getX(), getY(), getRot());
        var condition = checkPointInsidePrimitive(pos,primbbox);
        if (condition){
            turnOffEvent(evMouseClick); //consume the event
            return true;
        }
        else{
            return false;
        }
    }
} */

//use with evMouseClick or evMouseDown
export function evMouseRegion(_boundingBox, _event){
    function isWithinRegion(_boundingBox){
        var pos = getMousePosition();
        var primbbox = transform_primitive(primFromBoundingBox(_boundingBox), getX(), getY(), getRot());
        var condition = checkPointInsidePrimitive(pos,primbbox);
        return condition;
    }
    if (isEventFired(_event)){
        if (isWithinRegion(_boundingBox)){
            turnOffEvent(_event);
            return true;
        }
        else{
            return false;
        }
    }
}