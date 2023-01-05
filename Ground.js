import Constants from "./constants.js";

export default class Ground {
  constructor(groundEl) {
    this.el = groundEl;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.el).getPropertyValue("--x"));
  }

  set x(value) {
    this.el.style.setProperty("--x", value);
  }

  rect() {
    return this.el.getBoundingClientRect();
  }

  reset() {
    this.x = Constants.OBSTACLE_START_X_POS;
    this.velocity = Constants.OBSTACLE_VELOCITY;
  }
}
