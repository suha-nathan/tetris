# Tetris
The game is accessible at [this](suha-nathan.github.io/tetris/) github page. 

### Project Overview

Tetris is a game that requires game players to control game pieces to arrange them in complete horizontal lines to gain points.

Main technologies used - Javascript, HTML Canvas.
No external npm packages or external libraries used.

Main Development Goal - To try to reverse engineer a simple game of tetris into its constituent components. Some questions that came to me when designing the game:

- How do I represent a termino in code?
- How do I rotate a game piece algorithmically?
- How to gracefully handle the varuous game state changes and render the game board, pieces smoothly?
- Would it be possible to design it in an object oriented way such that the various components of the game mechanics are not entangled in spaghetti code.

#### The game board:

- Grid of squares (rows and columns) that define the play boundaries
- Game pieces start at the top of the game board and continuously moves toward the bottom
- Game board displays the locked game pieces that have fallen to the bottom

#### The game piece (aka Termino/Tetromino):

- Various shaped pieces that can be moved left, right, `down and rotated.
- Has a downward speed that increases as score/level increases. This increases the difficulty of the game as the player increases their score
- Game Pieces are "placed" or "locked" into the game board when they cannot move further down the game board. This could either be because the piece reached the bottom of the game board or the piece is blocked from moving further down by a another locked game piece.
- New random shapes are generated once a piece is placed at the bottom of the game board

#### How to Gain Points:

- Player moves and/or rotates the game piece to arrange it into complete horizontal lines along the game board.
- Once a complete line is made, line is cleared and points are added to the player total.

#### Game Over Condition:

- If a game piece collides with the top of the game board, this ends the game.
- This requires continuous clearing of lines on the game board

### Component Based Design File Structure:

- `Game.js`: Core game state management loop
- `GameBoard.js`: Game board and grid management
- `Termino.js`: Piece representation and movement/rotation
- `KeyboardController.js`: Keyboard input handling
- `index.js`: Instantiates and starts the Game

### Key Game Mechanics

#### Game Loop Implementation

Utilised the `requestAnimationFrame` method from the `Window` interface to continuously update the state within the game loop. The Canvas API was used to render the graphics on every loop. This allowed for the use of Javascript and the `<canvas>` in the HTML to render the tetris game.

The timing and smooth animation of the tetris movement is controlled within the game loop by keeping track of the time intervals and time elapsed during each frame update.

#### Collision Detection and Game State

- Every time the termino is moved or rotated, the game checks if the termino's future position is 1. within the boundaries of the game board and 2. not occupied by a termino that was previously placed. The game maintains a 2D grid representation of the occupied spaces that allows the game algorithm to calculate the possibility of termino placement.
- Whenever the termino is rotated, there is a possibility that it cannot be rotated if it's positioned against the left or right walls (wall collision during rotation). If a shift away from the walls is required for rotation, the termino is both shifted and rotated.
- Game state is tracked via pause and game over states. This allows the main game loop to continuously check for these flags to appropriately handle and trigger UI changes. The score, level and lines cleared are also tracked as states and speed of gameplay increased appropriately on each game loop.

#### User Input Handling

The user input is handled via attaching `keydown` and `keyup` event listeners on the `window` object. This is initiated when the game starts and is handled by an instance of the `KeyboardController` class. This controller maintains the state of what key is pressed.

This controller filters only the specific keys that are being listened to (up, down, left, right, pause and spacebar), ignoring all other key presses. This executes a callback function that is defined separately by the `Game` object that determines the specific actions to take.

The controller also maintains key repeat and interval timers to handle users repeatedly pressing the rotate (spacebar/up) key for example. This is to ensure the rotation occurs smoothly and there is no "sticking".
The keyboard behaviour is characterised by:

- short presses trigger a single action, i.e.rotation and movement
- holding a key down longer starts repeated actions (continuous rotation or movement down/left/right)
- releasing the key immediately stops all repeated actions

### Further Improvements

The current class implementation is does not achieve full encapsulation e.g. the Game class has direct access to and can modify the Termino class parameters such as position and rotation. Further improvements could involve ensuring privacy of class parameters and type checking via TypeScript.

### Setup and Deployment

The game is accessible [here](suha-nathan.github.io/tetris/).
Alternatively, download the project files into a folder and in the cmd line, start a server.

```
# Install http-server globally if you don't have it
npm install -g http-server

# Navigate to your project directory and run
http-server
```
