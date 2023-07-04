import { Mesh, Triangle } from "./3DFunctionsAndClasses.js";

//now we are describing the mesh of a cube
const triangleArray = [
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

export const cube = new Mesh(triangleArray);