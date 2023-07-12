//this file will be called into index.js to be chosen as the scene to render

import * as LP from '../../LPEngine/LPEngine.js'; //the LPE functions that will be needed
import { objDrawObject } from './objDrawObject.js';

var drawObject = new objDrawObject(); /*make an instance of the object just created
if it weren't a draw object, any initial state can be defined here, wherever.
just type objObject.setPosition([5,5]); for example*/

LP.addInstance(drawObject); /*add the instance to the LPEngine, effectively 'registering' it.
This is the only way to get the instance to be processed by the engine.
the LPE holds a list of instances that it goes through each loop.
it executes the update functions of each instance in the list, then does the same 
with the draw functions of each instance in the list.*/

LP.setPrintConsole(true); 