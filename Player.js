import constants from "./constants.js";

export default class Player {
    constructor(playerEl, playerImageEl) {
        this.playerEl = playerEl;
        this.playerImageEl = playerImageEl;
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

    get rotation() {
        return parseFloat(
            getComputedStyle(this.playerImageEl).getPropertyValue("--rotation")
        );
    }

    set rotation(value) {
        this.playerImageEl.style.setProperty("--rotation", value);
    }

    rect() {
        return this.playerEl.getBoundingClientRect();
    }

    reset() {
        this.y = constants.PLAYER_START_Y_POS;
        this.rotation = constants.PLAYER_INITIAL_ROTATION;
        this.velocity = constants.INITIAL_VELOCITY;
    }

    move(delta) {
        this.y += this.velocity * delta;
    }

    updateVelocity(delta, action) {
        if (action === "jump") {
            this.velocity = constants.JUMP_VELOCITY;
        }
        if (this.velocity < constants.MAX_VELOCITY) {
            this.velocity += constants.GRAVITY_ACCELERATION * delta;
        }
    }

    updateRotation() {
        // Rotation based on velocity
        if (this.velocity > 0) {
            this.rotation = 50;
        } else if (this.velocity == 0) {
            this.rotation = 0;
        } else if (this.velocity < 0) {
            this.rotation = -50;
        }
    }
}
