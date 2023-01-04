import Player from "./Player.js";

const player = new Player(document.getElementById("player"));

let lastTime = null;

function update(time) {
    console.log("hello");
    if (lastTime) {
        const delta = time - lastTime;
        player.update(delta);
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
