/**
 * Tetris Game
 * Initialize the game when the window loads
 */
import { Game } from "./Game.js";

window.onload = () => {
  // Create and start the game
  const tetris = new Game("game-map");

  tetris.start();
};
