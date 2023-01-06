import Constants from "./constants.js";

export default class Obstacle {
    constructor(element) {
        this.el = element;
        this.x = Constants.OBSTACLE_START_X_POS;
        this.velocity = Constants.OBSTACLE_VELOCITY;
        this.passed = false;
    }

    get x() {
        return parseFloat(getComputedStyle(this.el).getPropertyValue("--x"));
    }

    set x(value) {
        this.el.style.setProperty("--x", value);
    }

    obstacleBounds() {
        const bounds = {
            octopus: this.el.querySelector("#octopus").getBoundingClientRect(),
            kelp: this.el.querySelector("#kelp").getBoundingClientRect(),
        };
        return bounds;
    }

    coinBounds() {
        return this.el.querySelector("#coin-container").getBoundingClientRect();
    }

    containerBounds() {
        return this.el.getBoundingClientRect();
    }

    move(delta) {
        // Move to the left
        this.x -= this.velocity * delta;
    }
}
