import Constants from "./constants.js";

export default class Obstacle {
  constructor(element) {
    this.el = element;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.el).getPropertyValue("--x"));
  }

  set x(value) {
    this.el.style.setProperty("--x", value);
  }

  rect() {
    const boundaries = {
      octopus: this.el.querySelector("#octopus").getBoundingClientRect(),
      kelp: this.el.querySelector("#kelp").getBoundingClientRect(),
    };
    console.log(boundaries);
    return boundaries;
  }

  reset() {
    this.x = Constants.OBSTACLE_START_X_POS;
    this.velocity = Constants.OBSTACLE_VELOCITY;
  }

  move(delta) {
    // Move to the left
    this.x -= this.velocity * delta;
  }
}
