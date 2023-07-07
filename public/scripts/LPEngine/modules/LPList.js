export class LPList {
  constructor() {
    this.indexCounter = 0;
    this.array = [];
  }

  add(_item) {
    // add the item
    this.array[this.indexCounter] = _item;
    this.indexCounter += 1;
    return this.indexCounter - 1;
  }
  put(_item, _index) {
    this.array[_index] = _item;
  }
  append(_list) {//function to append an entire list onto this list
    let i = this.getSize();
    let j = 0;
    for (j = 0; j < _list.getSize(); j += 1) {
      this.put(_list.get(j), i);
      i += 1;
    }
  }
  get(_index) {
    return this.array[_index];
  }
  getSize() {
    return this.array.length;
  }
  getPrint() {
    return this.array;
  }
  flush() {
    this.array = [];
    this.indexCounter = 0;
  }
  delete(_delIndex) {
    var newArray = [];
    var i = 0;
    for (i = 0; i < this.getSize(); i += 1) {
      if (i == _delIndex) {
        continue;
      }
      newArray.push(this.array[i]); //adds element to the end of an array
    }
    this.array = newArray;
  }
  exists(_item){ //dont use for objects, only primitive data types
    var i = 0;
    for (i = 0; i < this.getSize(); i += 1) {
      if (this.get(i) == _item) {
        return true;
      }
    }
  }
}
