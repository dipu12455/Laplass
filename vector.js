class Vector {
    constructor(vx, vy){
        this.vx = vx;
        this.vy = vy;
        this.theta = Math.degrees(Math.atan2(vy,vx));
    }

    getX(){
        return this.vx;
    }
    getY(){
        return this.vy;
    }
    getTheta(){
        return this.theta;
    }
}

module.exports = Vector