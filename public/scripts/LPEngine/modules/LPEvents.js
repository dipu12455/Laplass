import { getWorldDelta, getWorldOrigin } from "./LPEngineCore.js";
import { LPVector } from "./LPVector.js";

var mouseX = 0, mouseY = 0;

//test function, takes in window object of the DOM then attaches a mousemove event listener to it.
export function LPEventsInit(_window) {
    _window.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    //registers an event listener with the window object, then passes a function to execute when event is fired.
    //the function updates these variable which the client app can access using the exported functions
}

function screenCoordtoWorldCoord(_p) { //this changes the pixel xy received by events into xy used in LP's coordinate system
    var xx = (_p.getX() - getWorldOrigin().getX())/getWorldDelta();
    var yy = (getWorldOrigin().getY() - _p.getY())/getWorldDelta() //these are simply opposites of changing worldcoord into pixels
    return new LPVector(xx, yy);
}

//the mouse coord need to be translated from pixels to worldCoord
export function getMousePosition() {
    return screenCoordtoWorldCoord(new LPVector(mouseX, mouseY));
}