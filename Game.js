import GameBoard from "./GameBoard.js";
import KeyboardController from "./KeyboardController.js";
import Termino from "./Termino.js";

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

export class Game {
  constructor(canvasId) {
    //initialise canvas and context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d"); //for drawing all game elements

    this.canvas.width = GAME_CONSTANTS.COLS * GAME_CONSTANTS.TILE_SIZE;
    this.canvas.height = GAME_CONSTANTS.ROWS * GAME_CONSTANTS.TILE_SIZE;

    //create keyboard controller
    this.keyboard = new KeyboardController();

    //create gameboard
    this.gameBoard = new GameBoard(GAME_CONSTANTS.COLS, GAME_CONSTANTS.ROWS);

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
   * @param {number} dx
   * @param {number} dy
   * @returns {boolean} true if the termino is moved, false if it is not
   */
  moveTermino(dx, dy) {
    let isMoved = false;

    const newPose = {
      x: this.currTermino.position.x + dx,
      y: this.currTermino.position.y + dy,
    };

    if (this.currTermino.canMoveTo(this.gameBoard, newPose)) {
      this.currTermino.move(dx, dy);
      isMoved = true;
    }
    return isMoved;
  }

  /**
   * checks for collisions and rotates termino if possible
   * @returns {boolean} false if termino cant rotate
   */
  rotateTermino() {
    let isRotated = false;
    const newRotationState = (this.currTermino.rotation + 1) % 4;

    if (
      this.currTermino.canMoveTo(
        this.gameBoard,
        this.currTermino.position,
        newRotationState
      )
    ) {
      this.currTermino.rotate();
      isRotated = true;
    }
    //TODO: if rotation fails, try shifting termino away from the wall and then the rotation

    return isRotated;
  }

  /**
   * locks termino in place at location, calculates new game board, spawns new termino
   */
  lockTermino() {
    //update game board with current termino
    this.gameBoard.placeTermino(this.currTermino);

    //update lines cleared, score
    const lines = this.gameBoard.clearLines();
    this.linesCleared += lines;
    this.score += lines * this.level * GAME_CONSTANTS.POINTS_PER_LINE;

    //update level
    // e.g. 8 lines cleared, level 1; 10 lines cleared, level 2, 24 lines cleared, level 3
    const newLevel =
      Math.floor(this.linesCleared / GAME_CONSTANTS.LEVEL_UP_LINES) + 1;

    //increase game speed every level up (reducing the drop interval by 50ms every level to a minimum of 100ms)
    if (newLevel > this.level) {
      this.level = newLevel;
      this.dropInterval = Math.max(
        GAME_CONSTANTS.MIN_DROP_INTERVAL,
        GAME_CONSTANTS.DROP_INTERVAL -
          (this.level - 1) * GAME_CONSTANTS.SPEED_INCREASE
      );
    }

    //update terminoes
    this.spawnNewTermino();
  }

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
  render() {
    //draw canvas
    this.ctx.fillStyle = "#F0F0F0";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //draw grid lines
    this.drawGridLines();

    //draw the board
    this.drawBoard();

    //draw the current termino
    if (this.currTermino && !this.gameOver) {
      this.drawTermino(this.currTermino);
    }

    //draw pause or gameOver overlay
    if (this.paused || this.gameOver) {
      this.drawOverlay();
    }
  }

  /**
   * Draw a single block
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} color - Block color
   */
  drawBlock(x, y, color) {
    const tileSize = GAME_CONSTANTS.TILE_SIZE;
    const pixelX = x * tileSize;
    const pixelY = y * tileSize;

    // Draw filled block
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pixelX, pixelY, tileSize, tileSize);

    // Draw highlight
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.fillRect(pixelX, pixelY, tileSize, 4);
    this.ctx.fillRect(pixelX, pixelY, 4, tileSize);

    // Draw shadow
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.ctx.fillRect(pixelX + tileSize - 4, pixelY, 4, tileSize);
    this.ctx.fillRect(pixelX, pixelY + tileSize - 4, tileSize, 4);

    // Draw outline
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(pixelX, pixelY, tileSize, tileSize);
  }

  drawGridLines() {
    this.ctx.strokeStyle = "#DDDDDD";
    this.ctx.lineWidth = 0.5;

    // Draw vertical grid lines
    for (let x = 0; x <= this.canvas.width; x += GAME_CONSTANTS.TILE_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= this.canvas.height; y += GAME_CONSTANTS.TILE_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawBoard() {
    for (let y = 0; y < this.gameBoard.rows; y++) {
      for (let x = 0; x < this.gameBoard.cols; x++) {
        const cellColor = this.gameBoard.grid[y][x];
        if (cellColor !== 0) {
          this.drawBlock(x, y, cellColor);
        }
      }
    }
  }

  drawTermino(termino) {
    const shape = termino.getRotatedShape();
    const pos = termino.position;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const drawX = pos.x + x;
          const drawY = pos.y + y;

          // Only draw if it's on the board
          //   if (drawY >= 0) {
          this.drawBlock(drawX, drawY, termino.color);
          //   }
        }
      }
    }
  }
  drawOverlay() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";

    if (this.gameOver) {
      this.ctx.fillText(
        "GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2 - 30
      );
      this.ctx.fillText(
        `Final Score: ${this.score}`,
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      this.ctx.fillText(
        "Press SPACE to restart",
        this.canvas.width / 2,
        this.canvas.height / 2 + 30
      );
    } else if (this.paused) {
      this.ctx.fillText(
        "PAUSED",
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      this.ctx.fillText(
        "Press P to continue",
        this.canvas.width / 2,
        this.canvas.height / 2 + 30
      );
    }
  }
}
