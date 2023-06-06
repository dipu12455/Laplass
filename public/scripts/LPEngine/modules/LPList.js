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
  getArray(){
    return this.array;
  }
}

export class Primitive extends LPList{
  constructor(_xorigin,_yorigin){
    super();
    this.xorigin = _xorigin;
    this.yorigin = _yorigin;
  }
  //this child class needs to be given LPVectors as its list of items, make them a vertex triangle list
}

