import * as LP from '../../LPEngine/LPEngine.js';
import { multiplyMatrixVector } from './LPMatrix4x4.js';
import { Triangle } from './LPModels3D.js';
import { v2Minusv1_3D, crossProduct, getUnitVector_3D } from './LPVector3D.js';

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
    _triangle.v1[1] *= _screenHeight;
    _triangle.v2[0] *= -_screenWidth;
    _triangle.v2[1] *= _screenHeight;
    _triangle.v3[0] *= -_screenWidth;
    _triangle.v3[1] *= _screenHeight;

    return _triangle;
}

export function multiplyTriangleWithMatrix(_triangle, _matrix) {
    var triange = new Triangle([
        multiplyMatrixVector(_triangle.v1, _matrix),
        multiplyMatrixVector(_triangle.v2, _matrix),
        multiplyMatrixVector(_triangle.v3, _matrix)]);
    return triange;
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

export function sortTrianglesByDepth(_trianglesList) { //the input is an LPList

    var i = 0;
    for (i = 0; i < _trianglesList.getSize(); i += 1) {
        var j = 0;
        for (j = 0; j < _trianglesList.getSize(); j += 1) {
            var midZ1 = (_trianglesList.get(i).v1[2] + _trianglesList.get(i).v2[2] + _trianglesList.get(i).v3[2]) / 3;
            var midZ2 = (_trianglesList.get(j).v1[2] + _trianglesList.get(j).v2[2] + _trianglesList.get(j).v3[2]) / 3;
            if (midZ1 > midZ2) {
                var temp = _trianglesList.get(i);
                _trianglesList.put(_trianglesList.get(j), i);
                _trianglesList.put(temp, j);
            }
        }
    }
    return _trianglesList;
}
