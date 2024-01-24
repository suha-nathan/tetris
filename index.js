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
  getPoseFromIndex: function (index) {
    let row = ~~((index + 1) / this.cols);
    let col = (index + 1) % this.cols;
    let result = [col - 1, row];
    return result; // result [x,y] are 0 indexed.
  },
  getIndex: function (x, y) {
    // x and y are 0 indexed col, row (0,1,2,...,11)
    let result = cols * y + x;
    return result;
  },
  setEmpty: function () {
    //resets map blockLayer to array of zeros.
    let layerLength = this.cols * this.rows;
    this.blockLayer = new Array(layerLength).fill(0);
  },

  update: function (termino) {},
};

class Termino {
  type; //L, T, line, square.
  shape = []; //
  constructor(type) {
    switch (type) {
      case 1:
        //L shape
        this.shape = [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0];
        break;
      case 2:
        //T shape
        this.shape = [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0];
        break;
      case 3:
        // line
        this.shape = [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0];
        break;

      case 4:
        //square
        this.shape = [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0];
        break;
      case 5:
        //_
        // |_
        this.shape = [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0];
        break;
      case 6:
        //  _
        //_|
        this.shape = [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0];
        break;
    }
  }
  rotate(px, py, rotation) {
    //rotation is 0, 90, 180 or 270
    // function returns index of shape for a given px and py for a rotation.
    // rotation 0 just gives the index of the arr in constructor for a given px py (in 4 by 4 coordinates)
    let index;
    switch (rotation % 4) {
      case 0:
        index = py * 4 + px;
        break;
      case 1:
        index = 12 + py - 4 * px;
        break;
      case 2:
        index = 15 - 4 * py - px;
        break;
      case 3: //might be wrong
        index = 3 - py + 4 * px;
        break;
    }
    return index;
  }
  doesPieceFit(x, y, rotation) {
    let isFit = true;
    // row
    let pi, fi;
    for (let i = 0; i < 4 && isFit; i++) {
      //col
      for (let j = 0; j < 4 && isFit; j++) {
        pi = this.rotate(j, i, rotation); // index of termino
        fi = (y + i) * map.cols + (x + j); // index of map field
        if (this.shape[pi] == 1 && map.blockLayer[fi] != 0) {
          console.log(
            "piece hitting map: setting to false",
            this.shape[pi],
            map.blockLayer[fi]
          );

          isFit = false;
        }
        //check if piece is in bounds
        if (
          this.shape[pi] == 1 &&
          (y + i >= map.rows || x + j < 0 || x + j >= map.cols)
        ) {
          console.log("piece not gg to be in bounds: set to false");
          isFit = false;
        }
      }
    }
    return isFit;
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

  if (elapsed - this.prevElapsed >= 120) {
    this.update(delta); //updating game state/map/termino position
    this.render(); //re-rendering/drawing the map and termino

    this.prevElapsed = elapsed;
  }
  window.requestAnimationFrame(this.tick);
}.bind(Game);

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
  this.curTermino = new Termino(2); //!TODO - generate randomly
  this.curPosX = ~~(map.cols / 2) - 1;
  this.curPosY = 0;
  this.curRotation = 0;
  this.score = 0;
  map.setEmpty();
  // map.setTest();
};

Game.update = (delta) => {
  //left, right
  //spacebar (rotate)

  if (Keyboard.isDown(Keyboard.LEFT)) {
    if (
      this.curTermino.doesPieceFit(
        this.curPosX - 1,
        this.curPosY,
        this.curRotation
      )
    ) {
      console.log("left");
      this.curPosX -= 1;
    }
  }

  if (
    Keyboard.isDown(Keyboard.RIGHT) &&
    this.curTermino.doesPieceFit(
      this.curPosX + 1,
      this.curPosY,
      this.curRotation
    )
  ) {
    console.log("right");
    this.curPosX += 1;
  }

  if (
    Keyboard.isDown(Keyboard.DOWN) &&
    this.curTermino.doesPieceFit(
      this.curPosX,
      this.curPosY + 1,
      this.curRotation
    )
  ) {
    console.log("down");
    this.curPosY += 1;
  }

  if (
    Keyboard.isDown(Keyboard.SPACE) &&
    this.curTermino.doesPieceFit(
      this.curPosX,
      this.curPosY,
      this.curRotation + 1
    )
  ) {
    console.log("rotate");
    this.curRotation += 1;
  }

  if (this.gameState) {
    //update difficulty every ___

    ////test if the piece can be moved down
    if (
      this.curTermino.doesPieceFit(
        this.curPosX,
        this.curPosY + 1,
        this.curRotation
      )
    ) {
      this.curPosY++;
    } else {
      //lock piece in place
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          pi = this.curTermino.rotate(j, i, this.curRotation); // index of termino
          fi = (this.curPosY + i) * map.cols + (this.curPosX + j); // index of map field
          console.log("index of map field locked into place: ", fi);

          if (this.curTermino.shape[pi] == 1) {
            map.blockLayer[fi] = 1;
          }
        }
      }
      let toBeCleared;
      let linesToBeCleared = [];
      //check for lines that termino was in and remove
      for (let i = 0; i < 4; i++) {
        toBeCleared = true;
        for (let j = 0; j < map.rows && toBeCleared; j++) {
          fi = (this.curPosY + i) * map.cols + j;
          if (map.blockLayer[fi] == 0) {
            toBeCleared = false;
          }
        }
        if (toBeCleared) {
          linesToBeCleared.push(this.curPosY + i);
        }
      }

      if (linesToBeCleared.length > 0) {
        linesToBeCleared.forEach((y) => {
          for (let x = 0; x < map.cols; x++) {
            map.blockLayer[y * map.cols + x] = 0; // clears the line but How to shift down??
          }
          this.score++;
        });
      }

      //shift line down?

      //pick new piece - update curTermino. reset piece position
      let rand = Math.floor(Math.random() * 6 + 1);
      this.curTermino = new Termino(rand);
      this.curPosX = ~~(map.cols / 2) + 1;
      this.curPosY = 0;
      this.curRotation = 0;

      //if new piece doesnt fit straight away, game over
      this.gameState = this.curTermino.doesPieceFit(
        this.curPosX,
        this.curPosY,
        this.curRotation
      )
        ? 1
        : 0;
    }
  } else {
    console.log("GAME OVER");
  }
};
Game.drawMap = function () {
  //clear map
  this.ctx.beginPath();
  this.ctx.fillStyle = "white";
  this.ctx.fillRect(0, 0, map.cols * map.tileSize, map.rows * map.tileSize);
  let markX = 0;
  let markY = 400 - 64;

  map.blockLayer.forEach((tile, index) => {
    if (tile === 1) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(markX, markY, map.tileSize, map.tileSize);
    }
    markX = (index % map.cols) * map.tileSize;
    markY = (~~index / map.cols) * map.tileSize;
    // markY = (map.rows - 1 - ~~((index + 1) / map.cols)) * map.tileSize;
  });
};

Game.drawTermino = () => {
  let initX = this.curPosX * map.tileSize; //init x position
  let initY = this.curPosY * map.tileSize; //init y position
  let markX = initX,
    markY = initY;
  let pi;
  console.log(initX, initY);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      markX = initX + j * map.tileSize;
      markY = initY + i * map.tileSize;
      pi = this.curTermino.rotate(j, i, this.curRotation);
      if (this.curTermino.shape[pi] == 1) {
        Game.ctx.beginPath();
        Game.ctx.fillStyle = "green";
        Game.ctx.strokeStyle = "black";
        Game.ctx.fillRect(markX, markY, map.tileSize, map.tileSize);
        Game.ctx.rect(markX, markY, map.tileSize, map.tileSize);
        Game.ctx.stroke();
      }
    }
  }
};

Game.render = function () {
  this.drawMap();
  this.drawTermino();
};

window.onload = () => {
  let canvasElement = document.getElementById("game-map");
  let context = document.getElementById("game-map").getContext("2d");
  canvasElement.width = map.cols * map.tileSize;
  canvasElement.height = map.rows * map.tileSize;

  Game.run(context, canvasElement);
};
