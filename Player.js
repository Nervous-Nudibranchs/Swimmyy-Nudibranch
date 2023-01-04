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
        this.updateVelocity(delta, action);
        this.updateRotation();
        this.checkCollisions(ground);
        this.checkCollisions(kelp);
        this.checkCollisions(octopus);
        this.move(delta, this.velocity);
    }

    move(delta, velocity) {
        this.y += velocity * delta;
    }

    updateVelocity(delta, action) {
        if (action === "jump") {
            this.velocity = constants.JUMP_VELOCITY;
        }
        if (this.velocity < constants.MAX_VELOCITY) {
            this.velocity += constants.ACCELERATION * delta;
        }
    }

    updateRotation() {
        // Rotation based on velocity
        if (this.velocity > 0) {
            this.rotation = "50deg";
        } else if (this.velocity == 0) {
            this.rotation = "0deg";
        } else if (this.velocity < 0) {
            this.rotation = "-50deg";
        }
    }

    checkCollisions(obstacle) {
        const playerRect = this.rect();
        const obstacleRect = obstacle.rect();

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            console.log("collision");
            this.reset();
        }
    }
}
