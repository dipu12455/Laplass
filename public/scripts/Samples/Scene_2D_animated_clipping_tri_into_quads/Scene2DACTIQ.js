import * as LP from '../../LPEngine/LPEngine.js';
import { objDrawObject_2DACTIQ } from './objDrawObject_2DACTIQ.js';
import { objStationaryPolygon } from './objStationaryPolygon.js';


/*this object wil behave as the polygon that needs to be clipped
the clipping is done within the rendering pipeline, and that's where the 
polygons/triangles live before being rendered, so just make all the clipping functions in the
object itself for now*/
var stationaryPolygon = new objStationaryPolygon();
LP.addInstance(stationaryPolygon);