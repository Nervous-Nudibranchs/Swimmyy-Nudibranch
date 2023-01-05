export default class Ground {
    constructor(groundEl) {
        this.el = groundEl;
    }

    rect() {
        return this.el.getBoundingClientRect();
    }
}
