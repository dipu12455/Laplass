import * as LP from './LPEngine/LPEngine.js';
//import * as Scene01 from './scene01.js';
import * as Scene_sat3 from './scene_sat3.js';

//these functions need to be run in this exact order
LP.init(window,640,480);
LP.showScreenGrid(); //display the screen grid

//need to hide implementation of this ticker for this animation, because it's the job of LPEngine and not the client program
LP.getTicker().add((delta) => {
  Scene_sat3.update(delta);
  LP.defineDrawOperations(() => {
    Scene_sat3.draw()
      }); // draw operations provided as parameter, only use LP draw functions

  LP.draw();
});

//vector2 is green line red acnchor
