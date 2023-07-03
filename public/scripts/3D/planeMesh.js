import { Mesh, Triangle } from "./3DFunctionsAndClasses.js";

//now we are describing the mesh of a lane that faces south
var triangleArray = [
    //south face
    new Triangle([[0, 0, 0], [0, 1, 0], [1, 1, 0]]),
    new Triangle([[0, 0, 0], [1, 1, 0], [1, 0, 0]]),

//north face
new Triangle([[1, 0, 1], [1, 1, 1], [0, 1, 1]]),
new Triangle([[1, 0, 1], [0, 1, 1], [0, 0, 1]])];


export var plane = new Mesh(triangleArray);