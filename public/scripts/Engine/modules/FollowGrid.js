import { XYview, XZview, draw_anchor, draw_line, getScreenHeight, getScreenWidth, getSelectedView, mainView, printConsole, rgbToHex, setPrintConsole, setSelectedView } from "./EngineCore.js";
import { INSTANCES, getFollowedInstance_3D } from "./Instances.js";
import { draw_text } from "./Texts.js";
import { getUnitVector, scalarXvector, v1Plusv2} from "./Vector.js";

//drawing the follow grid, animated scale for 3D objects being followed
var gWidth = 0;
var gHeight = 0

var gridInitialized = false;
var xxPrev = 0;
var yyPrev = 0;
var zzPrev = 0;

class GridLine {
    constructor(_origin, _directionVector, _length, _increment, _posPrev, _textOffset) {
        this.origin = _origin;
        this.directionVector = getUnitVector(_directionVector); //this is 2 tuple array vector [x, y]
        this.length = _length;
        this.increment = _increment;
        this.gridLines = [];
        for (var i = -(this.length / 2) - this.increment; i < (this.length / 2) + this.increment; i += this.increment) {
            this.gridLines.push(i);
        }
        this.gridTexts = [];
        for (var i = -(this.length / 2) - this.increment; i < (this.length / 2) + this.increment; i += this.increment) {
            this.gridTexts.push(_posPrev + i);
        }
        this.textOffset = _textOffset; //this var is an offset for correctly displaying the grid labels on various directions
    }
    update(_pos, _posPrev) {
        for (var i = 0; i < this.gridLines.length; i++) {
            this.gridLines[i] -= _pos - _posPrev; //it needs to decrement because the scale animtes opposite to the object motion. the scale is stuck with the 'world'. an object moves forwards, but its 'world' moves backwards
            if (this.gridLines[i] > (this.length / 2) + this.increment) {
                this.gridLines[i] -= this.length + (this.increment * 2);
                this.gridTexts[i] -= this.length + (this.increment * 2);
            }
            if (this.gridLines[i] < -(this.length / 2) - this.increment) {
                this.gridLines[i] += this.length + (this.increment * 2);
                this.gridTexts[i] += this.length + (this.increment * 2);
            }
        }
    }
    drawScale() {
        //draw the axis
        draw_line(v1Plusv2(this.origin, scalarXvector(-this.length / 2, this.directionVector)),
            v1Plusv2(this.origin, scalarXvector(this.length / 2, this.directionVector)), 0x000000);
        //draw_anchor(this.origin, 0xff0000); //just to mark where the origin is

        //draw the gridLines along this axis
        for (var i = 0; i < this.gridLines.length; i++) {
            var point = v1Plusv2(this.origin, scalarXvector(this.gridLines[i], this.directionVector));
            var lineLeftPoint = getUnitVector([-this.directionVector[1], this.directionVector[0]]);
            var lineLength = 0.15;
            var subLineLength = 0.5 * lineLength;
            draw_line(v1Plusv2(point, scalarXvector(-lineLength, lineLeftPoint)),
                v1Plusv2(point, scalarXvector(lineLength, lineLeftPoint)),
                0x000000);

            var subPoint = v1Plusv2(point, scalarXvector(this.increment / 2, this.directionVector));
            draw_line(v1Plusv2(subPoint, scalarXvector(-subLineLength, lineLeftPoint)),
                v1Plusv2(subPoint, scalarXvector(subLineLength, lineLeftPoint)),
                0x000000);
            var textPoint = v1Plusv2(point, this.textOffset);
            draw_text(`${Math.floor(this.gridTexts[i])}`, textPoint, 0.5, 0x000000);
        }
    }
    drawGrid(_length) { //repurposing above's function to simply extend the lines to form a grid
        var gridColor = 0xcccccc;
        //draw the gridLines along this axis
        for (var i = 0; i < this.gridLines.length; i++) {
            var point = v1Plusv2([0, 0], scalarXvector(this.gridLines[i], this.directionVector));
            //the point var always originates from the worldOrigin which needs to be the center of the screen
            //make sure the coord system of the screen you are drawing this on, has origin at center of the screen
            var lineLeftPoint = getUnitVector([-this.directionVector[1], this.directionVector[0]]);
            draw_line(v1Plusv2(point, scalarXvector(-_length / 2, lineLeftPoint)),
                v1Plusv2(point, scalarXvector(_length / 2, lineLeftPoint)),
                gridColor);

            var subPoint = v1Plusv2(point, scalarXvector(this.increment / 2, this.directionVector));
            draw_line(v1Plusv2(subPoint, scalarXvector(-_length / 2, lineLeftPoint)),
                v1Plusv2(subPoint, scalarXvector(_length / 2, lineLeftPoint)),
                gridColor);
        }
    }
}

var gridLineX = null;
var gridLineY = null;
var gridLineZ = null;

export function draw_follow_grid() {
    //the initialization part
    if (gridInitialized == false && getFollowedInstance_3D() != null) {
        gridInitialized = true;
        gWidth = getSelectedView().width / getSelectedView().worldDelta;
        gHeight = getSelectedView().height / getSelectedView().worldDelta;
        //draw grid lines, first position them on the number line where they need to be in their start state
        //we draw one gridline in each unit of the number line
        xxPrev = getFollowedInstance_3D().x;
        gridLineX = new GridLine([0, -(gHeight / 2) + 0.7], [1, 0], gWidth, 2, xxPrev, [-0.2, -0.1]);
        //END GRID LINE X

        //START GRID LINE Y
        //draw the Y grid lines, y grid lines drawn first because a masking box with be drawn over a portion of it, then the X gridline laid over that
        yyPrev = getFollowedInstance_3D().y;
        gridLineY = new GridLine([-(gWidth / 2) + 0.3, 0], [0, 1], gHeight, 2, yyPrev, [0.2, 0.3]);
        //END GRID LINE Y

        //START GRID LINE Z
        //draw the z grid lines
        zzPrev = getFollowedInstance_3D().z;
        gridLineZ = new GridLine([gWidth / 2 - 1.1, 0], [0, 1], gHeight, 2, zzPrev, [0.2, 0.3]);
        //END GRID LINE Z
    }

    //the update part
    if (getFollowedInstance_3D() != null) {
        //move the gridline and the gridtext with the delta x of the object
        var xx = getFollowedInstance_3D().x;
        gridLineX.update(xx, xxPrev);
        xxPrev = xx;

        //update the gridLine Y
        var yy = getFollowedInstance_3D().y;
        gridLineY.update(yy, yyPrev);
        yyPrev = yy;

        //update the gridLine Z
        var zz = getFollowedInstance_3D().z;
        gridLineZ.update(zz, zzPrev);
        zzPrev = zz;
    }
    if (getFollowedInstance_3D === null) gridInitialized = false;

    //draw the grid here.
    /*the mainView will render scales that are animated,
    and the XY and XZ views will render grids to display the object's velocity in that axis*/
    if (getFollowedInstance_3D() != null) {
        setSelectedView(mainView);
        draw_text(`X: ${getFollowedInstance_3D().x}`, [-14, 11], 0.5, 0x000000);
        draw_text(`Y: ${getFollowedInstance_3D().y}`, [-14, 10], 0.5, 0x000000);
        draw_text(`Z: ${getFollowedInstance_3D().z}`, [-14, 9], 0.5, 0x000000);

        //draw scale after grid, so it looks better
        gridLineX.drawScale();
        gridLineY.drawScale();
        gridLineZ.drawScale();

        /*draw the XY grid in the XYview
        also draw an anchor point to represent the followed object*/
        setSelectedView(XYview);
        var w = getSelectedView().width;
        var h = getSelectedView().height;
        var wD = getSelectedView().worldDelta;
        gridLineX.drawGrid(h / wD); //the grid is drawn perpendicularly to its axis, so the length provided seems opposite
        gridLineY.drawGrid(w / wD);
        draw_anchor([0, 0], 0xff0000); //this the anchor to represent the object being followed
        //draw lines to represent origin
        var XYorigin = [-getFollowedInstance_3D().x, -getFollowedInstance_3D().y];
        draw_line([-w / 2, XYorigin[1]], [w / 2, XYorigin[1]], 0x000000);
        draw_line([XYorigin[0], -h / 2], [XYorigin[0], h / 2], 0x000000);
        //draw other 3D objects in this view
        for (var i = 0; i < INSTANCES.getSize(); i++) {
            var current = INSTANCES.get(i);
            if (current === getFollowedInstance_3D()) continue; //dont draw the followed object
            if (!current.is3D) continue; //only draw 3D objects
            if (current.isCamera) continue; //dont draw the camera
            var pos = [current.x - getFollowedInstance_3D().x, current.y - getFollowedInstance_3D().y];
            var color = current.color;
            draw_anchor(pos, rgbToHex(color[0], color[1], color[2]));
        }


        /*draw the XZ grid in the XZview,
        also draw an anchor point to represent the followed object*/
        setSelectedView(XZview);
        w = getSelectedView().width;
        h = getSelectedView().height;
        wD = getSelectedView().worldDelta;
        gridLineX.drawGrid(h / wD);
        gridLineZ.drawGrid(w / wD);
        draw_anchor([0, 0], 0xff0000); //this the anchor to represent the object being followed
        //draw lines to represent origin
        var XZorigin = [-getFollowedInstance_3D().x, -getFollowedInstance_3D().z];
        draw_line([-w / 2, XZorigin[1]], [w / 2, XZorigin[1]], 0x000000);
        draw_line([XZorigin[0], -h / 2], [XZorigin[0], h / 2], 0x000000);
        //draw other 3D objects in this view
        for (var i = 0; i < INSTANCES.getSize(); i++) {
            var current = INSTANCES.get(i);
            if (current === getFollowedInstance_3D()) continue; //dont draw the followed object
            if (!current.is3D) continue; //only draw 3D objects
            if (current.isCamera) continue; //dont draw the camera
            var pos = [current.x - getFollowedInstance_3D().x, current.z - getFollowedInstance_3D().z];
            var color = current.color;
            draw_anchor(pos, rgbToHex(color[0], color[1], color[2]));
        }

        //return view selection to mainView
        setSelectedView(mainView);
    }
}