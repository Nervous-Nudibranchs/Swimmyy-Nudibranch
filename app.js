import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import Constants from "./constants.js";
import { renderObstacle } from "./render-utils.js";
import Ground from "./Ground.js";

const song = new Audio("./assets/Swimmy_Nudibranch_Theme.flac");
song.volume = 0.9;
song.loop = true;
const flapSound = new Audio("./assets/Flap.wav");
flapSound.volume = 0.9;
const dieSound = new Audio("./assets/Die.wav");

const playerEl = document.getElementById("player");
const playerImageEl = document.getElementById("player-image");
const player = new Player(playerEl, playerImageEl);
const ground = new Ground(document.getElementById("ground"));
const gameWindow = document.getElementById("game-window");

let gameStarted = false;
let lastTime = null;
let jumpTimer = null;
let keyPress = false;
let action = "fall";
let obstacles = [];
let createObstacleDelay = Constants.CREATE_OBSTACLE_DELAY;
// let kelpType = [];

function update(time) {
    if (lastTime) {
        // Update time interval
        const delta = time - lastTime;

        if (gameStarted === true) {
            // Move Obstacles
            if (obstacles) {
                for (const obstacle of obstacles) {
                    obstacle.move(delta);
                }
            }

            // Move Player
            player.updateVelocity(delta, action);
            player.move(delta);
            player.updateRotation();

            // Check for collisions between player and obstacles
            checkCollisions(player.rect(), ground.rect());
            for (const obstacle of obstacles) {
                const boundaries = obstacle.rect();
                checkCollisions(player.rect(), boundaries.kelp);
                checkCollisions(player.rect(), boundaries.octopus);
            }

            // Check for user inputs and update state accordingly
            if (action === "jump" || jumpTimer > 0) {
                action = "fall";
                jumpTimer -= 1;
            }
            createObstacleDelay -= 1;
            if (createObstacleDelay === 0) {
                createObstacles();
            }
        }
    }
    lastTime = time;
    window.requestAnimationFrame(update);
}

window.addEventListener("load", () => {
    /* COMMENT OUT TO STOP */
    createObstacles();
    window.requestAnimationFrame(update);
});

/* Call function on specific key press */
document.addEventListener("keydown", (e) => {
    song.play();
    if (e.key === " ") {
        console.log("Space Key pressed!");
        if (gameStarted === false) {
            startGame();
        } else if (!jumpTimer && keyPress === false) {
            jumpTimer = 10;
            action = "jump";
            keyPress = true;
            flapSound.play();
        }
    } else if (e.key === "Escape") {
        console.log("Escape Key pressed!");
        if (gameStarted === true) {
            stopGame();
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === " ") {
        console.log("Space Key unpressed!");
        keyPress = false;
    }
});

function startGame() {
    song.volume = 0.9;
    gameStarted = true;
}

function stopGame() {
    song.volume = 0.3;
    gameStarted = false;
}

function resetGame() {
    player.reset();
    for (const obstacle of obstacles) {
        obstacle.el.remove();
    }
    // const thing = gameWindow.querySelectorAll(".obstacle");
    // console.log("thing: ", thing);
    obstacles = [];
    createObstacleDelay = Constants.CREATE_OBSTACLE_DELAY;
}

function checkCollisions(rect1, rect2) {
    if (
        rect1.right > rect2.left &&
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    ) {
        console.log("collision");
        dieSound.play();
        resetGame();
    }
}

function createObstacles() {
    const randomType = "short";
    const obstacleContainer = new Obstacle(renderObstacle(randomType));
    gameWindow.append(obstacleContainer.el);
    obstacles.push(obstacleContainer);
}
