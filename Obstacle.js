export default class Obstacle {
    constructor(groundEl) {
        this.el = groundEl;
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
        this.x = constants.PLAYER_START_Y_POS;
    }

    update(delta, velocity) {
        // Move to the left
        this.x -= velocity * delta;
    }
}
