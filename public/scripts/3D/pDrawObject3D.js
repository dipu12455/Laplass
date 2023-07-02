import * as LP from '../LPEngine/LPEngine.js';

// the vectors will be of form [x,y,z], represented as arrays

class Triangle {
    constructor(_vertices) { //the vertices is an array of vectors, and each vector is an array of three tuples [x,y,z]
        this.v1 = _vertices[0];
        this.v2 = _vertices[1];
        this.v3 = _vertices[2];
    }
}

class Mesh {
    constructor(_triangles) { //the input is an array of the instance of the class Triangle
        this.triangles = _triangles;
    }
}

//now we are describing the mesh of a cube
var triangleArray = [
    //south face
    new Triangle([[0, 0, 0], [0, 1, 0], [1, 1, 0]]),
    new Triangle([[0, 0, 0], [1, 1, 0], [1, 0, 0]]),

    //east face
    new Triangle([[1, 0, 0], [1, 1, 0], [1, 1, 1]]),
    new Triangle([[1, 0, 0], [1, 1, 1], [1, 0, 1]]),

    //north face
    new Triangle([[1, 0, 1], [1, 1, 1], [0, 1, 1]]),
    new Triangle([[1, 0, 1], [0, 1, 1], [0, 0, 1]]),

    //west face
    new Triangle([[0, 0, 1], [0, 1, 1], [0, 1, 0]]),
    new Triangle([[0, 0, 1], [0, 1, 0], [0, 0, 0]]),

    //top face
    new Triangle([[0, 1, 0], [0, 1, 1], [1, 1, 1]]),
    new Triangle([[0, 1, 0], [1, 1, 1], [1, 1, 0]]),

    //bottom face
    new Triangle([[1, 0, 1], [0, 0, 1], [0, 0, 0]]),
    new Triangle([[1, 0, 1], [0, 0, 0], [1, 0, 0]])];

var cube = new Mesh(triangleArray);
var something = 0;
//get the aspect ratio of the screen
var screenWidth = 640;
var screenHeight = 480;
var aspectRatio = screenHeight / screenWidth;
var fieldOfView = something;
var zFar = something;
var zNear = something;

//function to transform vector into screen space, we are normalizing screen space
/* after normalizing screenspace, -1 means left edge of screen, 1 means right edge of screen,
-1 means bottom edge of screen, 1 means top edge of screen. [0,0] is center of the screen.
in the tutorial, the bottom and top are +1 and -1.
we are flipping it because LPE 2D coordinate system is Y positive upwards*/
function transformIntoScreenSpace(_v) {
    var x = _v[0];
    var y = _v[1];
    var z = _v[2];

   //using the formula directly from the tutorial
/* [x,y,z] -- transform --> [(a*F*x)/z, (F*y)/z, z*q-zNear*q]
where a = w/h, F = 1/tan(fieldOfView/2), q = zFar/(zFar-zNear)
*/
    var a = aspectRatio;
    var F = 1 / Math.tan(LP.degtorad(fieldOfView / 2));
    var q = zFar / (zFar - zNear);

    var xdash = (a * F * x) / z;
    var ydash = (F * y) / z;
    var zdash = z * q - zNear * q;

    return [xdash, ydash, zdash];
}

var init = () => {
};

var update = (_delta) => {

};

var draw = () => {
 LP.draw_anchor([-5, 5], 0xff0000);

}

export var pDrawObject3D = LP.addProperty(init, update, draw);
