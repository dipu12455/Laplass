//PIXI doesnt need an import statement because it is retrieved from a CDN. But Threejs isn't
import * as THREE from 'three';

import { getCamera, getCameraPitch, getCameraYaw, getLookDir } from './Draw3D.js';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { degtorad } from '../Vector.js';
import { INSTANCES } from '../Instances.js';
import { v1Plusv2_3D } from './Vector3D.js';

var renderer, scene, camera, gridlinePlane; //variables that need to have scope in all functions of this file

var MESHES = [];
var MESHES_indexCounter = 0;

export function TJS_init(_canvas) {
    var canvas = _canvas;
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    //keep the width and height as 640 and 480 to keep render as same as possible to Draw3D

    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(width, height);
    //verified that this renderer is safely put inside the canvas. Changing the size of canvas in html reflects stable changes accordingly

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);

    //using two lghts, one for proper shading, other for not making unshaded too dark
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 0, 1000); //light is same at all distance
    scene.add(pointLight);

    //add a back light, meshes have no shading in the shadow
    const backLight = new THREE.PointLight(0xffffff, 0.2);
    backLight.position.set(0, 0, -1000); //light is same at all distance
    scene.add(backLight);

    //make a square plane on the XZ axis then give it material of a gridline
    const planeGeo = new THREE.PlaneGeometry(10,10);

    const planeMatLoader = new THREE.TextureLoader();
    const planeMatTexture = planeMatLoader.load( `./images/gridlineMat.png`);
    planeMatTexture.wrapS = THREE.RepeatWrapping;
    planeMatTexture.wrapT = THREE.RepeatWrapping;
    planeMatTexture.repeat.set( 10, 10 );
    const planeMat = new THREE.MeshBasicMaterial({map: planeMatTexture, side: THREE.DoubleSide});
    //the plane is MeshBasicMaterial so it won't react to light
    gridlinePlane = new THREE.Mesh(planeGeo, planeMat);
    gridlinePlane.position.set(0,0,0);
    gridlinePlane.rotation.x = degtorad(-90);
    scene.add(gridlinePlane);

}

export function TJS_loadMesh(_meshPath, _color) {
    //count the index independently from the async operation. that way the index gets returned correctly first, and the meshes get loaded whenever.
    //dont load the mesh first and then have it return an index. you keep the index calculation seperate from any async operation
    MESHES_indexCounter+=1;
    //loading obj model
    const loader = new OBJLoader();
    //TJS understands if the given path is a local file, or a URL server route!
    loader.load(_meshPath, function (obj) {
        //the following is how to assign a material to a loaded obj model
        var current = obj;
        current.position.set(0,0,-5); //set their default position
        current.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                const material = new THREE.MeshLambertMaterial({ color: _color });
                child.material = material;
            }
        });
        scene.add(current);
        MESHES.push(current);
    });
    return MESHES_indexCounter-1;
}

function updateCamera() {
    //reads the camera state from engine, then updates own camera
    var ENCamPos = getCamera();
    var x = ENCamPos[0]; var y = ENCamPos[1]; var z = ENCamPos[2];
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = -z;

    var vTarget = v1Plusv2_3D(ENCamPos, getLookDir());
    camera.lookAt(vTarget[0], vTarget[1], -vTarget[2]);
}
function TJS_update() {
    //TJS doesn't need delta, because it just reads value changes on LPGameObjects.
    updateCamera();

    //now update render instances according to their engine instance counterparts
    for (var i = 0; i < INSTANCES.getSize(); i += 1){
        var current = INSTANCES.get(i);
        if (current.isHidden()) continue; //skip hidden instances
        if (!current.is3D) continue; //skip non-3D instances
        if (current.meshID === null) continue; //skip instances without a mesh
        var currentMesh = MESHES[current.meshID]; //retrieve the corresponding mesh of this engine instance
        //now update the mesh's position and rotation according to the engine instance
        //if the mesh doesn't exist yet, skip it

        if (currentMesh) currentMesh.position.x = current.x;
        if (currentMesh) currentMesh.position.y = current.y;
        if (currentMesh) currentMesh.position.z = -current.z; //need to flip z for TJS
        if (currentMesh) currentMesh.rotation.x = degtorad(-current.rotX); //TJS works in rad
        if (currentMesh) currentMesh.rotation.y = degtorad(current.rotY); //TJS works in rad
        if (currentMesh) currentMesh.rotation.z = degtorad(current.rotZ); //TJS works in rad
    }
}

export function TJS_render() { //reads the current state of all the instances in engine, then draws their respective meshes
    TJS_update();
    renderer.render(scene, camera);
}

// Generate a random integer between min (inclusive) and max (inclusive)
export function TJS_getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

