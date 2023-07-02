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
new Triangle([[0,0,0],[0,1,0],[1,1,0]]),
new Triangle([[0,0,0],[1,1,0],[1,0,0]]),

//east face
new Triangle([[1,0,0],[1,1,0],[1,1,1]]),
new Triangle([[1,0,0],[1,1,1],[1,0,1]]),

//north face
new Triangle([[1,0,1],[1,1,1],[0,1,1]]),
new Triangle([[1,0,1],[0,1,1],[0,0,1]]),

//west face
new Triangle([[0,0,1],[0,1,1],[0,1,0]]),
new Triangle([[0,0,1],[0,1,0],[0,0,0]]),

//top face
new Triangle([[0,1,0],[0,1,1],[1,1,1]]),
new Triangle([[0,1,0],[1,1,1],[1,1,0]]),

//bottom face
new Triangle([[1,0,1],[0,0,1],[0,0,0]]),
new Triangle([[1,0,1],[0,0,0],[1,0,0]])];

var cube = new Mesh(triangleArray);

var init = () => {
};

var update = (_delta) => {

};

var draw = () => {
    LP.draw_anchor([-5, 5], 0xff0000);

}

export var pDrawObject3D = LP.addProperty(init, update, draw);
