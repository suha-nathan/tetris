/**
 * Tetris Game
 * Initialize the game when the window loads
 */
window.onload = () => {
  // Create and start the game
  const tetris = new TetrisGame("game-map");

  tetris.start();
};
