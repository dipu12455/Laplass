import * as LP from './LPEngine.js';

//these functions need to be run in this exact order
LP.init(document);
LP.spriteInit();
LP.lp_draw_line(0,0,250,250,0x000000);
LP.renderAll();
LP.runTicker();
