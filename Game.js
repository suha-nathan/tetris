import GameBoard from "./GameBoard";
import KeyboardController from "./KeyboardController";
import Termino from "./Termino";

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

    //termino initialise
    this.currTermino = null;
    this.nextTermino = null;

    //setup animation timing
    this.lastFrameTimeStamp = 0; //timestamp of last frame to update animation
    this.dropCounter = 0; //tracks time elapsed since termino moved down
    this.dropInterval = GAME_CONSTANTS.DROP_INTERVAL; //time taken for termino to move down 1 step

    //binding "this" to all callback functions in constructor
    this.gameLoop = this.gameLoop.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * function that starts up the game
   */
  start() {
    //sets up keys to keep track of
    this.keyboard.initialise(Object.values(KEY_CODES));

    //setup the callback function to trigger on keypress
    this.keyboard.setKeyPressCallback(this.handleKeyPress);

    //create and setup initial terminos
    this.nextTermino = this.createRandomTermino();
    this.spawnNewTermino(); //spawns termino at the top of the board and checks game condition

    //start the game loop with gameLoop callback
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * triggers functions/game actions based off current game state and key press
   * @param {string} keyCode
   * @returns
   */
  handleKeyPress(keyCode) {
    //if game over and space is pressed, reset game
    if (this.gameOver && keyCode === KEY_CODES.SPACE) {
      this.resetGame();
      return;
    }

    //toggle pause
    if (keyCode === KEY_CODES.P) {
      this.paused = !this.paused;
      return;
    }

    //if game state is paused or is gameOver, dont handle any key presses for movement
    if (this.paused || this.gameOver) {
      return;
    }

    if (keyCode === KEY_CODES.LEFT) {
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
      this.rotateTermino();
    }
  }

  /**
   * resets all game parameters
   */
  resetGame() {
    //set the gameboard to original state
    this.gameBoard.clearBoard();

    //reset terminos
    this.currTermino = null;
    this.nextTermino = null;

    //set game stats to original
    this.paused = false;
    this.gameOver = false;
    this.score = 0;
    this.linesCleared = 0;
    this.level = 1;

    this.lastFrameTimeStamp = 0;
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
   * locks termino in place at location, calculates new game board, spawns new termino
   */
  lockTermino() {}

  /**
   * randomly generates a new Termino
   * @returns {Termino} instance of Termino class
   */
  createRandomTermino() {
    const terminoTypes = ["I", "J", "L", "O", "S", "T", "Z"];
    const randomType = Math.floor(Math.random() * terminoTypes.length);
    return new Termino(terminoTypes[randomType]);
  }

  /**
   * changes the current Termino, positions it and checks for game over
   */
  spawnNewTermino() {
    this.currTermino = this.nextTermino;
    this.nextTermino = this.createRandomTermino();

    //position termino at the top of the board
    this.currTermino.position = {
      x: Math.floor((GAME_CONSTANTS.COLS - this.currTermino.shape.length) / 2),
      y: 0,
    };

    //if termino cant fit into the board at the top position, game is Over
    if (!this.currTermino.canMoveTo(this.gameBoard)) {
      this.gameOver = true;
    }
  }

  /**
   * main Game Loop run by request Animation Frame
   */
  gameLoop(timestamp) {
    const delaTime = timestamp - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = timestamp;

    //update game state if not paused or note game over
    if (!this.paused && !this.gameOver) {
      this.dropCounter += delaTime; // time elapsed since the last time termino auto dropped

      //move the termino down after interval time has elapsed
      if (this.dropCounter > this.dropInterval) {
        this.dropCounter = 0;
        // move termino down, lock it into board position if unable to move down
        if (!this.moveTermino(0, 1)) {
          this.lockTermino();
        }
      }
    }

    //draw all the game elements
    this.render();

    //continue the loop
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * draws on canvas all the game elements - board, termino, game stats, overlay
   */
  render() {}
}
