let Game = {};
let Keyboard = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  SPACE: "Space",
  keys: {},
  eventListen: (keyInput) => {
    window.addEventListener("keydown", (event) => {
      let keyCode = event.code;
      if (Object.hasOwn(keys, keyCode)) {
        event.preventDefault();
        this.keys[keyCode] = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      let keyCode = event.code;

      if (Object.hasOwn(keys, keyCode)) {
        event.preventDefault();
        this.keys[keyCode] = false;
      }
    });

    this.keys = {};
    keyInput.forEach(
      function (key) {
        this.keys[key] = false; //initialise all keys to false/not pressed state
      }.bind(this)
    );
  },
  isDown: function (keyCode) {
    if (!keyCode in this.keys) {
      throw new Error(`Keycode ${keyCode} is not being listend to`);
    }

    return this.keys[keyCode];
  }.bind(this),
};

let map = {
  cols: 10,
  rows: 40,
  tileSize: 64,
  blockLayer: [], // represents the blocks on map. arr length of 10 x 40;
  getTile: function (col, row) {
    // returns blockLayer array item at col and row on a 10 x 40 grid.
  },
  getCol: function (x) {
    // at a given x pixel position, returns the col position in the map grid.
  },
  getRow: function (y) {},
  getX: function (col) {
    //at a column position col, returns the x axis pixel position of that col (top left vertex)
    return col * map.tileSize;
  },
  getY: function (row) {
    //at a row pose, returns the y axis position (top left vertex of tile)
    return row * map.tileSize;
  },
  getPoseFromIndex: function (index) {
    let row = ~~((index + 1) / this.cols);
    let col = (index + 1) % this.cols;
    let result = [col, row];
    return result;
  },
  getIndex: function (col, row) {
    //for a given row, col position returns the index of the tile in blockLayer
    // 0,0 of row, col is top left of game canvas.
    // 0th position of block layer is bottom left.

    let fromTopLeft = row * this.cols + col; //index position from (0,0) at top left corner
    let fromBotRight = this.blockLayer.length - fromTopLeft;

    let numRowsFromBottom = ~~(fromBotRight / this.cols);
    let resultIdx = numRowsFromBottom * this.cols + col;

    return resultIdx;
  },
  setEmpty: function () {
    //resets map blockLayer to array of zeros.
    let layerLength = this.cols * this.rows;
    blockLayer = new Array(layerLength).fill(0);
  },
  setTest: function () {
    map.blockLayer = [
      1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
    ];
  },
  update: function (termino) {},
};

class Termino {
  type; //L, T, line, square.
  posX; //unit is tiles (not px)
  posY;
  row; //shape of termino -> no of rows
  col; //shape of termino -> no of cols
  speedX;
  speedY;
  shape = [];
  constructor(type) {
    if (type === "square" || type === 0) {
    } else if (type === "line" || type == 1) {
    } else if (type === "tee" || type == 2) {
    } else if (type === "el" || type == 3) {
      this.type = 3; // el
      this.col = 3;
      this.row = 2;
      this.shape = [1, 1, 1, 1, 0, 0];
    }

    this.posX = ~~(map.cols / 2) - ~~(this.col / 2);
    this.posY = 0 + ~~(this.row / 2);
    this.speedX = 1; //tiles per second
    this.speedY = 1; //tiles per second - downward velocity
  }
  getPose(idx) {
    //input is the index of the tile in termino shape array
    //returns position on map [x,y].
    let deltaY = ~~(idx / this.col);
    let deltaX = idx % this.col;

    let pose = [this.posX + deltaX, this.posY - deltaY];
    return pose;
  }

  move(delta, x, y) {
    this.posX += x * this.speedX;
    this.posY += y * this.speedY;
    // check for left right collision
    this.collide(x, y);
    this.landing();

    //clamp  x y values here
  }

  rotate() {
    //rotates shape by 90degrees, clockwise
  }

  collide(x, y) {
    //handles left right and bottom collision
    let col;
    let left = this.posX;
    let right = this.posX + this.col;

    //check for collision on left and right
    //!!TODO not just map, it could be a block on left and right
    let collisionMap = left <= 0 || right >= map.cols;
    if (collisionMap) {
      if (x < 0) {
        this.posX = 0;
      } else if (x > 0) {
        this.posX = map.cols - this.col;
      }
    }

    let leftMost, rightMost;
    let leftTiles = [];
    let rightTiles = [];
    for (let i = 0; i < this.row; i++) {
      leftMost = 99; // reset the left most and right most after every row is analysed
      rightMost = -99;
      for (let j = 0; j < this.col; j++) {
        let curIdx = i * this.col + j;
        if (this.shape[curIdx] == 1 && j <= leftMost) {
          leftMost = j;
          leftTiles[i] = this.getPose(curIdx);
        }
        if (this.shape[curIdx] == 1 && j >= rightMost) {
          rightMost = j;
          rightTiles[i] = this.getPose(curIdx);
        }
      }
    }

    let checkRIdx, checkLIdx;
    let leftCollision = false;
    let rightCollision = false;
    let leftXPose, rightXPose;
    for (let i = 0; i < leftTiles.length && !leftCollision; i++) {
      checkLIdx = map.getIndex(leftTiles[i][0] - 1, leftTiles[i][1]);
      if (map.blockLayer[checkLIdx] == 1) {
        leftCollision = true;
        leftXPose = map.getPoseFromIndex(checkLIdx);
        console.log("leftCollision! ", leftXPose);
      }
    }
  }

  landing() {
    //handles termino landing on map.
    let isLanded = false;

    //landing on blocks or bottom of map only occurs when
    // termino

    return isLanded;
  }
}

Game.run = function (context) {
  this.ctx = context;
  this.prevElapsed = 0;
  //if need to load assets, use Promise here.
  this.init();
  window.requestAnimationFrame(this.tick); //initiallises the Game Loop
};

Game.tick = function (elapsed) {
  let delta = (elapsed - this.prevElapsed) / 1000.0;
  delta = Math.min(delta, 0.25);

  if (elapsed - this.prevElapsed >= 60) {
    this.update(delta); //updating game state/map/termino position
    this.render(); //re-rendering/drawing the map and termino

    this.prevElapsed = elapsed;
  }
  window.requestAnimationFrame(this.tick);
}.bind(Game);

Game.drawMap = function () {
  //clear map
  this.ctx.beginPath();
  this.ctx.fillStyle = "white";
  this.ctx.fillRect(0, 0, map.cols * map.tileSize, map.rows * map.tileSize);
  let markX = 0;
  let markY = (map.rows - 1) * map.tileSize;
  //mock blockLayer
  //   map.blockLayer = [
  //     1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
  //     0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  //     1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  //   ];

  map.blockLayer.forEach((tile, index) => {
    if (tile === 1) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(markX, markY, map.tileSize, map.tileSize);
    }
    markX = (index % map.cols) * map.tileSize;
    markY = (map.rows - 1 - ~~(index / map.cols)) * map.tileSize;
  });
};

Game.drawTermino = () => {
  //   //mockup termino
  //   this.curTermino.type = 3; // el
  //   this.curTermino.speed = 2;
  //   this.curTermino.col = 3;
  //   this.curTermino.row = 2;

  //   this.curTermino.posX = ~~(map.cols / 2) - ~~(this.curTermino.col / 2);
  //   this.curTermino.posY = 0 + ~~(this.curTermino.row / 2);
  //   this.curTermino.shape = [1, 1, 1, 1, 1, 0, 0];
  //draw Termino
  let initX = this.curTermino.posX * map.tileSize; //init x position
  let initY = this.curTermino.posY * map.tileSize; //init y position
  let markX = initX,
    markY = initY;

  this.curTermino.shape.forEach(
    function (tile, index) {
      if (tile === 1) {
        Game.ctx.beginPath();
        Game.ctx.fillStyle = "green";
        Game.ctx.strokeStyle = "black";
        Game.ctx.fillRect(markX, markY, map.tileSize, map.tileSize);
        Game.ctx.rect(markX, markY, map.tileSize, map.tileSize);
        Game.ctx.stroke();
      }
      ///
      markX = initX + ((index + 1) % this.curTermino.col) * map.tileSize;
      markY = initY - ~~((index + 1) / this.curTermino.col) * map.tileSize;
    }.bind(this)
  );
};

Game.init = () => {
  //listen on window for keyboard events
  //generate Termino
  Keyboard.eventListen([
    Keyboard.LEFT,
    Keyboard.RIGHT,
    Keyboard.DOWN,
    Keyboard.SPACE,
  ]);

  this.gameState = 1; //1 game is active. 0 game over. !TODO - pause game play.
  this.curTermino = new Termino("el"); //!TODO - generate randomly

  //   map.setEmpty();
  map.setTest();
};

Game.update = (delta) => {
  //left, right
  //down (makes termino move faster),
  //spacebar (rotate)
  //recalculates position and rotation of termino based off 1. keypress 2. termino speed 3. delta
  //recalculates map if Termino is landed.
  //if current Termino is landed, randomly generates new Termino and assigns to curTermino.

  //handle Termino movement.
  let x = 0;
  let y = 0; //change this to determine speed of termino
  let rotate = false;
  if (Keyboard.isDown(Keyboard.LEFT)) x = -1;
  if (Keyboard.isDown(Keyboard.RIGHT)) x = 1;
  if (Keyboard.isDown(Keyboard.DOWN)) y += 1;
  if (Keyboard.isDown(Keyboard.SPACE)) rotate = true;

  this.curTermino.move(delta, x, y); //handles termino position
  if (rotate) this.curTermino.rotate(); //handles termino rotation

  if (this.curTermino.landing()) {
    map.update(this.curTermino); //recalculates map based off termino landing position.
  }
};

Game.render = function () {
  //draw map
  this.drawMap();
  //draw Termino
  this.drawTermino();
};

window.onload = () => {
  let canvasElement = document.getElementById("game-map");
  let context = document.getElementById("game-map").getContext("2d");
  canvasElement.width = map.cols * map.tileSize;
  canvasElement.height = map.rows * map.tileSize;

  Game.run(context, canvasElement);
};
