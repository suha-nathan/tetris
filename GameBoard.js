export class GameBoard {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.grid = [];
    this.clearBoard();
  }

  /**
   * sets the game board grid to a 2D array of dimension rows x cols
   */
  clearBoard() {
    this.grid = new Array(this.rows)
      .fill(0)
      .map(() => new Array(this.cols).fill(0));
  }

  /**
   * checks if input position is within the grid/board boundaries
   * @param {number} x x coordinate of input position
   * @param {number} y y coordinate of input position
   * @returns {boolean} true if position is within grid bounds
   */
  isValidPosition(x, y) {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }
  /**
   * checks if input position is available to be occupies
   * @param {number} x x coordinate of input position
   * @param {number} y y coordinate of input position
   * @returns {boolean} true if position is empty
   */
  isEmptyPosition(x, y) {
    //out of bounds positions aren't empty
    if (!this.isValidPosition(x, y)) {
      return false;
    }

    //position is empty if it is "0"
    return this.grid[y][x] === 0;
  }
}
