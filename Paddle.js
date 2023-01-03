const INITIAL_DIRECTION = { x: 0, y: 0 };
const JUMP_DURATION = 20;
const xVelocity = 0.05;
let yVelocity = 0.08;

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.paddleElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.paddleElem.style.setProperty("--y", value);
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  setDirection(keyPressed) {
    if (!keyPressed) {
      this.direction.x = 0;
    }

    if (keyPressed.includes('d')) {
      this.direction.x = 1;
    }

    if (keyPressed.includes('a')) {
      this.direction.x = -1;
    }

    if (keyPressed.includes('w') && this.grounded) {
      this.jumpState = true;
    }
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = INITIAL_DIRECTION;
    this.grounded = false;
  }

  update(delta, keyPressed, groundRect) {
    const paddleRect = this.rect();

    this.setDirection(keyPressed);
    this.x += this.direction.x * xVelocity * delta;
    this.y += this.direction.y * yVelocity * delta;

    /* Gravity */
    if (paddleRect.bottom < groundRect.top) {
      console.log(paddleRect.bottom, groundRect.top);
      this.grounded = false;
      if (this.direction.y != 1)
        this.direction.y += .04;
    }

    /* Grounded */
    if (paddleRect.bottom > groundRect.top && !this.jumpState) {
      this.direction.y = 0;
      this.velocity = 0;
      this.grounded = true;
      this.y = 60;
    }

    /* Jumping */
    if (this.jumpState) {
      // Initial Jump Frame
      if (this.grounded) {
        this.direction.y = -1;
        this.grounded = false;
        this.jumpTime = JUMP_DURATION;
      }
      // Decrementing jumpTime
      this.jumpTime -= 1;
      if (this.jumpTime <= 0) {
        this.jumpTime = 0;
        this.jumpState = false;
      }
      console.log("Jumping! Direction.y: " + this.direction.y);
    }

    /* Wall */
    if (paddleRect.left >= window.innerWidth) {
      this.x = 1;
    } else if (paddleRect.left <= 0) {
      this.x = 99;
    }
  }
}
