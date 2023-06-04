import * as LP from './LPEngine/LPEngine.js';
import * as Scene01 from './scene01.js';

//these functions need to be run in this exact order
LP.init(document,640,480);
LP.showScreenGrid(); //display the screen grid

//need to hide implementation of this ticker for this animation, because it's the job of LPEngine and not the client program
LP.getTicker().add((delta) => {
  Scene01.update(delta);
  LP.defineDrawOperations(() => {
    Scene01.draw()
      }); // draw operations provided as parameter, only use LP draw functions

  LP.draw();
});

//vector2 is green line red acnchor
