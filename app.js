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
const coinSound = new Audio("./assets/coin.wav");

const playerEl = document.getElementById("player");
const playerImageEl = document.getElementById("player-image");
const player = new Player(playerEl, playerImageEl);
const ground = new Ground(document.getElementById("ground"));
const gameWindow = document.getElementById("game-window");
const scoreEl = document.getElementById("score");
const soundBtn = document.getElementById("sound-btn");
const soundBtnImg = document.getElementById("sound-btn-image");
const pauseIcon = document.getElementById("pause");

let score = 0;
let gameStarted = false;
let soundOn = true;
let lastTime = null;
let jumpTimer = null;
let keyPress = false;
let action = "fall";
let obstacles = [];
let createObstacleDelay = Constants.CREATE_OBSTACLE_DELAY;
let kelpTypes = ["long", "med", "short"];

// Executes every frame
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

            // Check for collisions between player and ground
            const playerBounds = player.rect();
            let obsCollision = false;
            if (checkCollisions(playerBounds, ground.rect(), "obstacle")) {
                obsCollision = true;
                playSound(dieSound);
                resetGame();
            }

            // Check for collisions between player and obstacles
            if (!obsCollision) {
                for (const obstacle of obstacles) {
                    const containerBounds = obstacle.containerBounds();
                    const kelpBounds = obstacle.obstacleBounds().kelp;
                    const octopusBounds = obstacle.obstacleBounds().octopus;
                    if (
                        checkCollisions(playerBounds, kelpBounds, "obstacle") ||
                        checkCollisions(playerBounds, octopusBounds, "obstacle")
                    ) {
                        obsCollision = true;
                        playSound(dieSound);
                        resetGame();
                    }

                    // Check if current obstacle isn't passed && score it
                    if (
                        !obsCollision &&
                        obstacle.passed === false &&
                        checkCollisions(
                            playerBounds,
                            containerBounds,
                            "addScore"
                        )
                    ) {
                        playSound(coinSound);
                        score++;
                        obstacle.passed = true;
                    }
                }

                // Check for user inputs and update state accordingly
                if (action === "jump" || jumpTimer > 0) {
                    action = "fall";
                    jumpTimer -= 1;
                }
                createObstacleDelay -= 1;
                if (createObstacleDelay === 0) {
                    console.log("Creating obstacle");
                    createObstacles();
                }
            }
        }
    }
    playSound(song);
    displayScore();
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
    if (e.key === " ") {
        console.log("Space Key pressed!");
        if (gameStarted === false) {
            startGame();
        } else if (!jumpTimer && keyPress === false) {
            jumpTimer = 10;
            action = "jump";
            keyPress = true;
            playSound(flapSound);
        }
    } else if (e.key === "Escape") {
        console.log("Escape Key pressed!");
        if (gameStarted === true) {
            stopGame();
        } else {
            startGame();
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === " ") {
        console.log("Space Key unpressed!");
        keyPress = false;
    }
});

soundBtn.addEventListener("click", (e) => {
    e.preventDefault();
    soundBtn.blur();
    if (soundOn) {
        soundBtnImg.src = "./assets/speaker-off.png";
        soundOn = false;
    } else {
        soundBtnImg.src = "./assets/speaker-on.png";
        soundOn = true;
    }
    console.log("soundOn: ", soundOn);
});

function startGame() {
    pauseIcon.classList.add("hidden");
    song.volume = 0.9;
    gameStarted = true;
}

function stopGame() {
    pauseIcon.classList.remove("hidden");
    song.volume = 0.3;
    gameStarted = false;
}

function displayScore() {
    scoreEl.textContent = score;
}

function playSound(sound) {
    if (!soundOn) sound.pause();
    else sound.play();
}

function resetGame() {
    score = 0;
    player.reset();
    for (const obstacle of obstacles) {
        obstacle.el.remove();
    }
    obstacles = [];
    createObstacleDelay = Constants.CREATE_OBSTACLE_DELAY;
    createObstacles();
}

function checkCollisions(rect1, rect2) {
    return (
        rect1.right > rect2.left &&
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function createObstacles() {
    const randomNumber = Math.floor(Math.random() * kelpTypes.length);
    const randomType = kelpTypes[randomNumber];
    console.log(`Generating a ${randomType} kelp:`);
    const obstacleContainer = new Obstacle(renderObstacle(randomType));
    gameWindow.append(obstacleContainer.el);
    obstacles.push(obstacleContainer);
    createObstacleDelay = Constants.CREATE_OBSTACLE_DELAY;
}
