import * as EN from './Engine/Engine.js';
import * as Scene from './Samples/3D_Scene/Scene3D.js';
//import * as Scene from './Scene.js'; 
/*each scene can be a container of an entirely 
different application, so using this scene file and its accompanying property def files 
to experiment with 3D*/

/*LPE runs on the canvas element of the browser.
Obtain the canvas element and its dimensions, then feed it to engine.
The window element still gets sent in for now, for use by LPEvents.*/
const underlayCanvas = document.getElementById('underlayCanvas');
const overlayCanvas = document.getElementById('overlayCanvas');
const XYcanvas = document.getElementById('XYcanvas');
const XZcanvas = document.getElementById('XZcanvas');

EN.initEngine(window, underlayCanvas, overlayCanvas, XYcanvas, XZcanvas);

Scene.runScene(); //this sets up the state of the engine (like add all instances, load up their local properties, etc.). Run engine after this

//LP.showScreenGrid(); //display the screen grid

/*the following function is called after all the setup is done.
All primitives loaded, all instances added, all everything done.
Then when the setup is done, then this runEngine function bring everything together and run the app,
this function contains the main program loop, so of course all initializations need to be done before that*/
EN.runEngine(); //this starts the game loop
