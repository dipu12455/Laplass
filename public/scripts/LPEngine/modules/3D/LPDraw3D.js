import { crossProduct, dotProduct_3D, getMag_3D, getUnitVector_3D, scalarXVector_3D, v1Plusv2_3D, v2Minusv1_3D, vDivScalar_3D } from "./LPVector3D.js";
import { draw_fragment, draw_line, draw_polygon, fragmentSize, printConsole, rgbToHex, moveToScreenCoord, setPrintConsole } from "../LPEngineCore.js";
import { LPList, Queue } from "../LPList.js";
import { getMatrixQuickInverse, getPointAtMatrix, getProjectionMatrix, getRotationMatrixX, getRotationMatrixY, getRotationMatrixZ, makeIdentityMatrix, mat4x4, matrixMultiMatrix, multiplyMatrixVector } from "./LPMatrix4x4.js";
import { Triangle } from "./LPModels3D.js";

//Render options, change it for debugging purposes
var shaded = false;
var wireframe = true;
var culling = false; //draw only the triangles facing the camera

class Line {
    constructor(_startPoint, _endPoint) {
        this.startPoint = _startPoint;
        this.endPoint = _endPoint;
    }
    getVector() {
        return v2Minusv1_3D(this.endPoint, this.startPoint);
    }
    getUnitVector() {
        return getUnitVector_3D(this.getVector());
    }
}

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
export const screenWidth = (640 - 640 / 2) / 20;
export const screenHeight = (480 / 2 - 480) / 20;
export const aspectRatio = screenHeight / screenWidth;
export const fieldOfView = 90;
export const zNear = 0.1;
export const zFar = 1000;
export const matProj = getProjectionMatrix(aspectRatio, fieldOfView, zNear, zFar);

//view space variables and functions
var matView = new mat4x4();
var vCamera = [0, 0, 0, 1];
var vLookDir = [0, 0, 1, 1];
var cameraYaw = 0;

/*this function needs to be called in every frame to update the view matrix according
to continuously updated camera position (vCamera) and yaw/look directions (vLookDir)*/
export function updateCamera() {
    var vUp = [0, 1, 0, 1];
    var vTarget = [0, 0, 1, 1];
    var matCameraRot = getRotationMatrixY(cameraYaw);
    vLookDir = multiplyMatrixVector(vTarget, matCameraRot);

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
export function getLookDir() { //returns the look direction vector
    return vLookDir;
}
export function getMatView() { //get the view matrix, used by other functions to transform triangles into view space
    return matView;
}

//draws a 2D filled triangle on the screen. Inputs are 2D vectors. Drawing is taking place in the 2D screen space, regular X and Y coordinates in the LPE system
export function fillTriangle(_v1, _v2, _v3, _color) {
    const vertexList = new LPList();
    vertexList.add(_v1);
    vertexList.add(_v2);
    vertexList.add(_v3);

    draw_polygon(vertexList, 0x000000, wireframe, _color, shaded);
}

function changeTriangleToScreenCoord(_triangle) {
    var v12D = moveToScreenCoord([_triangle.v1[0], _triangle.v1[1]]);
    var v22D = moveToScreenCoord([_triangle.v2[0], _triangle.v2[1]]);
    var v32D = moveToScreenCoord([_triangle.v3[0], _triangle.v3[1]]);

    var v1 = [v12D[0], v12D[1], _triangle.v1[2], _triangle.v1[3]];
    var v2 = [v22D[0], v22D[1], _triangle.v2[2], _triangle.v2[3]];
    var v3 = [v32D[0], v32D[1], _triangle.v3[2], _triangle.v3[3]];
    _triangle.v1 = v1;
    _triangle.v2 = v2;
    _triangle.v3 = v3;
    
    return _triangle;
}

//this is a draw function, it will directly call the draw_fragment function
export function renderFragments(_triangle) {
    var tri = changeTriangleToScreenCoord(_triangle); //change to triangles to pixel based
    //label the vertices, going anticlockwise from 0deg position
    var A = tri.v1;
    var B = tri.v2;
    var C = tri.v3;

    //draw a line BA and CA.
    var BA = new Line(B, A);
    var CA = new Line(C, A);

    var P1 = B; //this is the start point of scanline that moves along BA
    var P2 = C; //this is the end point of scanline that moves along CA

    //move P1 along BA a distance of fz (fragmentSize)
    var fz = fragmentSize;
    var noOfFragmentsBA = Math.ceil(getMag_3D(BA.getVector()) / fz);
    for (var i = 0; i < noOfFragmentsBA; i += 1) {
        P1 = v1Plusv2_3D(BA.startPoint, scalarXVector_3D(i * fz, BA.getUnitVector()));
        var factor = getMag_3D(v2Minusv1_3D(P1, BA.startPoint)) / getMag_3D(BA.getVector());
        //move the exact portion in line CA, as reflected by 'factor'
        P2 = v1Plusv2_3D(CA.startPoint, scalarXVector_3D(factor, CA.getVector()));
        //now draw a line from P1 to P2
        var scanline = new Line(P1, P2);
        var noOfFragmentsSL = Math.ceil(getMag_3D(scanline.getVector()) / fz);
        for (var j = 0; j < noOfFragmentsSL; j += 1) {
            var Q = v1Plusv2_3D(scanline.startPoint, scalarXVector_3D(j * fz, scanline.getUnitVector()));
            draw_fragment(Q[0], Q[1], Q[2], tri.color);
            printConsole(`tri.color = ${tri.color}`);
        }
    }
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
    return triange;
}

export function getTriangleNormal(_triangle, _flipNormal) {
    var normal, line1, line2;
    line1 = v2Minusv1_3D(_triangle.v2, _triangle.v1);
    line2 = v2Minusv1_3D(_triangle.v3, _triangle.v1);
    if (_flipNormal == false) normal = crossProduct(line2, line1); //flipping the cross product, to try to get triangles to be defined by the counterclockwise order of vertices
    if (_flipNormal == true) normal = crossProduct(line1, line2); //for vertices being in the clockwise order

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

function printTheTrianglesOfList(_triangleList) {
    var i = 0;
    printConsole(`Length of _triangleList = ${_triangleList.length}`);
    for (i = 0; i < _triangleList.length; i += 1) {
        printConsole(`_triangleList[${i}]`);
        printConsole(`${_triangleList[i].getString()}`);
    }
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
    var vA = v2Minusv1_3D(A, planePoint);
    var dpA = dotProduct_3D(vA, planeNormal);
    var insideA = false; //initializing
    if (dpA < 0) {
        noOfInsidePoints += 1;
        insideA = true; //marking this point as being inside
    }

    //for point B in the triangle
    var vB = v2Minusv1_3D(B, planePoint);
    var dpB = dotProduct_3D(vB, planeNormal);
    var insideB = false;//initializing
    if (dpB < 0) {
        noOfInsidePoints += 1;
        insideB = true; //marking this point as being inside
    }

    //for point C in the triangle
    var vC = v2Minusv1_3D(C, planePoint);
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

        //return the triangles
        clippedTrianglesList.push(clippedTriangle1);
        clippedTrianglesList.push(clippedTriangle2);
        return {
            clipped: true,
            clippedTriangles: clippedTrianglesList //return the two triangles
        }
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
    var lineStartToEnd = v2Minusv1_3D(_lineEndPoint, _lineStartPoint,);
    var lineToIntersect = scalarXVector_3D(t, lineStartToEnd);
    return v1Plusv2_3D(_lineStartPoint, lineToIntersect);
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
export function moveTrianglesToScreenSpace(_mesh, _matWorld) {
    var unsortedTrianglesList = [];
    var i = 0;
    for (i = 0; i < _mesh.triangles.length; i += 1) {
        const tri = _mesh.triangles[i];

        //move triangle to world space
        var triTransformed = multiplyTriangleWithMatrix(tri, _matWorld);

        //only draw triangle if it is facing towards the camera
        if (isTriangleFacingCamera(triTransformed, _mesh.normalFlipped)) {
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
                var color = getTriangleColorFromLighting(clippedTriangles[j], _mesh.normalFlipped, _mesh.color); /*call this function here,
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
                printConsole("triProjected.color = " + triProjected.color);
                unsortedTrianglesList.push(triProjected);
            }

        }
    }
    return unsortedTrianglesList;
}


function isTriangleFacingCamera(_triangle, _normalFlipped) {
    if (culling == false) { return true; } //skip this check if culling is disabled
    var normal = getTriangleNormal(_triangle, _normalFlipped);
    var vector1 = v2Minusv1_3D(_triangle.v1, getCamera(),);
    var dotProduct = dotProduct_3D(normal, vector1);
    return dotProduct < 0; //if dp less that zero, the tri normal and cam dir vectors are facing each other, so the tri is facing the camera
}


//returns how much to shade this tri.
//the mesh color needs to be defined as color = [R, G, B] and value between 0 and 1
function getTriangleColorFromLighting(_triangle, _normalFlipped, _meshColorRGBArray) {
    //illumination (of course, only if you can see it)
    const light_direction = [0, 0, -1];
    const vU_light_direction = getUnitVector_3D(light_direction);

    //get normal of triangle
    var normal = getTriangleNormal(_triangle, _normalFlipped);

    //see how similar the normal is to the light direction
    var dotProduct2 = dotProduct_3D(normal, vU_light_direction);
    //dotProduct2 is already a value between 0 and 1, because it is the dot product of two unit vectors
    //use this dotproduct2 value to input rbg between 0-1
    var R = dotProduct2 * _meshColorRGBArray[0];
    var G = dotProduct2 * _meshColorRGBArray[1];
    var B = dotProduct2 * _meshColorRGBArray[2];
    return rgbToHex(R, G, B);
}

//draws mesh projected 2D onto the screen, the world matrix tells where to position this mesh in 3D space
export function drawMesh(_mesh, _matWorld) {
    if (_mesh !== null) { //objects can be defined with null mesh
        //takes a mesh, returns with a list of triangles ready to be drawn on screen using 2D draw functions
        var unsortedTrianglesList = moveTrianglesToScreenSpace(_mesh, _matWorld);

        //triangles from all meshes need to be collected into a list, depth sorted, then drawn onto the screen

        //sort triangles here by depth, then draw them.
        //sorting them back to front, so the back triangles get drawn first
        var sortedTrianglesList = sortTrianglesByDepth(unsortedTrianglesList);

        //loop through the list to draw each triangle
        var k = 0;
        for (k = 0; k < sortedTrianglesList.length; k += 1) {
            var tri = sortedTrianglesList[k];
            renderFragments(tri);
            fillTriangle([tri.v1[0], tri.v1[1]],
                [tri.v2[0], tri.v2[1]],
                [tri.v3[0], tri.v3[1]], tri.color);
            
        }
    }
}