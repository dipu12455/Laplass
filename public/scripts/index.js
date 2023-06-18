import * as LP from './LPEngine/LPEngine.js';
//import * as Scene01 from './scene01.js';
import * as Scene from './Scene.js';

//these functions need to be run in this exact order


LP.showScreenGrid(); //display the screen grid

LP.runEngine(window, 640, 480, Scene.update, Scene.draw);

