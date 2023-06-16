import { getWorldDelta, getWorldOrigin } from "./LPEngineCore.js";
import { LPVector } from "./LPVector.js";

var mouseX = 0, mouseY = 0;

var evMouseClickState = false;
//creating a var and a func each for all events, because all events need to independently toggle true and false, which allows for multiple events to fire and unfire at the same time
var evMouseDownState = false;
var evMouseUpState = false;

var eventArray = [];
eventArray[0] = false; //evMouseClick
eventArray[1] = false; //evMouseDown
eventArray[2] = false; //evMouseUp

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
        fireEvent(0);
    });

    //mousedown event
    _window.addEventListener('mousedown', function (event) {
        //check if the left mouse button (primary button) was pressed
        if (event.button == 0) {
            console.log('Left button down');
            fireEvent(1);
        }
    });

    _window.addEventListener('mouseup', function (event) {
        //check if the left mouse button was released
        if (event.button == 0) {
            console.log('Left mouse button released');
            fireEvent(2);
        }
    }); //this event fires when a button is released after being pressed. it won't fire just by detection the button is released. the button needs to be pressed first, then released later for this event to fire. so the evMouseUpState var for example, will still need to be turned off after event is read, just like for evMouseClickState and evMouseClick()
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

function fireEvent(_event){
    eventArray[_event] = true;
}
// reads an eventstate to see if its true or false
export function isEventFired(_event){
    return eventArray[_event];
}

export function turnOffEvent(_event){
    eventArray[_event] = false;
}
export function evMouseClick() {
    var temp = evMouseClickState;
    evMouseClickState = false; //switch off the event
    return temp;
}

export function evMouseDown() {
    var temp = evMouseDownState;
    evMouseDownState = false;
    return temp;
}

export function evMouseUp() {
    var temp = evMouseUpState;
    evMouseUpState = false;
    return temp;
}

//checks if a mouse click event occured within the provided bounding box
//takes a BoundingBox object as input
export function evMouseClickRegion(_boundingBox) {
    if (evMouseClick()) {
        var pos = getMousePosition(); //can't use mouseX/mouseY vars directly because boundingbox is in terms of LP coord
        return checkPointInRegion(pos,_boundingBox);
    }
}

export function evMouseDownRegion(_boundingBox) {
    if (isEventFired(1)) {
        var pos = getMousePosition();
        var condition = checkPointInRegion(pos,_boundingBox);
        if (condition){
            turnOffEvent(1);
            return true;
        }
        else{
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