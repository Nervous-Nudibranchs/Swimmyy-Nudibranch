import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import Constants from "./constants.js";

const playerEl = document.getElementById("player");
const playerImageEl = document.getElementById("player-image");
const player = new Player(playerEl, playerImageEl);
const ground = new Obstacle(document.getElementById("ground"));
const octopus = new Obstacle(document.getElementById("octopus"));
const kelp = new Obstacle(document.getElementById("kelp"));

let lastTime = null;
let jumpTimer = null;
let keyPress = false;
let action = "fall";
let obstacleVelocity = Constants.OBSTACLE_VELOCITY;

function update(time) {
    if (lastTime) {
        const delta = time - lastTime;
        kelp.update(delta, obstacleVelocity);
        octopus.update(delta, obstacleVelocity);
        player.update(delta, action, ground, kelp, octopus);
        if (action === "jump" || jumpTimer > 0) {
            action = "fall";
            jumpTimer -= 1;
        }
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

/* Call function on specific key press */
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        console.log("Space Key pressed!");
        if (!jumpTimer && keyPress === false) {
            jumpTimer = 10;
            action = "jump";
            keyPress = true;
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === " ") {
        console.log("Space Key unpressed!");
        keyPress = false;
    }
});
