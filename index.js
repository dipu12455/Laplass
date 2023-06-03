import * as LP from './LPEngine.js';

//these functions need to be run in this exact order
LP.init(document,640,480);
LP.showScreenGrid(); //display the screen grid

var animate = 5; //animating this variable

//need to hide implementation of this ticker for this animation, because it's the job of LPEngine and not the client program
LP.getTicker().add((delta) => {
  animate -= 0.01 * delta;

  LP.defineDrawOperations(() => {
    LP.draw_line(0,0,5,6,0x000000);
    LP.draw_line(0,0,1*animate,1.5*animate,0x00ff00);
  }); // draw operations provided as parameter, only use LP draw functions

  LP.draw();
});
