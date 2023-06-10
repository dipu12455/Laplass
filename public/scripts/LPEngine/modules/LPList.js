import { LPVector } from "./LPVector.js";

export class LPList{
  constructor(){
    this.indexCounter = 0;
    this.array = [];
  }

  add(_item){
    // add the item
    this.array[this.indexCounter] = _item;
    this.indexCounter += 1;
    return this.indexCounter-1;
  }
  put(_item,_index){
    this.array[_index] = _item;
  }
  get(_index){
    return this.array[_index];
  }
  getSize(){
    return this.array.length;
  }
  getPrint(){
    return this.array;
  }
}

export class Primitive extends LPList{
  constructor(_origin){
    super();
    this.xorigin = _origin.getX();
    this.yorigin = _origin.getY();
  }
  getOrigin(){
    return new LPVector(this.xorigin,this.yorigin);
  }
  setOrigin(_origin){
    this.xorigin = _origin.getX();
    this.yorigin = _origin.getY();
  }
  getPrint(){
    var i = 0;
    var output = ``;
    for (i = 0; i < this.getSize();i += 1){
      output = output.concat(this.get(i).getPrint());
    }
    return output;
  }
}

