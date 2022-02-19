export class Controller {
  left = false;
  right = false;
  up = false;
  down = false;

  constructor() {
    this.keyListener = this.keyListener.bind(this);
  }

  public init() {
    window.addEventListener("keydown", this.keyListener)
    window.addEventListener("keyup", this.keyListener);
  }

  keyListener(event: KeyboardEvent) {
    const key_state = event.type === "keydown";

    switch (event.key) {
      case 'ArrowLeft':// left key
        this.left = key_state;
        break;
      case 'ArrowUp':// up key
        this.up = key_state;
        break;
      case 'ArrowDown':// down key
        this.down = key_state;
        break;
      case 'ArrowRight':// right key
        this.right = key_state;
        break;
    }
  }
}
