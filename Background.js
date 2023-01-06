import Constants from "./constants.js";

export default class Background {
    constructor(element) {
        this.el = element;
        this.x = Constants.BACKGROUND_START_X_POS;
        this.velocity = Constants.BACKGROUND_VELOCITY;
    }

    get x() {
        return parseFloat(getComputedStyle(this.el).getPropertyValue("--x"));
    }

    set x(value) {
        this.el.style.setProperty("--x", value);
    }

    move(delta) {
        // Move to the left
        this.x -= this.velocity * delta;
    }
}
