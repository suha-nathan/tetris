/* Keyboard handler class
 * Manages keyboard input
 */
export default class KeyboardController {
  constructor() {
    this.keys = {};
    this.keyRepeatTimers = {}; //timer ID stored for each key
    this.keyRepeatDelay = 150; //initial delay before key repeat in ms
    this.keyRepeatInterval = 50; //interval between repeated key events in ms
    this.keyPressCallback = null; // callback function to trigger game state changes
  }

  /**
   * Set up event listeners for keypress tracking
   * @param {Array} keysToTrack array of key codes to listen to
   */
  initialise(keysToTrack) {
    //initialise all keys to unpressed state
    keysToTrack.forEach((key) => {
      this.keys[key] = false;
      this.keyRepeatTimers[key] = null;
    });

    //add event listeners to window
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  /**
   * handle keydown event
   * @param {KeyboardEvent} event the keyboard event
   */
  handleKeyDown(event) {
    const keyCode = event.code || event.key;

    //if key code is being tracked, handle the keypress event, ignore all other key code press
    if (keyCode in this.keys) {
      event.preventDefault();

      //if the key isn't already down,
      //mark it as down and start the repeat timer
      if (!this.keys[keyCode]) {
        this.keys[keyCode] = true;

        //fire function to trigger inital action on key press
        this.keyPressCallback?.(keyCode);

        //clear any existing timers for keyCode
        if (this.keyRepeatTimers[keyCode]) {
          clearTimeout(this.keyRepeatTimers[keyCode]);
          clearInterval(this.keyRepeatTimers[keyCode]);
          this.keyRepeatTimers[keyCode] = null;
        }

        // key holds longer than keyRepeatDelay(150ms) result in the callback executing every 50ms
        // when the the keyup event is triggered, the timers and intervals are cleared.
        this.keyRepeatTimers[keyCode] = setTimeout(() => {
          //create interval for repeated key presses
          this.keyRepeatTimers[keyCode] = setInterval(() => {
            this.keyPressCallback?.(keyCode);
          }, this.keyRepeatInterval);
        }, this.keyRepeatDelay);
      }
    }
  }

  /**
   * handle key up events
   * @param {KeyboardEvent} event
   */
  handleKeyUp(event) {
    const keyCode = event.code || event.key;

    //if key code is being tracked, handle the keyup event, ignore all other key code press
    if (keyCode in this.keys) {
      event.preventDefault();
      this.keys[keyCode] = false;

      //clear any timers or intervals
      if (this.keyRepeatTimers[keyCode]) {
        clearTimeout(this.keyRepeatTimers[keyCode]);
        clearInterval(this.keyRepeatTimers[keyCode]);
        this.keyRepeatTimers[keyCode] = null;
      }
    }
  }

  /**
   * Set a callback function for key press events
   * @param {Function} callback - function to call when key is pressed (handles game logic)
   */
  setKeyPressCallback(callback) {
    this.keyPressCallback = callback;
  }
}
