import * as LP from './LPEngine/LPEngine.js';
import { objSpaceship } from './objects/objSpaceship.js';
import { pTextDrawObjectSample } from './properties/textDrawObjectSample.js';

//create an instance of the object objSpaceship
/* var spaceship01 = new objSpaceship();
spaceship01.y = -5;

LP.addInstance(spaceship01); //add this instance to the engine */
LP.setPrintConsole(true);
let i = 0;
for (i = 0; i < 10; i += 1){
    var instance = new objSpaceship();
    instance.y = getRandomInt(10);
    instance.elapsed = getRandomInt(100);
    LP.addInstance(instance);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
