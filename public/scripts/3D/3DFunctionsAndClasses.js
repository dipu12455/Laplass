import * as LP from '../LPEngine/LPEngine.js';

// the vectors will be of form [x,y,z], represented as arrays



export function returnZeroMat4x4() {
    return [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
}

export class mat4x4 {
    constructor() {
        this.m = returnZeroMat4x4();
    }
}

export class Triangle {
    constructor(_vertices) { //the vertices is an array of vectors, and each vector is an array of three tuples [x,y,z]
        this.v1 = _vertices[0];
        this.v2 = _vertices[1];
        this.v3 = _vertices[2];
    }
}

export class Mesh {
    constructor(_triangles) { //the input is an array of the instance of the class Triangle
        this.triangles = _triangles;
    }
}

/*this location is used to initialize meshes from the server obj files, if a better location
is found, do so.*/
export const mesh = await getMeshFromObj('/mesh1'); //this function uses the classes described above it, don't move it anywhere else

export function drawTriangle(_v1, _v2, _v3) { //the inputs are 2D vectors
    LP.draw_line(_v1, _v2, 0x00ff00);
    LP.draw_line(_v2, _v3, 0x00ff00);
    LP.draw_line(_v3, _v1, 0x00ff00);
}

export function fillTriangle(_v1, _v2, _v3, _color) { //the inputs are 2D vectors
    const vertexList = new LP.LPList();
    vertexList.add(_v1);
    vertexList.add(_v2);
    vertexList.add(_v3);

    LP.draw_polygon(vertexList, 0x000000, false, _color);
}

export function copyTriangle(_triangle) {
    return new Triangle([
        [_triangle.v1[0], _triangle.v1[1], _triangle.v1[2]],
        [_triangle.v2[0], _triangle.v2[1], _triangle.v2[2]],
        [_triangle.v3[0], _triangle.v3[1], _triangle.v3[2]]]);
}

export function multiplyTriangleWithMatrix(_triangle, _matrix) {
    var triange = new Triangle([
        multiplyMatrixVector(_triangle.v1, _matrix),
        multiplyMatrixVector(_triangle.v2, _matrix),
        multiplyMatrixVector(_triangle.v3, _matrix)]);
    return triange;
}

export function translateTriangle(_triangle, _translation) {
    var triangle = new Triangle([
        [_triangle.v1[0] + _translation[0], _triangle.v1[1] + _translation[1], _triangle.v1[2] + _translation[2]],
        [_triangle.v2[0] + _translation[0], _triangle.v2[1] + _translation[1], _triangle.v2[2] + _translation[2]],
        [_triangle.v3[0] + _translation[0], _triangle.v3[1] + _translation[1], _triangle.v3[2] + _translation[2]]]);
    return triangle;
}

export function getTriangleNormal(_triangle) {
    var normal, line1, line2;
    line1 = v2Minusv1_3D(_triangle.v1, _triangle.v2);
    line2 = v2Minusv1_3D(_triangle.v1, _triangle.v3);
    normal = crossProduct(line1, line2);

    //normalize the normal
    normal = getUnitVector_3D(normal);

    return normal;
}

export function dotProduct_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return _v1[x] * _v2[x] + _v1[y] * _v2[y] + _v1[z] * _v2[z];
}

export function crossProduct(_v1, _v2) { //these are 3D vectors for input
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v1[y] * _v2[z] - _v1[z] * _v2[y],
    _v1[z] * _v2[x] - _v1[x] * _v2[z],
    _v1[x] * _v2[y] - _v1[y] * _v2[x]];
}

export function v2Minusv1_3D(_v1, _v2) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    return [_v2[x] - _v1[x], _v2[y] - _v1[y], _v2[z] - _v1[z]];
}

export function getUnitVector_3D(_v) {
    var x = 0, y = 1, z = 2; //just to make it more readable
    var length = Math.sqrt(_v[x] * _v[x] + _v[y] * _v[y] + _v[z] * _v[z]);
    if (length <= 0) { return [0, 0, 0]; }
    return [_v[x] / length, _v[y] / length, _v[z] / length];
}

//multiply a 3d vector by a matrix 4x4, and reurns a new 3D vector
export function multiplyMatrixVector(_v, _m) {
    var x = _v[0];
    var y = _v[1];
    var z = _v[2];
    var xdash = x * _m.m[0][0] + y * _m.m[1][0] + z * _m.m[2][0] + _m.m[3][0];
    var ydash = x * _m.m[0][1] + y * _m.m[1][1] + z * _m.m[2][1] + _m.m[3][1];
    var zdash = x * _m.m[0][2] + y * _m.m[1][2] + z * _m.m[2][2] + _m.m[3][2];
    var w = x * _m.m[0][3] + y * _m.m[1][3] + z * _m.m[2][3] + _m.m[3][3];

    if (w != 0) {
        xdash = xdash / w;
        ydash = ydash / w;
        zdash = zdash / w;
    }
    return [xdash, ydash, zdash];
}

export function meshFromStringObj(_string) {
    var vertexList = new LP.LPList();
    var facesList = new LP.LPList();

    const lines = _string.split("\n");

    let i = 0;
    for (i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const wordsRaw = line.split(" ");

        //filter the words
        let f = 0;
        var words = [];
        for (f = 0; f < wordsRaw.length; f += 1) {
            if (wordsRaw[f] === "" ||
                wordsRaw[f] === " ") {
                    continue;
                }
            words.push(wordsRaw[f]);
        }

        if (words[0] === "#" ||
            words[0] === "mtllib" ||
            words[0] === "g" ||
            words[0] === "vt" ||
            words[0] === "vn" ||
            words[0] === "usemtl") {
            continue; //skip unneeded lines of obj file, we are only taking vertices 'v' and faces 'f'
        }
        if (words[0] === "v") {
            var vertex = [parseFloat(words[1]), parseFloat(words[2]), parseFloat(words[3])];
            vertexList.add(vertex);
        }
        if (words[0] === "f") {
            var temp = [words[1], words[2], words[3]];
            const v1Ind = parseInt(temp[0].split("/")[0]);
            const v2Ind = parseInt(temp[1].split("/")[0]);
            const v3Ind = parseInt(temp[2].split("/")[0]);
            var face = [v1Ind, v2Ind, v3Ind];

            facesList.add(face);
        }
    }

    var triangleArray = [];

    i = 0;
    for (i = 0; i < facesList.getSize(); i += 1) {
        var face = facesList.get(i);
        var vertexArray = [vertexList.get(face[0]-1),
        vertexList.get(face[1]-1), 
        vertexList.get(face[2]-1)];
        triangleArray.push(new Triangle(vertexArray));
    }

    return new Mesh(triangleArray);
}

export async function getMeshFromObj(_serverRoute) {
    try {
        const response = await fetch(_serverRoute);
        const data = await response.text();
        return meshFromStringObj(data);

    } catch (error) {
        console.log(error);
        throw error;
    }
}


export function printMesh(_mesh){
    var i = 0;
    for(i = 0; i < _mesh.triangles.length; i += 1){
        console.log(`triangle ${i}: v1 = ${_mesh.triangles[i].v1}, v2 = ${_mesh.triangles[i].v2}, v3 = ${_mesh.triangles[i].v3}`);
    }
}