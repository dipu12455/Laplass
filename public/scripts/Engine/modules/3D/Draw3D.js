import { crossProduct, dotProduct_3D, getUnitVector_3D, scalarXVector_3D, v1Plusv2_3D, v2Minusv1_3D, vDivScalar_3D } from "./Vector3D.js";
import { draw_line, draw_polygon, printConsole, rgbToHex } from "../EngineCore.js";
import { List, Queue } from "../List.js";
import { getMatrixQuickInverse, getPointAtMatrix, getProjectionMatrix, getRotationMatrixX, getRotationMatrixY, getRotationMatrixZ, getTranslationMatrix, makeIdentityMatrix, mat4x4, matrixMultiMatrix, multiplyMatrixVector } from "./Matrix4x4.js";
import { Triangle, getMesh } from "./Models3D.js";
import { INSTANCES, getFollowedInstance_3D, updateWorldMatrixForInstance } from "../Instances.js";

//Render options, change it for debugging purposes
var shaded = true;
var wireframe = true;

export class Plane {
    constructor(_point, _normal) {
        this.point = _point;
        this.normal = getUnitVector_3D(_normal);
    }
}

/*these clipping planes can stay constant (the same place in front of the camera) because the world moves around the camera, not the other way around.
for simplicity, we make our program as if we are moving the camera, but under the hood, the code flips that matrix and moves the world instead.
this is what's happening when we say 'the triangles are being transformed from world space to view space'*/
export const zNearPlane = new Plane([0, 0, 0.1, 1], [0, 0, 1, 1]);
export const screenLeftPlane = new Plane([0, 0, 0, 1], [0.60181, 0, 0.79863, 1]);
export const screenRightPlane = new Plane([0, 0, 0, 1], [-0.60181, 0, 0.79863, 1]);
export const screenTopPlane = new Plane([0, 0, 0, 1], [0, -0.70710, 0.70710, 1]);
export const screenBottomPlane = new Plane([0, 0, 0, 1], [0, 0.70833, 0.70587, 1]);

//projection space related constants
/*-------------------------------------------------*/
//screen size is total chaos in Draw3D, all triangles are drawn to LPE coord space.
//and variables are hard coded for now. TJS won't have the same coordinate as Draw3D,
//so programs won't appear the same in these two renderers anymore.
export const screenWidth = (640 - 640 / 2) / 20;
export const screenHeight = (480 / 2 - 480) / 20;
export const aspectRatio = screenHeight / screenWidth;
/*---------------------------------------------------------*/
export const fieldOfView = 75; //Draw3D's clipping was made for 90degFOV, but it will still work for 75deg
export const zNear = 0.1;
export const zFar = 1000;
export const matProj = getProjectionMatrix(aspectRatio, fieldOfView, zNear, zFar);

//view space variables and functions
var matView = new mat4x4();
var vCamera = [0, 0, 0, 1];
var vLookDir = [0, 0, 1, 1];
var cameraYaw = 0;
var cameraPitch = 0; //pitching only works with TJS right now

var cameraZoomDistance = 5; //how close is the camera to the object when following it
var cameraOrbitAngleY = 0;
var cameraOrbitAngleX = 0;

/*define a camera class, create one instance of it, then export it.
GameObjects will modify this camera instance, then either Draw3D or TJS will
read this object every frame and move their camera accordingly*/


/*this function needs to be called in every frame to update the view matrix according
to continuously updated camera position (vCamera) and yaw/look directions (vLookDir)*/
export function updateCamera() {
    if (getFollowedInstance_3D() != null) {
        setCameraYaw(0);
        var x = getFollowedInstance_3D().x;
        var y = getFollowedInstance_3D().y;
        var z = getFollowedInstance_3D().z;

        var camPoint = [0, 0, -cameraZoomDistance, 1];
        var matOrbitY = getRotationMatrixY(cameraOrbitAngleY);
        var matOrbitX = getRotationMatrixX(cameraOrbitAngleX);
        camPoint = multiplyMatrixVector(camPoint, matOrbitY);
        camPoint = multiplyMatrixVector(camPoint, matOrbitX);

        setCamera([x + camPoint[0], y + camPoint[1], z + camPoint[2], 1]);
        vLookDir = v2Minusv1_3D(vCamera, [x, y, z, 1]);
    }
    var vUp = [0, 1, 0, 1];
    var vTarget = [0, 0, 1, 1];
    var matCameraRotX = getRotationMatrixX(cameraPitch);
    var matCameraRotY = getRotationMatrixY(cameraYaw);
    if (getFollowedInstance_3D() === null) { //if instances are not being followed, calculate vLookDir as normal
        vLookDir = multiplyMatrixVector(vTarget, matCameraRotX);
        vLookDir = multiplyMatrixVector(vLookDir, matCameraRotY);
    }


    vTarget = v1Plusv2_3D(vCamera, vLookDir);
    var matCamera = getPointAtMatrix(vCamera, vTarget, vUp);
    //now make the view matrix from camera
    matView = getMatrixQuickInverse(matCamera);
}

//getters and setters for the view space variables
export function getCamera() { //returns the camera position vector
    return vCamera;
}
export function setCamera(_v) { //provide a camera position vector
    vCamera = _v;
}
export function getCameraYaw() {
    return cameraYaw; //returned in degrees
}
export function setCameraYaw(_yaw) { //provide in degrees
    cameraYaw = _yaw;
}
export function setCameraPitch(_pitch) {
    cameraPitch = _pitch;
}
export function getCameraPitch() {
    return cameraPitch;
}
export function setCameraZoomDistance(_distance) {
    if (_distance > 5) {
        cameraZoomDistance = _distance;
    }
}
export function getCameraZoomDistance() {
    return cameraZoomDistance;
}

export function getCameraOrbitAngleY() {
    return cameraOrbitAngleY;
}
export function setCameraOrbitAngleY(_angle) {
    cameraOrbitAngleY = _angle;
}
export function getCameraOrbitAngleX() {
    return cameraOrbitAngleX;
}
export function setCameraOrbitAngleX(_angle) {
    cameraOrbitAngleX = _angle;
}

export function getLookDir() { //returns the look direction vector
    return vLookDir;
}
export function getMatView() { //get the view matrix, used by other functions to transform triangles into view space
    return matView;
}

//draws a 2D filled triangle on the screen. Inputs are 2D vectors. Drawing is taking place in the 2D screen space, regular X and Y coordinates in the LPE system
export function fillTriangle(_v1, _v2, _v3, _color) {
    const vertexList = new List();
    vertexList.add(_v1);
    vertexList.add(_v2);
    vertexList.add(_v3);

    draw_polygon(vertexList, 0x000000, wireframe, _color, shaded);
}

export function moveTriangleToScreen(_triangle, _scale, _screenWidth, _screenHeight) {

    //scale into view, still normalized, scale = 0
    _triangle.v1[0] += _scale;
    _triangle.v1[1] += _scale;
    _triangle.v2[0] += _scale;
    _triangle.v2[1] += _scale;
    _triangle.v3[0] += _scale;
    _triangle.v3[1] += _scale;

    //here we are denormalizing into screen width and height
    _triangle.v1[0] *= -_screenWidth;
    _triangle.v1[1] *= -_screenHeight;
    _triangle.v2[0] *= -_screenWidth;
    _triangle.v2[1] *= -_screenHeight;
    _triangle.v3[0] *= -_screenWidth;
    _triangle.v3[1] *= -_screenHeight;

    return _triangle;
}

export function multiplyTriangleWithMatrix(_triangle, _matrix) {
    var triange = new Triangle([
        multiplyMatrixVector(_triangle.v1, _matrix),
        multiplyMatrixVector(_triangle.v2, _matrix),
        multiplyMatrixVector(_triangle.v3, _matrix)]);
    triange.color = _triangle.color;
    triange.normalFlipped = _triangle.normalFlipped;
    return triange;
}

export function getTriangleNormal(_triangle) {
    var normal, line1, line2;
    var flipNormal = _triangle.normalFlipped;
    line1 = v2Minusv1_3D(_triangle.v1, _triangle.v2);
    line2 = v2Minusv1_3D(_triangle.v1, _triangle.v3);
    if (flipNormal == false) normal = crossProduct(line2, line1); //flipping the cross product, to try to get triangles to be defined by the counterclockwise order of vertices
    if (flipNormal == true) normal = crossProduct(line1, line2); //for vertices being in the clockwise order

    //normalize the normal
    normal = getUnitVector_3D(normal);

    return normal;
}

export function sortTrianglesByDepth(_trianglesList) { //the input is an array of triangles

    var i = 0;
    for (i = 0; i < _trianglesList.length; i += 1) {
        var j = 0;
        for (j = 0; j < _trianglesList.length; j += 1) {
            var midZ1 = (_trianglesList[i].v1[2] + _trianglesList[i].v2[2] + _trianglesList[i].v3[2]) / 3;
            var midZ2 = (_trianglesList[j].v1[2] + _trianglesList[j].v2[2] + _trianglesList[j].v3[2]) / 3;
            if (midZ1 > midZ2) {
                var temp = _trianglesList[i];
                _trianglesList[i] = _trianglesList[j];
                _trianglesList[j] = temp;
            }
        }
    }
    return _trianglesList;
}

function printTheTrianglesOfList(_triangleList) {
    var i = 0;
    printConsole(`Length of _triangleList = ${_triangleList.length}`);
    for (i = 0; i < _triangleList.length; i += 1) {
        printConsole(`_triangleList[${i}]`);
        printConsole(`${_triangleList[i].getString()}`);
    }
}

function getIntersectionPoint_LineWithPlane_3D(_lineStartPoint, _lineEndPoint, _clippingPlane) {
    var plane_p = _clippingPlane.point;
    var plane_n = _clippingPlane.normal;
    plane_n = getUnitVector_3D(plane_n); //this is important, because the normal def is 'eye-balled' and not normalized
    var plane_d = -dotProduct_3D(plane_n, plane_p);
    var ad = dotProduct_3D(_lineStartPoint, plane_n);
    var bd = dotProduct_3D(_lineEndPoint, plane_n);
    var t = (-plane_d - ad) / (bd - ad);
    var lineStartToEnd = v2Minusv1_3D(_lineStartPoint, _lineEndPoint);
    var lineToIntersect = scalarXVector_3D(t, lineStartToEnd);
    return v1Plusv2_3D(_lineStartPoint, lineToIntersect);
}

function clipTriangleWithPlane(_triangle, _clippingPlane) { //returns a list of sub-triangles that are clipped from the given triangle
    var clippedTrianglesList = [];
    /*first find out if any of the vertices of the triangle are inside the clipping plane
    the clipping plane comes with a normal that tells the direction the plane is facing.
    'Inside' means the point facing away from the normal of the plane.
    we need to render everything outside the plane, and clip anything inside it*/

    //get the vertices of the triangle and label them
    var A = _triangle.v1;
    var B = _triangle.v2;
    var C = _triangle.v3;

    /*subtract the triangle point from the planePoint, then dot product this with the planeNormal.
    if the dot product is positive, they are facing the same way, and the point is outside,
    if dot product is negative, the point is inside. Count the number of inside points and which ones they are*/
    var planePoint = _clippingPlane.point;
    var planeNormal = _clippingPlane.normal;
    var noOfInsidePoints = 0;

    //for point A in the triangle
    var vA = v2Minusv1_3D(planePoint, A);
    var dpA = dotProduct_3D(vA, planeNormal);
    var insideA = false; //initializing
    if (dpA < 0) {
        noOfInsidePoints += 1;
        insideA = true; //marking this point as being inside
    }

    //for point B in the triangle
    var vB = v2Minusv1_3D(planePoint, B);
    var dpB = dotProduct_3D(vB, planeNormal);
    var insideB = false;//initializing
    if (dpB < 0) {
        noOfInsidePoints += 1;
        insideB = true; //marking this point as being inside
    }

    //for point C in the triangle
    var vC = v2Minusv1_3D(planePoint, C);
    var dpC = dotProduct_3D(vC, planeNormal);
    var insideC = false;//initializing
    if (dpC < 0) {
        noOfInsidePoints += 1;
        insideC = true; //marking this point as being inside
    }

    /*now based on how many inside points there are, clip the triangle accordingly
    if noOfInsidePoints == 3, clip the whole triange, return nothing

    if noOfInsidePoints == 2, there is one point outside, find which point it is, 
    then form a triangle with that point, and the two points of intersection with the plane

    if nofOfInsidePoints == 1, find out which points are outside, form two triangles using those points,
    and the two points of intersection with the plane

    if noOfInsidePoints == 0, return back the triangle given to you. there is no clipping*/

    if (noOfInsidePoints == 3) { //clip whole triangle, return nothing
        return {
            clipped: true,
            clippedTriangles: [] //return empty list, later when draw function is iterating through this list, it will realize its an empty list and ignore this triangle alltogether
        }
    }
    if (noOfInsidePoints == 0) { //clip nothing, return the triangle
        clippedTrianglesList.push(_triangle); //add the original triangle to the clipped triangle list
        return {
            clipped: false,
            clippedTriangles: clippedTrianglesList
        }
    }

    if (noOfInsidePoints == 2) { //this will return one triangle
        //find which one point is the outside point
        var oP, iP1, iP2; //going in anticlockwise order, acronyms for outside point, inside point 1, inside point 2
        if (insideA == false) {
            oP = A;
            iP1 = B;
            iP2 = C;
        }
        if (insideB == false) {
            oP = B;
            iP1 = C;
            iP2 = A;
        }
        if (insideC == false) {
            oP = C;
            iP1 = A;
            iP2 = B;
        }

        //points are sorted, now we define two lines. then find the two points of intersections of those lines with the clipping plane
        var iP1LineSP = iP1; //stands for iP1 line start point
        var iP1LineEP = oP; //stands for iP1 line end point

        var iP2LineSP = iP2; //stands for iP2 line start point
        var iP2LineEP = oP; //stands for iP2 line end point

        //find intersection point of iP1 line with the clipping plane
        var iP1LineIntersectionPoint = getIntersectionPoint_LineWithPlane_3D(iP1LineSP, iP1LineEP, _clippingPlane);

        //similarly find intersection point of iP2 line with the clipping plane
        var iP2LineIntersectionPoint = getIntersectionPoint_LineWithPlane_3D(iP2LineSP, iP2LineEP, _clippingPlane);

        //form the triangle
        var clippedTriangle = new Triangle([iP1LineIntersectionPoint, iP2LineIntersectionPoint, oP]);
        clippedTriangle.color = _triangle.color;
        clippedTriangle.normalFlipped = _triangle.normalFlipped;

        clippedTrianglesList.push(clippedTriangle); //return the triangle, there is only one triangle returned
        return {
            clipped: true,
            clippedTriangles: clippedTrianglesList
        }

    }

    if (noOfInsidePoints == 1) { //this will return two triangles
        //find which two points are the outside points
        var oP1, oP2, iP; //going in anticlockwise order, acronyms for outside point 1, outside point 2, inside point
        if (insideA == true) {
            oP1 = B;
            oP2 = C;
            iP = A;
        }
        if (insideB == true) {
            oP1 = C;
            oP2 = A;
            iP = B;
        }
        if (insideC == true) {
            oP1 = A;
            oP2 = B;
            iP = C;
        }

        //points are sorted, now we define two lines. then find the two points of intersections of those lines with the clipping plane
        var line1SP = iP;
        var line1EP = oP1;

        var line2SP = iP;
        var line2EP = oP2;

        //find intersection point of line1 with the clipping plane
        var line1IntersectionPoint = getIntersectionPoint_LineWithPlane_3D(line1SP, line1EP, _clippingPlane);

        //similarly find intersection point of line2 with the clipping plane
        var line2IntersectionPoint = getIntersectionPoint_LineWithPlane_3D(line2SP, line2EP, _clippingPlane);

        //form triangle 1
        var clippedTriangle1 = new Triangle([line1IntersectionPoint, oP1, oP2]);
        var clippedTriangle2 = new Triangle([line1IntersectionPoint, oP2, line2IntersectionPoint]);
        clippedTriangle1.color = _triangle.color;
        clippedTriangle2.color = _triangle.color;
        clippedTriangle1.normalFlipped = _triangle.normalFlipped;
        clippedTriangle2.normalFlipped = _triangle.normalFlipped;

        //return the triangles
        clippedTrianglesList.push(clippedTriangle1);
        clippedTrianglesList.push(clippedTriangle2);
        return {
            clipped: true,
            clippedTriangles: clippedTrianglesList //return the two triangles
        }
    }
}

export function clipTrianglesWithPlanes(_triangleList, _clippingPlanesList) {
    var i = 0;
    var outputList = _triangleList.slice(); //copy the list
    for (i = 0; i < _clippingPlanesList.length; i += 1) {
        var processingQueue = new Queue(); //take things from top of queue, add things to back of queue
        var temp = [];
        processingQueue.pushList(outputList); //update the queue with the triangles to get started
        while (!processingQueue.isEmpty()) {
            var triangle = processingQueue.pop(); //take from the top
            var clip = clipTriangleWithPlane(triangle, _clippingPlanesList[i]);
            temp = temp.concat(clip.clippedTriangles); //updates the output list with triangles
        }
        outputList = temp.slice(); //copy the list
    }
    return outputList;
}

function isTriangleFacingCamera(_triangle) {
    var normal = getTriangleNormal(_triangle);
    var vector1 = v2Minusv1_3D(getCamera(), _triangle.v1);
    var dotProduct = dotProduct_3D(normal, vector1);
    return dotProduct < 0; //if dp less that zero, the tri normal and cam dir vectors are facing each other, so the tri is facing the camera
}
//returns how much to shade this tri. lighting and shading color is fixed for now
function getTriangleColorFromLighting(_triangle, _color) {
    //illumination (of course, only if you can see it)
    const light_direction = [0, 0, -1];
    const vU_light_direction = getUnitVector_3D(light_direction);

    //get normal of triangle
    var normal = getTriangleNormal(_triangle);

    //see how similar the normal is to the light direction
    var dotProduct2 = dotProduct_3D(normal, vU_light_direction);
    //dotProduct2 is already a value between 0 and 1, because it is the dot product of two unit vectors
    //use this dotproduct2 value to input rbg between 0-1

    var R = dotProduct2 * _color[0];
    var G = dotProduct2 * _color[1];
    var B = dotProduct2 * _color[2];

    return rgbToHex(R, G, B); //just green
}


/*processes the triangles of a mesh to be drawn on the screen, returns a list of unsorted triangles, to be sorted by depth order
Chronologically, this function 
-> obtains a mesh 
-> iterates through each triangle 
-> moves every triangle to the current instance's world space 
-> moves them to view space 
-> clips them to get more triangles 
-> projects them into 2D plane and adjusts their 2D coord for screen space 
-> determines their color based on lighting 
-> returns a list of unsorted triangles*/
export function moveTrianglesToScreenSpace(_mesh, _color, _matWorld) {
    var unsortedTrianglesList = [];
    var i = 0;
    for (i = 0; i < _mesh.triangles.length; i += 1) {
        const tri = _mesh.triangles[i];

        //move triangle to world space
        var triTransformed = multiplyTriangleWithMatrix(tri, _matWorld);

        //only draw triangle if it is facing towards the camera
        if (isTriangleFacingCamera(triTransformed)) {
            //move triangle into view space
            var triViewed = multiplyTriangleWithMatrix(triTransformed, matView);

            //clip the triangles with the given clipping planes, this will return a list of possible sub-triangles
            var clippedTriangles = clipTrianglesWithPlanes([triViewed], [screenBottomPlane,
                screenTopPlane,
                screenLeftPlane,
                screenRightPlane,
                zNearPlane]);

            //this loop to iterate through the list of clipped triangles
            var j = 0;
            for (j = 0; j < clippedTriangles.length; j += 1) {
                var color = getTriangleColorFromLighting(clippedTriangles[j], _color); /*call this function here,
                lighting is calculated in this exact stage of transformation, after view space and before projection space*/

                //move triangle to projection space
                var triProjected = multiplyTriangleWithMatrix(clippedTriangles[j], matProj);

                //normalize each vertex of triangle by dividing by w
                triProjected.v1 = vDivScalar_3D(triProjected.v1, triProjected.v1[3]);
                triProjected.v2 = vDivScalar_3D(triProjected.v2, triProjected.v2[3]);
                triProjected.v3 = vDivScalar_3D(triProjected.v3, triProjected.v3[3]);

                //denormalize the triangle to screen space
                triProjected = moveTriangleToScreen(triProjected, 0, screenWidth, screenHeight);

                //store this finished triangle into the unsorted list
                triProjected.color = color;
                unsortedTrianglesList.push(triProjected);
            }

        }
    }
    return unsortedTrianglesList;
}

export function drawScene_3D() {
    var allMeshTriangles = [];
    for (var i = 0; i < INSTANCES.getSize(); i += 1) {
        var current = INSTANCES.get(i);
        if (current.isHidden()) continue; //if hidden, skip this instance
        if (!current.is3D) continue; //if not 3D, skip this instance
        if (current.meshID === null) continue; //if no mesh, skip this instance
        updateWorldMatrixForInstance(current);//update the world matrix for this instance

        var mesh = getMesh(current.meshID);
        allMeshTriangles = allMeshTriangles.concat(moveTrianglesToScreenSpace(mesh, current.color, current.matWorld));
    }
    allMeshTriangles = sortTrianglesByDepth(allMeshTriangles);

    //loop through the list to draw each triangle
    var k = 0;
    for (k = 0; k < allMeshTriangles.length; k += 1) {
        var tri = allMeshTriangles[k];
        fillTriangle([tri.v1[0], tri.v1[1]],
            [tri.v2[0], tri.v2[1]],
            [tri.v3[0], tri.v3[1]], tri.color);
    }

}