import Player from "./Player.js";

const player = new Player(document.getElementById("player"));

let lastTime = null;
let jumpTimer = null;
let keyPress = false;
let action = "fall";

function update(time) {
    if (lastTime) {
        const delta = time - lastTime;
        player.update(delta, action);
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
