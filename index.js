import {add} from './subindex.js';
import * as lp from './pixiApp.js';

//these functions need to be run in this exact order
lp.init(document);
lp.spriteInit();
lp.lp_draw_line(0,0,250,250,0x000000);
lp.renderAll();
lp.runTicker();
