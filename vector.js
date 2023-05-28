class Vector {
    constructor(vx, vy){
        this.vx = vx;
        this.vy = vy;
        this.theta = (Math.atan2(vy,vx)*180) / Math.PI; //in degrees
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
    getVector(){
        return this;
    }
}

module.exports = Vector
