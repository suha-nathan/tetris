export class Termino {
  constructor(type) {
    this.type = type; // determines shape of termino L, Z, etc
    this.rotation = 0; // rotation state of termino
    this.position = { x: 0, y: 0 }; // position of termino
    this.color = "";
    this.shape = []; // array representation of termino
  }
}
