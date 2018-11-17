import {Sfx} from "./assets.js";
import { Player } from "./player.js";
import {Game} from "./game.js";

const menu = document.querySelector(".menu");
const pauseMenu = document.querySelector(".pause--menu");
const gameOver = document.querySelector(".game--over");
const exitGameBtn = document.querySelectorAll(".exitGame");
const highscoresListMenu = document.querySelector(".highscoresList-menu");
const highscoreList = document.querySelector("#highscoreList");
const orderedList = document.querySelector("#theList");
const clearListBtn = document.querySelector("#clearList");
const closeHighscores = document.querySelector("#closeHighscores")
const shipControls = document.querySelectorAll(`.settings-menu input[type="text"]`);
const displayCommand = document.querySelectorAll(".displayCommand");
const mainMenuButtons = document.querySelectorAll(".main-menu_buttons");
const soundControl = document.querySelectorAll(".soundControl");



let startingTime, endTime; // Measure time
let pausedTime;

function pauseGame() {
    // Display the pause menu
    pauseMenu.style.display = "flex";

    // Clear the interval for the game
    clearInterval(game);
    clearInterval(enemiesShootingInterval);
    clearInterval(graduallyRestoreInterval);
    clearInterval(countdown);

    // Stop enemies and ship from moving
    game.isStarted = false;

    // Stop enemies from spawning
    enemies.spawned = false;

    // Save the time when game was paused
    pausedTime = Math.floor((new Date() - startingTime) / 1000);
}

// Pause game on ESCAPE and if clicked outside of canvas
window.addEventListener("keydown", e => {
    if(e.keyCode === 27) pauseGame();
})
// window.addEventListener("click", e => {
//     if(e.target.id !== "canvas" && e.target.id !== "continueGame" && game.isStarted) pauseGame();
// })

function continueGame() {
    // Hide the pause menu
    pauseMenu.style.display = "none";

    // Restore intervals
    game = setInterval(draw, 1000 / 60);
    enemiesShootingInterval = setInterval(enemiesShoot, 700);
    graduallyRestoreInterval = setInterval(graduallyRestore, 300);
    timer(secondsLeft);

    // Enable enemies and ship movement
    game.isStarted = true;

    // Enable enemies to spawn
    enemies.spawned = true;

    // Continue measuring time
    pausedTime *= 1000;
}

// Exit the game - reload page.
function exitGame() {
    location.reload();
}

// About menu
const aboutMenu = document.querySelector(".aboutMenu");
let aboutShowed = false;
function displayAbout() {
    if(!aboutShowed) {
        aboutMenu.style.display = "block";
        aboutShowed = !aboutShowed;
    } else {
        aboutMenu.style.display = "none";
        aboutShowed = !aboutShowed;
    }
}

// Highscores menu
function displayHighscores() {
    highscoresListMenu.style.display = "block";
    const getHighscores = JSON.parse(localStorage.getItem("highscoresList"));
    const noHighscoresNote = document.querySelector("#noHighscores");

    if(getHighscores.length === 0) {
        noHighscoresNote.style.display = "block";
    } else {
        noHighscoresNote.style.display = "none";
    }

    // Sort the highscores from top to bottom
    getHighscores.sort((a,b) => (a.score > b.score) ? -1 : 1);

    // Create a new list element for each highscore.
    getHighscores.forEach(highscore => {
        const li = document.createElement("li");
        li.classList.add("highscoreList-items");
        li.innerHTML = `<span id="theName">${highscore.name}</span><span>${highscore.score}</span>`;
        orderedList.appendChild(li);

        if(orderedList.childNodes.length > 0) {
            cleatListBtn.style.display = "inline-block";
        }
    })
}

// Clear highscores list
function clearHighscores() {
    localStorage.removeItem("highscoresList");
    localStorage.removeItem("highscore");

    // While there is a first child in the ordered list, remove the first child.
    while(orderedList.firstChild) {
        orderedList.removeChild(orderedList.firstChild);
    }
}

// Close the highscores menu
function closeHighscoresMenu() {
    highscoresListMenu.style.display = "none";

    // While there is a first child in the ordered list, remove the first child.
    while(orderedList.firstChild) {
        orderedList.removeChild(orderedList.firstChild);
    }
}

// Settings menu (in-game)
const volumeControls = document.querySelectorAll(`.settings-menu input[type="range"]`);
const displayChange = document.querySelectorAll(".displayChange");
let controllingVolume = false;

function controlVolume() {
    if(controllingVolume) {
        displayChange.forEach(change => {
            if(this.name === change.id) {
                change.textContent = this.value + "%";
            }

            // If input name is SFX, edit sfx, otherwise edit music's volume.
            if(this.name === "sfx") {
                sfx.sfxVolume = this.value / 100;
                sfx.playerShooting.volume = sfx.sfxVolume;
                sfx.explosionSound.volume = sfx.sfxVolume;
                sfx.enemyShooting.volume = sfx.sfxVolume;
                sfx.restorationSound.volume = sfx.sfxVolume;
                sfx.alarmSound.volume = sfx.sfxVolume;;
            } else if(this.name =="bgMusic") {
                sfx.musicVolume = this.value / 100;
                sfx.music.volume = sfx.musicVolume;
            }
        })
    }
}

// Change ship's controls
function changeControls(e) {
    e = e || event;
    const key = e.keyCode;
    const code = e.code;

    if(code === "Space") {
        this.value = code;
    } else if (code !== key) {
        this.value = key;
    }

    displayCommand.forEach(command => {
        // Display the command text
        if(this.name === command.id) {
            command.textContent = this.value || key;
        }

        // Change the player's commands
        if(this.name === "left") {
            player.left = key;
        } else if(this.name === "up") {
            player.up = key;
        } else if(this.name === "right") {
            player.right = key;
        } else if(this.name === "down") {
            player.down = key;
        } else if(this.name === "shooting") {
            player.shooting = key;
        } else if(this.name === "useBooster") {
            player.useBooster = key;
        }
    })
}

// Hover on menues
mainMenuButtons.forEach(button => button.addEventListener("mouseover", ()=>{
    sfx.menuMove.currentTime = 0;
    sfx.menuMove.play();
}))

// Select menues
mainMenuButtons.forEach(button => button.addEventListener("click", ()=>{
    sfx.menuSelected.currentTime = 0;
    sfx.menuSelected.play();
}))

// Toggle sfx / music on and off.
soundControl.forEach(control => control.addEventListener("click", ()=>{
    sfx.toggleMusic();
    if(sfx.soundOff) {
        control.src = `../assets/images/soundOff.png`;
    } else {
        control.src = `../assets/images/soundOn.png`;
    }
}));


// Volume control event listeners
volumeControls.forEach(control => control.addEventListener("mousedown",()=> controllingVolume = true));
volumeControls.forEach(control => control.addEventListener("mouseup",()=> controllingVolume = false));
volumeControls.forEach(control => control.addEventListener("change", controlVolume));
volumeControls.forEach(control => control.addEventListener("mousemove", controlVolume));

// Menus event listeners
// document.querySelector("#startGame").addEventListener("click", loadGame);
document.querySelector("#pauseGame").addEventListener("click", pauseGame);
document.querySelector("#continueGame").addEventListener("click", continueGame);
document.querySelector("#restartGame").addEventListener("click", restartGame);
clearListBtn.addEventListener("click", clearHighscores);
closeHighscores.addEventListener("click", closeHighscoresMenu);
exitGameBtn.forEach(exit => exit.addEventListener("click", exitGame));
highscoreList.addEventListener("click", displayHighscores);
document.getElementById("about").addEventListener("click", displayAbout);
document.getElementById("closeAbout").addEventListener("click", displayAbout);

// Ship controls event listeners
shipControls.forEach(control => control.addEventListener("keyup", changeControls));
shipControls.forEach(control => control.addEventListener("click", ()=>this.value = ""));

// Initialize the imported classes
const sfx = new Sfx();
const player = new Player();
// const game = new Game();
