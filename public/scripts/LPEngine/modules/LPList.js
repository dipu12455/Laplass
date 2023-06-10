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

