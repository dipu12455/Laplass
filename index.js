import * as LP from './LPEngine.js';

//these functions need to be run in this exact order
LP.init(document,640,480);
LP.spriteInit();
LP.draw_screen_grid(50,50,0x000000,0xcccccc);
LP.draw_line(0,0,5,6,0x000000);
LP.renderAll();
LP.runTicker();
