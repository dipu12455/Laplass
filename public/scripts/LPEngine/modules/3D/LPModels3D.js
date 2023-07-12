import { draw_fragment } from "../LPEngineCore.js";
import { LPList } from "../LPList.js";
import { fillTriangle, moveTrianglesToScreenSpace, renderFragments, sortTrianglesByDepth } from "./LPDraw3D.js";

export class Triangle {
    constructor(_vertices) { //the vertices is an array of vectors, and each vector is an array of three tuples [x,y,z]
        this.v1 = _vertices[0];
        this.v2 = _vertices[1];
        this.v3 = _vertices[2];
        this.color = 0x000000;
    }
    getString() {
        return "v1: " + this.v1 + "\nv2: " + this.v2 + "\nv3: " + this.v3;
    }
}

export class Mesh {
    constructor(_triangles, _normalFlipped, _color) { //the input is an array of the instance of the class Triangle
        this.triangles = _triangles;
        this.normalFlipped = _normalFlipped;
        this.color = _color; //this is an RGB array value; color = [R,G,B] between 0 and 1
    }
}

export function meshFromStringObj(_string, _normalFlipped, _color) {
    var vertexList = new LPList();
    var facesList = new LPList();

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
            var vertex = [parseFloat(words[1]), parseFloat(words[2]), parseFloat(words[3]), 1];
            vertexList.add(vertex);
        }
        if (words[0] === "f") {
            var quadFace = false;
            if (words.length === 5) { quadFace = true; }

            if (quadFace == false) {
                var temp = [words[1], words[2], words[3]];
                const v1Ind = parseInt(temp[0].split("/")[0]);
                const v2Ind = parseInt(temp[1].split("/")[0]);
                const v3Ind = parseInt(temp[2].split("/")[0]);
                var face = [v1Ind, v2Ind, v3Ind];

                facesList.add(face);
            } else {
                var temp = [words[1], words[2], words[3], words[4]];
                const v1Ind = parseInt(temp[0].split("/")[0]);
                const v2Ind = parseInt(temp[1].split("/")[0]);
                const v3Ind = parseInt(temp[2].split("/")[0]);
                const v4Ind = parseInt(temp[3].split("/")[0]);
                var face1 = [v1Ind, v2Ind, v3Ind];
                var face2 = [v1Ind, v3Ind, v4Ind];

                facesList.add(face1);
                facesList.add(face2);
            }
        }
    }

    var triangleArray = [];

    i = 0;
    for (i = 0; i < facesList.getSize(); i += 1) {
        var face = facesList.get(i);
        var vertexArray = [vertexList.get(face[0] - 1),
        vertexList.get(face[1] - 1),
        vertexList.get(face[2] - 1)];
        triangleArray.push(new Triangle(vertexArray));
    }

    return new Mesh(triangleArray, _normalFlipped, _color);
}

export async function getMeshFromObj(_serverRoute, _normalFlipped, _color) {
    try {
        const response = await fetch(_serverRoute);
        const data = await response.text();
        return meshFromStringObj(data, _normalFlipped, _color);

    } catch (error) {
        console.log(error);
        throw error;
    }
}


export function printMesh(_mesh) {
    var i = 0;
    for (i = 0; i < _mesh.triangles.length; i += 1) {
        console.log(`triangle ${i}: v1 = ${_mesh.triangles[i].v1}, v2 = ${_mesh.triangles[i].v2}, v3 = ${_mesh.triangles[i].v3}`);
    }
}

