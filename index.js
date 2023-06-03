import * as LP from './LPEngine.js';

//these functions need to be run in this exact order
LP.init(document,640,480);
//LP.showScreenGrid(); //display the screen grid

LP.defineDrawOperations(() => {
  LP.draw_line(0,0,5,6,0x000000);
}); // draw operations provided as parameter, only use LP draw functions
