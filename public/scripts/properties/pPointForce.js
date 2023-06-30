import * as LP from '../LPEngine/LPEngine.js';

var init = () => {
    LP.makeVar(0);//(0)forcex = 0
    LP.makeVar(0); //(1)forcey = 0
    LP.makeVar(0); //(2)selected = 0
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
        LP.setPosition(LP.getMousePosition()[0], LP.getMousePosition()[1]);
    }
}

export var pPointForce = LP.addProperty(init, update, draw);
