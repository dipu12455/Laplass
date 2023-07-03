import { getApp, getWorldDelta, moveToScreenCoord, printConsole } from "./LPEngineCore.js";
import { LPList } from "./LPList.js";

export var PIXITEXTSLIST = new LPList();
var updated = [];

export function draw_text(_string, _p, _size, _color) { /*use this function only inside instance functions like init, update or draw.
The init for the BitmapFOnt only executed after runEngine()*/
    var v = moveToScreenCoord(_p); //also the origin of text in on its left, not center

    var size = _size * getWorldDelta(); //adjust to worldCoord

    let i = 0;
    var found = false;
    for (i = 0; i < PIXITEXTSLIST.getSize(); i += 1) {
        if (updated[i] == false) {
            var text = PIXITEXTSLIST.get(i);
            text.visible = true;
            text.text = _string;
            text.x = v[0];
            text.y = v[1];
            text.fontSize = size;
            text.tint = _color;
            updated[i] = true;
            found = true;
            break; //found a slot, exit the loop
        }
    }
    if (found == false) {
        updated[PIXITEXTSLIST.getSize()] = true; //put the last spot in list to true
        addText(_string, v, size, _color);
    }
}

function addText(_string, _v, _size, _color) {
    var text = new PIXI.BitmapText(_string, { fontName: "MyFont" });
    text.visible = true;
    text.x = _v[0];
    text.y = _v[1];
    text.fontSize = _size;
    text.tint = _color;
    getApp().stage.addChild(text);
    PIXITEXTSLIST.add(text);
}

export function initTexts() {
    PIXI.BitmapFont.from("MyFont", {
        fontFamily: "Courier",
        fontSize: 50,
        fill: "white"
    }); //defining a default font setting. This font ('BitmapFont') can be referred to using the MyFont name
}

export function resetTexts() {
    var i = 0;
    //this second loop is for turning all updates to false
    for (i = 0; i < PIXITEXTSLIST.getSize(); i += 1) {
        if (updated[i] == false) {//if the text object didnt receive update at all, in this frame, then turn it off
            PIXITEXTSLIST.get(i).visible = false;
        }
        if (updated[i] == true) { //here just reset texts that were updated
            updated[i] = false;
        }
    }
}