/*an object. Objects hold the 'pen' to draw in the scene. If you just want to draw and don't need objects, make a drawObject like this one,
and simply populate its draw function. this object gets imported into the scene file, an instance of it made, and then 'add' that instance
to LPE to register it for processing in the game loopo. */

export class objDrawObject extends LP.LPGameObject {
    constructor() {
        super(); //always call this constructor
        //define custom variables here. these variables are persistent from one update frame to another, and unique per instance of this class
        this.elapsed = 0;
        this.init = () => {
            //initializers, or sequences needed when the instance first comes into existence
        };
        this.update = (_delta) => {
            //this will loop everyframw. use the delta to add increment to variables with time. usually, the this.elapsed variable is used to count passage of time
            this.elapsed += _delta;
        };
        this.draw = () => {
            //call draw functions here. If a primitive is set for this object, the primitive will be drawn automatically. Draw order is -- primitive first, this draw function second
        };
    }
}