
export default class Ground {
  constructor(groundElem) {
    this.groundElem = groundElem;
    this.reset();
  }

  get position() {
    return parseFloat(getComputedStyle(this.groundElem).getPropertyValue("--position"));
  }

  set position(value) {
    this.groundElem.style.setProperty("--position", value);
  }

  rect() {
    return this.groundElem.getBoundingClientRect();
  }

  reset() {
    this.position = 55;
  }
}
