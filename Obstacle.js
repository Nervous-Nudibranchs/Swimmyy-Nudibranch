import Constants from "./constants.js";

export default class Obstacle {
    constructor(element) {
        this.el = element;
        this.x = Constants.OBSTACLE_START_X_POS;
        this.velocity = Constants.OBSTACLE_VELOCITY;
        this.point = true;
    }

    get x() {
        return parseFloat(getComputedStyle(this.el).getPropertyValue("--x"));
    }

    set x(value) {
        this.el.style.setProperty("--x", value);
    }

    obstacleBoundaries() {
        const boundaries = {
            octopus: this.el.querySelector("#octopus").getBoundingClientRect(),
            kelp: this.el.querySelector("#kelp").getBoundingClientRect(),
        };
        return boundaries;
    }

    containerBoundaries() {
        return this.el.getBoundingClientRect();
    }

    move(delta) {
        // Move to the left
        this.x -= this.velocity * delta;
    }
}
