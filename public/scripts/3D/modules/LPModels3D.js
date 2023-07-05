import * as LP from '../../LPEngine/LPEngine.js';

export class Triangle {
    constructor(_vertices) { //the vertices is an array of vectors, and each vector is an array of three tuples [x,y,z]
        this.v1 = _vertices[0];
        this.v2 = _vertices[1];
        this.v3 = _vertices[2];
        this.color = 0x000000;
    }
}

export class Mesh {
    constructor(_triangles) { //the input is an array of the instance of the class Triangle
        this.triangles = _triangles;
    }
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