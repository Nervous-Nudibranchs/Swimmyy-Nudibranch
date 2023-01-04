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

    update(delta, action, ground, kelp, octopus) {
        if (action === "jump") {
            this.velocity = constants.JUMP_VELOCITY;
        }
        if (this.velocity < constants.MAX_VELOCITY) {
            this.velocity += constants.ACCELERATION * delta;
        }
        // Rotation based on velocity
        if (this.velocity > 0) {
            this.rotation = "50deg";
        } else if (this.velocity == 0) {
            this.rotation = "0deg";
        } else if (this.velocity < 0) {
            this.rotation = "-50deg";
        }
        console.log(this.velocity);

        if (this.rect().bottom >= ground.rect().top) {
            console.log("Hit the ground!");
            this.reset();
        }

        if (
            this.rect().bottom >= kelp.rect().top &&
            this.rect().right >= kelp.rect().left
        ) {
            console.log("Hit the kelp!");
            this.reset();
        }

        this.y += this.velocity * delta;
    }
}
