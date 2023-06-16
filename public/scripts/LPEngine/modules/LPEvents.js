import { getWorldDelta, getWorldOrigin } from "./LPEngineCore.js";
import { LPVector } from "./LPVector.js";

var mouseX = 0, mouseY = 0;

var evMouseClickState = false;
//creating a var and a func each for all events, because all events need to independently toggle true and false, which allows for multiple events to fire and unfire at the same time

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
        console.log('First click event listener');
        evMouseClickState = true;
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

export function evMouseClick() {
    var temp = evMouseClickState;
    evMouseClickState = false; //switch off the event
    return temp;
}

//checks if a mouse click event occured within the provided bounding box
//takes a BoundingBox object as input
export function evMouseClickRegion(_boundingBox) {
    if (evMouseClick()) {
        var pos = getMousePosition(); //can't use mouseX/mouseY vars directly because boundingbox is in terms of LP coord
        var withinRegionX = (pos.getX() > _boundingBox.getP1().getX()) && (pos.getX() < _boundingBox.getP2().getX());
        var withinRegionY = (pos.getY() < _boundingBox.getP1().getY()) && (pos.getY() > _boundingBox.getP2().getY());
        return (withinRegionX && withinRegionY);
    }
}