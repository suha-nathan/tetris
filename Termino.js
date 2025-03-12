export default class Termino {
  constructor(type) {
    this.type = type; // determines shape of termino I, J, etc
    this.rotation = 0; // rotation state of termino
    this.position = { x: 0, y: 0 }; // position of termino
    this.color = this.getColorForType(type);
    this.shape = this.getShapeForType(type); // array representation of termino
  }

  getColorForType(type) {
    const colors = {
      I: "#00FFFF", // Cyan
      J: "#0000FF", // Blue
      L: "#FF8000", // Orange
      O: "#FFFF00", // Yellow
      S: "#00FF00", // Green
      T: "#800080", // Purple
      Z: "#FF0000", // Red
    };
    return colors[type];
  }

  getShapeForType(type) {
    const shapes = {
      I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      J: [
        [0, 0, 1],
        [0, 0, 1],
        [0, 1, 1],
      ],
      L: [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
      ],
      O: [
        [1, 1],
        [1, 1],
      ],
      S: [[0, 1, 1][(1, 1, 0)][(0, 0, 0)]],
      Z: [[1, 1, 0][(0, 1, 1)][(0, 0, 0)]],
      T: [[0, 1, 0][(1, 1, 1)][(0, 0, 0)]],
    };
    return shapes[type];
  }

  move(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
  }

  rotate(numRotations) {
    //only possible rotation states are 0, 1, 2, 3
    this.rotation = (this.rotation + numRotations) % 4;
  }

  /**
   * Based off of the termino's current rotation, computes the rotated 2D array
   * @returns {Array} rotatedShape represented by 2D array
   */
  getRotatedShape() {}

  /**
   * checks if an input position and rotation of termino is valid
   * @param {GameBoard} board
   * @param {Object} position x y coords to test, default is current termino position
   * @param {number} rotation rotation state, defaule is current termino rotation
   * @returns {boolean} true if the termino can move to specified position and rotation
   */
  canMoveTo(board, position = this.position, rotation = this.rotation) {
    let isMovable = false;

    return isMovable;
  }
}
