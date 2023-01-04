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

    update(delta) {}
}
