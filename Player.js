import constants from "./constants.js";

export default class Player {
    constructor(playerEl) {
        this.playerEl = playerEl;
        this.reset();
    }

    get y() {
        return parseFloat(
            getComputedStyle(this.playerEl).getPropertyValue("--y")
        );
    }

    set y(value) {
        this.playerEl.style.setProperty("--y", value);
    }

    reset() {
        this.y = constants.PLAYER_START_Y_POS;
        this.velocity = constants.INITIAL_VELOCITY;
    }

    update(delta, action) {
        if (action === "jump") {
            this.velocity = constants.JUMP_VELOCITY;
        }
        if (this.velocity < constants.MAX_VELOCITY) {
            this.velocity += constants.ACCELERATION * delta;
        }
        this.y += this.velocity * delta;
    }
}
