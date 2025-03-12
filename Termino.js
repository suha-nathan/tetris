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

  /**
   * increases the rotation state of termino
   * @param {number} numRotations default 1 rotation
   */
  rotate(numRotations = 1) {
    //only possible rotation states are 0, 1, 2, 3
    this.rotation = (this.rotation + numRotations) % 4;
  }

  /**
   * Computes the rotated 2D array representation of the termino
   * @returns {Array} 2D array representing the rotated termino
   */
  getRotatedShape() {
    //deep copy current termino shape to prevent termino shape mutations
    let rotatedShape = [...this.shape.map((row) => [...row])];

    //apply rotation
    for (let i = 0; i < this.rotation % 4; i++) {
      rotatedShape = this.rotateMatrix(rotatedShape);
    }

    return rotatedShape;
  }

  /**
   * rotates a square matrix by 90 degrees
   * @param {Array} matrix 2D square Array representing termino
   * @returns 2D Array representing rotated termino
   */
  rotateMatrix(matrix) {
    //instantiate empty termino shape (2D square array)
    const size = this.shape.length;
    let rotated = new Array(size).fill(0).map(() => new Array(size));

    //rotate by 90 degrees
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        rotated[x][size - 1 - y] = this.shape[y][x]; //rotation calculation
      }
    }
    return rotated;
  }

  /**
   * tests if an input position and rotation of termino is valid, no mutation of termino state
   * @param {GameBoard} board
   * @param {Object} position x y coords to test, default is current termino position
   * @param {number} rotation rotation state, defaule is current termino rotation
   * @returns {boolean} true if the termino can move to specified position and rotation
   */
  canMoveTo(board, position = this.position, rotation = this.rotation) {
    //save current position
    const originalPosition = { ...this.position };
    const originalRotation = this.rotation;

    //temporarily move to the test position and rotation
    this.position = { ...position };
    this.rotation = rotation;

    //get the rotated shape matrix
    const shapeTermino = this.getRotatedShape();
    const isValidMove = this.isValidPosition(shapeTermino, board);

    //restore original termino position and rotation
    this.position = originalPosition;
    this.rotation = originalRotation;

    return isValidMove;
  }

  isValidPosition(shapeTermino, board) {
    //loop through the shape matrix and check against board position
    for (let y = 0; y < shapeTermino.length; y++) {
      for (let x = 0; x < shapeTermino.length; x++) {
        if (shapeTermino[y][x]) {
          const boardXPose = this.position.x + x;
          const boardYPose = this.position.y + y;

          //if any part of the shape is not empy or within bounds, piece cannot move
          if (!board.isEmptyPosition(boardXPose, boardYPose)) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
