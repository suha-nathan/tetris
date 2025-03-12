import GameBoard from "./GameBoard";
import KeyboardController from "./KeyboardController";

const GAME_CONSTANTS = {
  COLS: 10,
  ROWS: 20,
  TILE_SIZE: 32,
  FRAME_RATE: 60, // Target frames per second
  DROP_INTERVAL: 750, // Time in ms between automatic piece drops
  SPEED_INCREASE: 50, // How much to decrease the drop interval after each level
  MIN_DROP_INTERVAL: 100, // Minimum drop interval in ms
  POINTS_PER_LINE: 100, // Base points for clearing a line
  LEVEL_UP_LINES: 10, // Lines needed to level up
};

// Key mappings
const KEY_CODES = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  UP: "ArrowUp", // Alternative for rotation
  SPACE: "Space", // Rotation
  P: "KeyP", // Pause
};

export default class Game {
  constructor(canvasId) {
    //initialise canvas and context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d"); //for drawing all game elements

    this.canvas.width = GAME_CONSTANTS.COLS * GAME_CONSTANTS.TILE_SIZE;
    this.canvas.height = GAME_CONSTANTS.ROWS * GAME_CONSTANTS.TILE_SIZE;

    //create keyboard controller
    this.keyboard = new KeyboardController();

    //create gameboard
    this.gameBoard = new GameBoard(GAME_CONSTANTS.COLS, GAME_CONSTANTS.rows);

    //setup game state/stats
    this.paused = false;
    this.gameOver = false;
    this.score = 0;
    this.linesCleared = 0;
    this.level = 1;

    //setup tetromino
    this.currTermino = null;
    this.nextTermino = null;

    //setup animation timing
    this.lastFrameTime = 0; //timestamp of last frame to update animation
    this.dropCounter = 0; //tracks time elapsed since termino moved down
    this.dropInterval = GAME_CONSTANTS.DROP_INTERVAL; //time taken for termino to move down 1 step

    //initialise and run game
    this.init();
  }

  init() {
    //sets up keys to keep track of
    this.keyboard.initialise(Object.values(KEY_CODES));

    //setup the callback function to trigger on keypress
    this.keyboard.setKeyPressCallback(this.handleKeyPress.bind(this));
  }

  handleKeyPress(keyCode) {
    //check if game over
    //if game over and space is pressed, reset game
    //check if pause button is pressed - toggle the pause state

    //if game state is paused or is gameOver, dont handle any other key press
    if (this.paused || this.gameOver) {
      return;
    }

    if (keyCode === KEY_CODES.P) {
      //toggle pause
      this.paused = !this.paused;
    } else if (keyCode === KEY_CODES.LEFT) {
      //move left
      this.moveTermino(-1, 0);
    } else if (keyCode === KEY_CODES.RIGHT) {
      //move right
      this.moveTermino(1, 0);
    } else if (keyCode === KEY_CODES.DOWN) {
      //move down, lock termino into board position if unable to move down
      if (!this.moveTermino(0, 1)) {
        this.lockTermino();
      }
    } else if (keyCode === KEY_CODES.UP || keyCode === KEY_CODES.SPACE) {
      //rotate
    }
  }

  resetGame() {
    //set the gameboard to original state
    this.gameBoard.clearBoard();

    //set game stats to original
    this.paused = false;
    this.gameOver = false;
    this.score = 0;
    this.linesCleared = 0;
    this.level = 1;

    //spawn new termino
    this.currTermino = null;
    this.nextTermino = null;

    this.lastFrameTime = 0;
    this.dropCounter = 0;
    this.dropInterval = GAME_CONSTANTS.DROP_INTERVAL;
  }

  /**
   * checks for collisions and moves the termino on the game board if possible
   * @param {number} x
   * @param {number} y
   * @returns {boolean} true if the termino is moved, false if it is not
   */
  moveTermino(x, y) {
    let isMoved = false;

    return isMoved;
  }

  /**
   * checks for collisions and rotates termino if possible
   */
  rotateTermino() {}

  /**
   * locks termino in place at location
   */
  lockTermino() {}
}
