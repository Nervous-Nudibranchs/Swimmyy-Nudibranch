import Constants from "./constants.js";

export default class Ground {
    constructor(element) {
        this.el = element;
        this.x = Constants.BACKGROUND_START_X_POS;
        this.velocity = Constants.OBSTACLE_VELOCITY;
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

    move(delta) {
        // Move to the left
        this.x -= this.velocity * delta;
    }
}
