import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.makeVar(0);//(0)forcex = 0
    LP.makeVar(0); //(1)forcey = 0
    LP.makeVar(0); //(2)selected = 0
    LP.makeVar(0); //(3)mouseXPrev = 0;
    LP.makeVar(0); //(4)mouseYPrev = 0;
};

var update = (_delta) => {
    checkEvents();

    whenSelected();
   
};

var draw = () => {
}

function checkEvents(){
    if (LP.evMouseRegion(LP.getBoundingBox(LP.getPrimitiveIndex()),LP.evMouseDown)){
        LP.setVal(2, 1);
        //the mouse down function already consumes the event
    }
    if (LP.isEventFired(LP.evMouseUp)){
        LP.setVal(2, 0);
        //dont consume this event because that way all instances will be deselected
    }
}

function whenSelected(){
    if (LP.getVal(2) == 1){
        var mouseXPrev = LP.getVal(3); var mouseYPrev = LP.getVal(4);
        var mouseXcurrent = LP.getMousePosition()[0];
        var mouseYcurrent = LP.getMousePosition()[1];
        LP.setHSpeed(mouseXcurrent-mouseXPrev);
        LP.setVSpeed(mouseYcurrent-mouseYPrev);
        mouseXPrev = mouseXcurrent;
        mouseYPrev = mouseYcurrent;

        LP.setVal(3, mouseXPrev);
        LP.setVal(4, mouseYPrev);
    }else{
        LP.setVal(3, LP.getMousePosition()[0]);
        LP.setVal(4, LP.getMousePosition()[1]);
    }
}

export var pPointForce = LP.addProperty(init, update, draw);
