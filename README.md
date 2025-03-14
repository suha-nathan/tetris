# Tetris

### Project Overview

Tetris is a game that requires game players to control game pieces to arrange them in complete horizontal lines to gain points.

#### The game board:

- Grid of squares (rows and columns) that define the play boundaries
- Game pieces start at the top of the game board and continuously moves toward the bottom
- Game board displays the locked game pieces that have fallen to the bottom

#### The game piece (aka Termino/Tetromino):

- differently shaped pieces that can be moved `left`, `right`, `down` and `rotated`.
- has a downward speed that increases as score/level increases. This increases the difficulty of the game as the player increases their score
- New random shapes are generated once a piece is placed at the bottom of the game board
- Game Pieces are "placed" or "locked" into the game board when they cannot move further down the game board. This could either be because the piece reached the bottom of the game board or the piece is blocked from moving further down by a another locked game piece.

#### How to Gain Points:

- Player moves and/or rotates the game piece to arrange it into complete horizontal lines along the game board.
- Once a complete line is made, line is cleared and points are added to the player total.

#### Game Over:

- If a game piece collides with the top of the game board, this ends the game.
- This requires continuous clearing of lines on the game board

### Technical Design Choices

Main technologies used - Javascript, HTML Canvas
No npm packages or external libraries used.

Main Development Goal - To design the game to encapsulate the various game components. Separation of concerns of the various game mechanics.

File Structure - Component Based Design:

- Game.js: Core game state management loop
- GameBoard.js: Game board and grid management
- Termino.js: Piece representation and movement/rotation
- KeyboardController.js: Keyboard input handling
- index.js: instantiates and starts the Game

### Key Game Mechanics Concepts

Game Loop Implementation

Collision Detection System

User Input Handling

### Further Improvements

### Setup and Deployment
