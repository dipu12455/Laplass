import * as LP from '../../LPEngine/LPEngine.js';

/*this quad stays stationary at the center of the screen. It will have a scalable square surrounding it, which will demo the clipping in an animated way.
there will also be a single line segment (defined by a 2d normal and a point that passes through it), that can be moved around in the screen in any orientation,
and it will show another clipping demo*/

export class objStationaryPolygon extends LP.LPGameObject {
    constructor() {
        super();
        this.elapsed = 0;
        this.selected = false;
        this.primitive = new LP.Primitive(); //create a primitive object, add vertices to it in the init function later
        this.primitive.lineColor = 0x0000ff;

        this.init = () => {
            //generate an n-gon based on the number of vertices, starting from a certain radius away from the origin
            var radius = 5;
            var numberOfVertices = 6; //to be able to test with any number of vertices of a polygon, change it as needed
            var startPoint = [radius, 0]; /*think of this point as a clock hand at 0 degree position,
            it will later be rotated counterclockwise in increments of 360/noOfVertices*/
            let i = 0;
            for (i = 0; i < numberOfVertices; i += 1) {
                //rotate the point to its degree position
                var rotatedPoint = LP.rotateVector(startPoint, i * (360 / numberOfVertices));
                //add the rotated point to the primitive as a vertex
                this.primitive.add(rotatedPoint);
            }

            //make the bounding box for this primitive
            this.primitive.boundingBox.set([-radius, radius], [radius, -radius]);

            this.setPosition([-5, 0]);

            //define clip lines
            this.clipLine1 = {
                point: [5, 5],
                normal: LP.getUnitVector([-1, -1])
            }

            this.clipLine2 = {
                point: [-5, 5],
                normal: LP.getUnitVector([1, -1])
            }

            this.clipLine3 = {
                point: [-5, -5],
                normal: LP.getUnitVector([1, 1])
            }
            this.clipLine4 = {
                point: [5, -5],
                normal: LP.getUnitVector([-1, 1])
            }

        };
        this.update = (_delta) => {
            this.checkEvents();
            this.clickAndDrag();
            this.elapsed += _delta;

            var animate = Math.sin(this.elapsed / 50.0);
            //this.setRot(this.elapsed);
        };
        this.draw = () => {
            this.drawInfo();
            //get the primitive that is supposed to be in the pos and ori of this instance
            var primitive = LP.transform_primitive(this.primitive, this.getX(), this.getY(), this.getRot());

            //this primitive is checked against clipping lines, and if so updated into a clipped
            //polygon accordingly
            var listOfClipLines = [this.clipLine1, this.clipLine2, this.clipLine3, this.clipLine4];
            drawClipLines(listOfClipLines);
            /* var clip = clipPolygonWithClipLines(primitive, listOfClipLines);
            if (clip.fullClipped == false) {
                LP.draw_primitive(clip.primitive);
            } */
            LP.draw_primitive(clipPolygonWithClipLines(primitive, listOfClipLines));
        }

    }
    drawInfo() {
        LP.draw_text("Click and drag the n-gon. any point inside the clipping line will show red", [-15, 10], 0.5, 0x000000);
    }
    clickAndDrag() {
        if (this.selected == 1) {
            this.setPosition(LP.getMousePosition());
        }
    }
    checkEvents() {
        if (LP.evMouseRegion(this.primitive.boundingBox, LP.evMouseDown, this.getX(), this.getY(), this.getRot())) {
            this.selected = true;
            //the mouse down function already consumes the event
        }
        if (LP.isEventFired(LP.evMouseUp)) {
            this.selected = false;
            //dont consume this event because that way all instances will be deselected
        }
    }
}
function clipPolygonWithClipLines(_primitive, _listOfClipLines) {
    var i = 0;
    var fullClipped = false;
    var currentPrimitive = _primitive;
    for (i = 0; i < _listOfClipLines.length; i += 1) {
        var clip = clipPolygon(currentPrimitive, _listOfClipLines[i]);
        /* if (clip.clipped === `full`) {
            fullClipped = true;
            break;
        } else { */
            currentPrimitive = clip.primitive;
        //}
    }
    //return { fullClipped: fullClipped, primitive: currentPrimitive };
    return currentPrimitive;
};

//takes a primitive, and a clipping line. returns a new primitive that is clipped by the clipping line
function clipPolygon(_primitive,
    _clipLine //the normal represents the 'outside' part of the line, any point of primitive that is inside, is clipped
) {
    var returnValue = {
        clipped: `none`,
        /* clipped can be full (nothing is shown), partial (there is clipping, so use the returned primitive), or none (no clipping, function returns the same primitive)*/
        primitive: _primitive
    };

    var insidePoints = []; //stores the index of those points in the primitive that are outside the line, so when iterating through the primitive later, these points will be worked with

    //iterate through the primitive, and check if each point is outside the line
    var i = 0;
    for (i = 0; i < _primitive.getSize(); i += 1) {
        var point = _primitive.get(i);
        //draw a vector from the pointOnLine to this primitive point
        var vector = LP.v2Minusv1(_clipLine.point, point);
        //check if this vector is pointing in the same direction as the normal of the line
        var dotProduct = LP.dotProduct(vector, _clipLine.normal);
        if (dotProduct < 0) {
            //this point is inside the line
            insidePoints.push(i); //record the index of this point
        }
    }
    if (insidePoints.length == 0) {
        return {
            clipped: `none`,
            primitive: _primitive
        }
    } //if there are no points inside the line, then the primitive is not clipped at all

    if (insidePoints.length == _primitive.getSize()) {
        return {
            clipped: `full`,
            primitive: new LP.Primitive() //just an empty primitive
        }
    } //TODOif all points are inside the line, nothing should be drawn return a false

    //we are going in the anticlockwise order, to understand the order of vertices, look this.init() and see how the polygon is made
    //make a line starting from the point before this inside point, to itself
    var linepoint1 = [0, 0];
    var flipped = insidePoints[0] == 0 && insidePoints[insidePoints.length - 1] == _primitive.getSize() - 1;/*this is when the first and last points are inside the line,
    this a weird situation so we shift all the points in the list forward by one place.*/

    if (flipped) {
        var last = insidePoints[insidePoints.length - 1]; //which is the final point appearing in first place, but the list saying otherwise, we fix the ordering
        var newList = [];
        newList.push(last);
        var i = 0;
        for (i = 0; i < insidePoints.length - 1; i += 1) {
            newList.push(insidePoints[i]);
        }
        insidePoints = newList; //values are shifted one place forward
    }

    if (insidePoints[0] == 0) {
        linepoint1 = _primitive.get(_primitive.getSize() - 1);
    } else {
        linepoint1 = _primitive.get(insidePoints[0] - 1);
    }
    var linepoint2 = _primitive.get(insidePoints[0]);
    //create a line joining linepoint1 and linepoint2. Find the point of intersection between this line and the clipping line

    //draw the line points
    LP.draw_anchor(linepoint1, 0xff0000);
    LP.draw_anchor(linepoint2, 0x00ff00);
    var pointIntersection1 = findPointOfIntersectionOfTwoLines2(_clipLine.point, _clipLine.normal, linepoint1, linepoint2);
    LP.draw_anchor(pointIntersection1, 0x000000);
    LP.draw_text("I1", pointIntersection1, 0.5, 0x000000);

    //now go directly to the last inside point, find that corresponding point of intersection
    linepoint1 = _primitive.get(insidePoints[insidePoints.length - 1]); //the final index in the insidePoints array, and it is also linepoint1 this time if going in the anticlockwise order
    //now find linepoint2
    if (insidePoints[insidePoints.length - 1] == _primitive.getSize() - 1) { //if the last index in the insidePoints array if the index of the last point in the primitive, jump to vertex 1
        linepoint2 = _primitive.get(0);
    } else {
        linepoint2 = _primitive.get(insidePoints[insidePoints.length - 1] + 1); //otherwise, it will just be the last index in the insidePoints array + 1
    }
    //to recap, linepoint1 is the last insidePoint going in anticlockwise order, and linepoint2 is the point after that

    var pointIntersection2 = findPointOfIntersectionOfTwoLines2(_clipLine.point, _clipLine.normal, linepoint1, linepoint2);

    //create a new primitive to replace all insidePoints with these two points of intersection instead

    var newPrim = new LP.Primitive();
    newPrim.copyAttributes(_primitive);
    newPrim.add(pointIntersection1);
    newPrim.add(pointIntersection2);

    //now add the remaining vertices
    var size = _primitive.getSize();
    i = insidePoints[0];
    while (i < size + insidePoints[0]) {
        if (insidePoints.includes(i % size)) { //you have hit the first inside point
            i += 1;
            continue;
        }
        newPrim.add(_primitive.get(i % size));
        i += 1;
    }

    return {
        clipped: `partial`,
        primitive: newPrim
    }
}

function findPointOfIntersectionOfTwoLines2(_line1Point, _line1Normal, _line2StartPoint, _line2EndPoint) {
    var nx = _line1Normal[0]; var ny = _line1Normal[1];
    var lx = _line1Point[0]; var ly = _line1Point[1];

    var m1 = -nx / ny;
    var c1 = ly - m1 * lx;


    var x1 = _line2StartPoint[0]; var y1 = _line2StartPoint[1]; var x2 = _line2EndPoint[0]; var y2 = _line2EndPoint[1];
    var m2 = (y2 - y1) / (x2 - x1); //slope of line 2
    var c2 = y1 - m2 * x1;


    var px = (c2 - c1) / (m1 - m2);
    var py = m2 * px + c2;

    return [px, py];


}

function drawClipLines(_listOfClipLines) {
    var i = 0;
    for (i = 0; i < _listOfClipLines.length; i += 1) {
        var line = _listOfClipLines[i];
        var p1 = LP.findLeftPerpendicular(LP.scalarXvector(5, line.normal));
        var p2 = LP.flipVector(p1);
        p1 = LP.v1Plusv2(line.point, p1);
        p2 = LP.v1Plusv2(line.point, p2);
        LP.draw_line(p1, p2, 0x000000);
    }
}