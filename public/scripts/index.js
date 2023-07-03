import * as LP from './LPEngine/LPEngine.js';
import * as Scene from './Scene.js'; /*each scene can be a container of an entirely 
different application, so using this scene file and its accompanying property def files 
to experiment with 3D*/

//these functions need to be run in this exact order

LP.showScreenGrid(); //display the screen grid

/*the following function is called after all the setup is done.
All primitives loaded, all instances added, all everything done.
Then when the setup is done, then this runEngine function bring everything together and run the app*/
LP.runEngine(window, 640, 480, Scene.draw);

