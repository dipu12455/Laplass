import * as LP from './LPEngine/LPEngine.js';

//these functions need to be run in this exact order
LP.init(document,640,480);
LP.showScreenGrid(); //display the screen grid

var animate = 5; //animating this variable
var elapsed = 0;
var angle = 0;

var vector1 = new LP.LPVector(2,2);
var vector2 = new LP.LPVector(5,5);
//need to hide implementation of this ticker for this animation, because it's the job of LPEngine and not the client program
LP.getTicker().add((delta) => {
  elapsed += delta;
  //animation code goes here
  animate = Math.cos(elapsed/50.0); //just make it oscillate, divide by 50 is for slowing down animation
  angle += 0.3 * delta;
  
  var vector1dash = new LP.LPVector(0,0); //make a temp vector
  vector1dash.setVector1(vector1.getX()*animate*2.2,vector1.getY()*animate*2.2);

  var vector2dash = new LP.LPVector(0,0); //make a temp vector
  vector2dash.setVector2(LP.rotateVector(vector2,angle));

  LP.defineDrawOperations(() => {
    LP.draw_vector_origin(vector1dash,0x00ffff,0x0000ff);
    LP.draw_vector_origin(vector2dash,0x00ff00,0xff0000);
  }); // draw operations provided as parameter, only use LP draw functions

  LP.draw();
});

//vector2 is green line red acnchor
