class Piece {
    constructor(name) {
        this.name = name;
    }
}
class PieceMap{
  constructor(pos,name){
    this.pos = pos;
    this.name = name;
  }
}


const map1 = new Map();
const map2 = new Map();
map1.set("een",  new Piece("Een"));
map1.set("twee", new Piece("Twee"));
map1.set("drie", new Piece("Drie"));
map1.set(1,"een");
console.log(map1.get(1));
console.log(map1.get("een"));


