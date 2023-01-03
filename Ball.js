const INITIAL_VELOCITY = .03;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    return this.ballElem.getBoundingClientRect()
  }

  reset() {
    this.x = 50;
    this.y = 20;
    this.direction = { x: 0 };
    while (Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= .9) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
    }
    this.velocity = INITIAL_VELOCITY;
    console.log(this.direction);
  }

  update(delta, paddleRect, groundRect) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    const ballRect = this.rect();

    this.direction.y += .08;
    this.direction.x *= .999;

    /* Grounded */
    if (ballRect.bottom >= groundRect.top) {
      this.direction.y *= -0.9;
      this.velocity *= .90;
    }

    /* Wall */
    if (ballRect.left >= window.innerWidth) {
      this.x = 0;
    } else if (ballRect.right <= 0) {
      this.x = 100;
    }

    // if (paddleCollision(ballRect, paddleRect)) {
    //   this.direction.x *= -0.9;
    // }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function paddleCollision(ballRect, paddleRect) {
  return (ballRect.left <= paddleRect.right)
    // && ballRect.top <= paddleRect.bottom
    // && ballRect.bottom >= paddleRect.top)
    ;
}
