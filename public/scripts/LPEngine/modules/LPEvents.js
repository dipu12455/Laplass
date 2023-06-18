import { getWorldDelta, getWorldOrigin } from "./LPEngineCore.js";
import { LPVector } from "./LPVector.js";

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

//test function, takes in window object of the DOM then attaches a mousemove event listener to it.
export function LPEventsInit(_window) {
    _window.addEventListener('mousemove', function (event) {
        mouseX = event.clientX - 8;
        mouseY = event.clientY - 10; //the pixels were off
    });
    //registers an event listener with the window object, then passes a function to execute when event is fired.
    //the function updates these variable which the client app can access using the exported functions

    // Add the event listener for the click event
    _window.addEventListener('click', function (event) {
        //console.log('First click event listener');
        fireEvent(evMouseClick);
    });

    //mousedown event
    _window.addEventListener('mousedown', function (event) {
        //check if the left mouse button (primary button) was pressed
        if (event.button == 0) {
            console.log('Left button down');
            fireEvent(evMouseDown);
        }
    });

    _window.addEventListener('mouseup', function (event) {
        //check if the left mouse button was released
        if (event.button == 0) {
            console.log('Left mouse button released');
            fireEvent(evMouseUp);
        }
    }); //this event fires when a button is released after being pressed. it won't fire just by detection the button is released. the button needs to be pressed first, then released later for this event to fire. so the evMouseUpState var for example, will still need to be turned off after event is read, just like for evMouseClickState and evMouseClick()

    _window.addEventListener('keydown', function (event) {
        var keyCode = event.code;
        if (keyCode == 'KeyG') {
            console.log('Pressed G');
            fireEvent(evKeyG);
            firePEvent(evKeyG_p);

        }
        if (keyCode == 'KeyS') {
            console.log('Pressed S');
            fireEvent(evKeyS);
            firePEvent(evKeyS_p);
        }
        if (keyCode == 'KeyP') {
            console.log('Pressed P');
            fireEvent(evKeyP);
            firePEvent(evKeyP_p);
        }
        if (keyCode == 'KeyW') {
            console.log('Pressed W');
            fireEvent(evKeyW);
            firePEvent(evKeyW_p);
        }
        if (keyCode == 'KeyA') {
            console.log('Pressed A');
            fireEvent(evKeyA);
            firePEvent(evKeyA_p);
        }
        if (keyCode == 'KeyD') {
            console.log('Pressed D');
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
            console.log('Released G');
            turnOffPEvent(evKeyG_p);
        }
        if (keyCode == 'KeyS') {
            console.log('Released S');
            turnOffPEvent(evKeyS_p);
        }
        if (keyCode == 'KeyP') {
            console.log('Released S');
            turnOffPEvent(evKeyP_p);
        }
        if (keyCode == 'KeyW') {
            console.log('Released W');
            turnOffPEvent(evKeyW_p);
        }
        if (keyCode == 'KeyA') {
            console.log('Released A');
            turnOffPEvent(evKeyA_p);
        }
        if (keyCode == 'KeyD') {
            console.log('Released D');
            turnOffPEvent(evKeyD_p);
        }
    });
}

function screenCoordtoWorldCoord(_p) { //this changes the pixel xy received by events into xy used in LP's coordinate system
    var xx = (_p.getX() - getWorldOrigin().getX()) / getWorldDelta();
    var yy = (getWorldOrigin().getY() - _p.getY()) / getWorldDelta() //these are simply opposites of changing worldcoord into pixels
    return new LPVector(xx, yy);
}

//the mouse coord need to be translated from pixels to worldCoord
export function getMousePosition() {
    return screenCoordtoWorldCoord(new LPVector(mouseX, mouseY));
}

function fireEvent(_event) {
    eventArray[_event] = true;
}
// reads an eventstate to see if its true or false
export function isEventFired(_event) {
    return eventArray[_event];
}

export function turnOffEvent(_event) {
    eventArray[_event] = false;
}

function firePEvent(_event) {
    eventArray_p[_event] = true;
}
export function isPEventFired(_event) {
    return eventArray_p[_event];
}
function turnOffPEvent(_event) {
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
/* can't be used anymore, but preserving the code.
export function evMouseClickRegion(_boundingBox) {
    if (evMouseClick()) {
        var pos = getMousePosition(); //can't use mouseX/mouseY vars directly because boundingbox is in terms of LP coord
        return checkPointInRegion(pos,_boundingBox);
    }
} */

export function evMouseDownRegion(_boundingBox) {
    if (isEventFired(evMouseDown)) {
        var pos = getMousePosition();
        var condition = checkPointInRegion(pos, _boundingBox);
        if (condition) {
            turnOffEvent(evMouseDown);
            return true;
        }
        else {
            return false;
        }
    }
}

//returns true if the given point lies within the given bounding box
function checkPointInRegion(_p, _boundingBox) {
    var withinRegionX = (_p.getX() > _boundingBox.getP1().getX()) && (_p.getX() < _boundingBox.getP2().getX());
    var withinRegionY = (_p.getY() < _boundingBox.getP1().getY()) && (_p.getY() > _boundingBox.getP2().getY());
    return (withinRegionX && withinRegionY);
}