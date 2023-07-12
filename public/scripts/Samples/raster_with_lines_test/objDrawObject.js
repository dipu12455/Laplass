export class objDrawObject extends LP.LPGameObject {
    constructor() {
        super();
        this.elapsed = 0;
        this.init = () => {
        };

        this.update = (_delta) => {
            this.elapsed += _delta;
        };
        this.draw = () => {
            fragmentSize = 1;
            

        };
    }
}