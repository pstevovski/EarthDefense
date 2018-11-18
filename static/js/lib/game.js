import {player} from "./player.js";
import {enemies} from "./enemies.js";

// TESTING
// Path to the files for easier use on github repo
const fullPath = window.location.pathname;
const splitPath = fullPath.split('/');
if (splitPath[splitPath.length - 1] == 'index.html') {
	splitPath.pop();
}
const endPath = splitPath.length > 2 ? splitPath.join('/') : '';
// TESTING

export class Game {
    constructor() {
        this.canvas = document.querySelector("#canvas");
        this.displayKills = document.querySelector("#killCount");
        this.currentExp = document.querySelector("#currentExp");
        this.requiredExpText = document.querySelector("#requiredExp");
        this.levelBar = document.querySelector(".level-bar_fill");
        this.notificationText = document.querySelector(".notification");
        this.timerDisplay = document.querySelector("#timerDisplay");
        this.ctx = this.canvas.getContext("2d");
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        this.minHeight = 0;
        this.maxHeight = 500;
        this.requiredExp = 80;
        this.endTime;
        this.startingTime;
        this.score = 0;
        this.init;
        this.isStarted = false;


        // Time
        this.time = 30;
        this.secondsLeft;
        this.countdown;

        // Scores
        this.highscore = localStorage.getItem("highscore");

    }

    // Start the game
    // startGame() {
    //     this.isStarted = true;
    //     this.player = new Player(this);
    // }

    // Update kills and experience when user kills an enemy
    updateKillcount() {
        player.killCount++;
        this.displayKills.textContent = player.killCount;

        player.exp += 20;
        this.currentExp.textContent = player.exp;

        // When required exp is met, level up
        if(player.exp === this.requiredExp) {
            player.exp = 0;
            this.requiredExp = this.requiredExp * 2;
            this.currentExp.textContent = player.exp;
            this.requiredExpText.textContent = this.requiredExp + "XP";
            player.levelUp();
        }
        let levelExp = (player.exp / this.requiredExp) * 100;
        this.levelBar.style.width = `${levelExp}%`;
    }

    // Increase game's difficulty as time goes by
    increaseDifficulty() {
        this.endTime = new Date();

        let timeCurrent = Math.floor((this.endTime - this.startingTime) / 1000);

        if(timeCurrent === 30) {
            enemies.speed = 2;
            enemies.shootingSpeed = 400;
            this.displayNotification();
        } else if (timeCurrent === 60) {
            enemies.speed = 4;
            enemies.shootingSpeed = 300;
            this.displayNotification();
        } else if (timeCurrent === 90) {
            enemies.speed = 8;
            enemies.shootingSpeed = 200;
            this.displayNotification();
        } else if (timeCurrent === 200) {
            enemies.speed = 10;
            enemies.shootingSpeed = 100;
            this.displayNotification();
        }
    }

    // Display notifications
    displayNotification(secondsLeft) {
        this.notificationText.classList.add("activeNotification");

        if(player.killCount === 30) {
            this.notificationText.innerHTML = `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
        } else if (player.killCount === 50) {
            this.notificationText.innerHTML= `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
        } else if (player.killCount === 80) {
            this.notificationText.innerHTML= `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
        } else if (player.killCount === 100) {
            this.notificationText.innerHTML= `<i class="material-icons">warning</i> <p>Another Disturbance, you're doing great!</p>`
        }

        // If there are 10 seconds left, show a warning for low time
        if(secondsLeft === 10) {
            this.notificationText.innerHTML = `<i class="material-icons">warning</i><p>Few seconds left!</p>`
        }

        // Remove the notification active class after 4 seconds
        setTimeout(() => {
            this.notificationText.classList.remove("activeNotification");
        }, 4000);
    }

    // Timer
    timer(secondsLeft){
        clearInterval(this.countdown);

        const now = Date.now();
        const then = now + this.time * 1000;
        this.displayTimeLeft(this.time);

        this.countdown = setInterval(() =>{
            this.secondsLeft = Math.round((then - Date.now()) / 1000);
            // Show a warning for few seconds left
            if(this.secondsLeft === 10) {
                this.timerDisplay.classList.add("timeLow");
                this.displayNotification(this.secondsLeft);
            } else if (this.secondsLeft < 0) {
                // If the timer ran out, end the game
                clearInterval(this.countdown);
                clearInterval(game);
                this.endgame(this.secondsLeft);
                return;
            }
            this.displayTimeLeft(this.secondsLeft);
        }, 1000)
    }

    // Display time left
    displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainder = seconds % 60;
        this.timerDisplay.textContent = `${minutes}:${remainder < 10 ? 0 : ""}${remainder}`;
        console.log(seconds);
    }

    // Add playtime when user picks up timer
    addPlaytime() {
        let minTime = 8;
        let maxTime = 12;
        minTime = Math.ceil(minTime);
        maxTime = Math.floor(maxTime);
        let spawnTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        this.secondsLeft = this.secondsLeft + spawnTime;
        this.timer(secondsLeft);
        document.querySelector(".time").classList.add("timeShake");
        // When time is added and timer is higher than 10 seconds, remove classt (remove red color).
        if (this.secondsLeft > 10) {
            this.timerDisplay.classList.remove("timeLow");
        }
        notificationText.innerHTML = `<i class="material-icons timer">timer</i><p>Added playtime!</p>`;
        this.displayNotification();
    }

    // New score
    newScore(finalScore) {
        const inputMenu = document.querySelector(".newHighscore-input");
        const scoreText = document.querySelector("#scoreText");
        const inputField = document.querySelector("#playerName-input");
        const saveBtn = document.querySelector("#savePlayer");
        inputMenu.style.display = "flex";

        // Display different message according to the score
        if(finalScore > this.highscore) {
            scoreText.innerHTML = `<h2 class="newHighscore-notification">NEW HIGHSCORE !!! </h2>`;
        } else {
            scoreText.innerHTML = `<h2>NOT BAD</h2>`;
        }

        // Save player's name and score to local storage
        saveBtn.addEventListener("click", () => {
            const value = inputField.value;
            const results = {
                name: value,
                score: finalScore
            }
            let highscoresArray =  JSON.parse(localStorage.getItem("highscoresList")) || [];
            highscoresArray.push(results);
            localStorage.setItem("highscoresList", JSON.stringify(highscoresArray));

            // Hide the menu
            inputMenu.style.display = "none";
        })
    }
    // New Highscore
    newHighscore() {
        const emptyWarningText = document.querySelector(".emptyWarning-text");

        // Display notification that a new highscore was set!
        emptyWarningText.textContent = "NEW HIGHSCORE !!!";
        emptyWarningText.classList.add("emptyWarning-Highscore");

        // Remove the notification
        setTimeout(() => {
            emptyWarningText.classList.remove("emptyWarning-Highscore");
        }, 2000);
    }
}
export const game = new Game();

// Event listeners
// document.querySelector("#startGame").addEventListener("click", game.loadGame);
