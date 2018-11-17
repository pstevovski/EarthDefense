import {player} from "./player.js";
import {enemies} from "./enemies.js";

export class Game {
    constructor() {
        this.canvas = document.querySelector("#canvas");
        this.displayKills = document.querySelector("#killCount");
        this.currentExp = document.querySelector("#currentExp");
        this.requiredExpText = document.querySelector("#requiredExp");
        this.levelBar = document.querySelector(".level-bar_fill");
        this.notificationText = document.querySelector(".notification");
        this.ctx = this.canvas.getContext("2d");
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        this.minHeight = 0;
        this.maxHeight = 500;
        this.isStarted = true;
        this.requiredExp = 80;
        this.endTime;
        this.startingTime;
    }
    
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
        console.log(this.requiredExp, player.exp, player.killCount);
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
}
export const game = new Game();


////////////////////////////////////////////////////////////////////////////////////////////
// let game;
// let highscore = localStorage.getItem("highscore");
// // let startingTime, endTime; // Measure time
// // let pausedTime;
// let gameStarted = false;
// const canvas = document.querySelector("#canvas");
// // const ctx = canvas.getContext("2d");
// // const cWidth = canvas.width;
// // const cHeight = canvas.height;
// // const minHeight = 0;
// // const maxHeight = 500;
// // Health renew
// // let healthRenew = [];
// // healthRenew[0] = {
// //     x: cWidth,
// //     y: Math.floor(Math.random() * ( (maxHeight - firstAid.height) - minHeight) + minHeight)
// // }
// // let initialHealthPushed = false;

// // // Shield - player ship shield renewal
// // let shieldRenew = [];
// // shieldRenew[0] = {
// //     x: cWidth,
// //     y: Math.floor(Math.random() * ( (maxHeight - shieldImage.height) - minHeight) + minHeight)
// // }
// // let initialShieldRenewPushed = false;

// // // Timer(s) array
// // let timeRenew = [];
// // timeRenew[0] = {
// //     x: cWidth,
// //     y: Math.floor(Math.random() * ( (maxHeight - timerImage.height) - minHeight) + minHeight)
// // }
// // let initialTimeRenewPushed = false;
// let countdown;
// // const timerDisplay = document.querySelector("#timerDisplay");
// // const time = 30;
// let secondsLeft;
// // function timer(seconds) {
// //     clearInterval(countdown);

// //     const now = Date.now();
// //     const then = now + seconds * 1000;
// //     displayTimeLeft(seconds);

// //     countdown = setInterval(() =>{
// //         secondsLeft = Math.round((then - Date.now()) / 1000);
// //         // Show a warning for few seconds left
// //         if(secondsLeft === 10) {
// //             timerDisplay.classList.add("timeLow");
// //             displayNotification(secondsLeft);
// //         } else if (secondsLeft < 0) {
// //             // If the timer ran out, end the game
// //             clearInterval(countdown);
// //             clearInterval(game);
// //             endgame(secondsLeft);
// //             return;
// //         }
// //         displayTimeLeft(secondsLeft);
// //     }, 1000)
// // }
// function displayTimeLeft(seconds) {
// //     const minutes = Math.floor(seconds / 60);
// //     const remainder = seconds % 60;
// //     timerDisplay.textContent = `${minutes}:${remainder < 10 ? 0 : ""}${remainder}`;
// // }
// // // Add additional playtime
// // function addPlaytime() {
// //     let minTime = 8;
// //     let maxTime = 12;
// //     minTime = Math.ceil(minTime);
// //     maxTime = Math.floor(maxTime);
// //     let spawnTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

// //     secondsLeft = secondsLeft + spawnTime;
// //     timer(secondsLeft);
// //     document.querySelector(".time").classList.add("timeShake");
// //     // When time is added and timer is higher than 10 seconds, remove classt (remove red color).
// //     if (secondsLeft > 10) {
// //         timerDisplay.classList.remove("timeLow");
// //     }
// //     notificationText.innerHTML = `<i class="material-icons timer">timer</i><p>Added playtime!</p>`;
// //     displayNotification();
// //  }
// function increaseDifficulty() {
// //     endTime = new Date();
//     let timeCurrent = Math.floor( (endTime - startingTime) / 1000);

//     if(timeCurrent === 30) { // After 30 seconds
//         enemySpeed = 2;
//         enemiesShootingSpeed = 400;
//         displayNotification();
//     } else if(timeCurrent === 60) { // After 60 seconds
//         enemySpeed = 5;
//         enemiesShootingSpeed = 300;
//         displayNotification();
//     } else if(timeCurrent === 90) { // After 90 seconds
//         enemySpeed = 8;
//         enemiesShootingSpeed = 200;
//         displayNotification();
//     } else if(timeCurrent === 120) { // After 120 seconds
//         enemySpeed = 10;
//         enemiesShootingSpeed = 100;
//         displayNotification();
//     }
// }
// Display notifications
// function displayNotification(secondsLeft){
//     notificationText.classList.add("activeNotification");
//     if(killCount === 30) {
//         notificationText.innerHTML = `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
//     } else if (killCount === 50) {
//         notificationText.innerHTML= `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
//     } else if (killCount === 80) {
//         notificationText.innerHTML= `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
//     } else if (killCount === 100) {
//         notificationText.innerHTML= `<i class="material-icons">warning</i> <p>Another Disturbance, you're doing great!</p>`
//     }

//     // If there are 10 seconds left, show a warning
//     if(secondsLeft === 10) {
//         notificationText.innerHTML = `<i class="material-icons">warning</i><p>Few seconds left!</p>`
//     }

//     // Remove the class after 4 seconds
//     setTimeout(() => {
//         notificationText.classList.remove('activeNotification');
//     }, 4000);
// }
// function endgame(secondsLeft){
//     // Disable intervals
//     clearInterval(enemiesShootingInterval);
//     clearInterval(graduallyRestoreInterval);
//     clearInterval(countdown);

//     // End measuring time
//     endTime = new Date();

//     // Divide the difference to get milliseconds.
//     let timeDifference = (endTime - startingTime) / 1000;

//     let timePlayed = Math.round(timeDifference);
//     // Multiplie the ending score by the time played divided by 100, which will result in a multiplier
//     // in the form of, for example x0.5 - x3, based on time played
//     let multiplier = timePlayed / 100;
//     score = killCount * 100;
//     let finalScore = score + (score * multiplier);

//     // Stop movements
//     gameStarted = false;

//     // Game Over / Game finished menu
//     gameOver.style.display = "block";

//     // If player was killed.
//     if(player.hp === 0){
//         displayImage.src = `${endPath}/assets/images/tombstone.png`;
//         message.textContent = "At least you tried...";
//     }
//     if(secondsLeft <= 0) {
//         message.textContent = "Time's up !"
//     }
    
//     music.src = `${endPath}/assets/audio/Fallen in Battle.mp3`;
//     music.volume = 0.2;
//     music.play();
//     music.loop = false;

//     // Score and Highscore
//     document.querySelector("#totalKills").textContent = killCount;
//     document.querySelector("#multiplier").textContent = "x"+multiplier;
//     document.querySelector("#finalScore").textContent = finalScore;
//     document.querySelector("#highscore").textContent = highscore;

//     // Display the menu with an input to enter player's name
//     newScore(finalScore);

//     if(finalScore > highscore) {
//         localStorage.setItem("highscore", finalScore);
//         document.querySelector("#highscore").textContent = localStorage.getItem("highscore");
//         newHighscore(finalScore);
//     }
// }
// function newScore(finalScore) {
//     // NEW PLAYER'S SCORE MENU
//     const inputMenu =  document.querySelector(".newHighscore-input");
//     const scoreText = document.querySelector("#scoreText");
//     inputMenu.style.display = "flex";

//     // Display different message according to the score
//     if(finalScore > highscore) {
//         scoreText.innerHTML = `<h2 class="newHighscore-notification">NEW HIGHSCORE !!!</h2>`
//     } else {
//         scoreText.innerHTML = `<h2>NOT BAD</h2>`;
//     }

//     // Save player's name and score
//     saveBtn.addEventListener("click", () => {
//         const value = inputField.value;
//         const results = {
//             name: value,
//             score: finalScore
//         }
//         let highscoresArray =  JSON.parse(localStorage.getItem("highscoresList")) || [];
//         highscoresArray.push(results);
//         localStorage.setItem("highscoresList", JSON.stringify(highscoresArray));

//         // Hide the menu
//         inputMenu.style.display = "none";
//     })
// }

// // Display notification that the user has a new HIGHSCORE
// function newHighscore() {
//     emptyWarningText.textContent = "NEW HIGHSCORE !!!";
//     emptyWarningText.classList.add("emptyWarning-Highscore");

//     // Remove the notification
//     setTimeout(() => {
//         emptyWarningText.classList.remove("emptyWarning-Highscore");
//     }, 2000);
// }
// let inputField = document.querySelector("#playerName-input");
// let saveBtn = document.querySelector("#savePlayer");

// function restartGame() {
//     // Clear the intervals
//     clearInterval(countdown);
//     clearInterval(game);
//     clearInterval(graduallyRestoreInterval);
//     clearInterval(enemiesShootingInterval);

//     // Reset the flag variables
//     gameStarted = false;
//     enemiesSpawned = false;
//     initialHealthPushed = false;
//     initialShieldRenewPushed = false;
//     initialTimeRenewPushed = false;
//     shieldDestroyed = false;

//     // Reset timer
//     timerDisplay.classList.remove("timeLow"); // In case user died while time was low.
//     timerDisplay.textContent = "0:30";

//     // Reset the colored blocks
//     blocks.forEach(block => {
//         block.classList.remove("greenPhase")
//         block.classList.remove("yellowPhase")
//         block.classList.remove("redPhase")
//     });

//     // Destroy all enemies, healths, timers, shields and reset them to 0.
//     enemies.splice(0, enemies.length);
//     healthRenew.splice(0, healthRenew.length);
//     timeRenew.splice(0, timeRenew.length);
//     shieldRenew.splice(0, shieldRenew.length);
//     enemyAmmo.splice(0, enemyAmmo.length);
//     ammo.splice(0, ammo.length);
//     map = {};
    
//     // Run startGame again
//     startGame();

//     // Reset the kill count text.
//     killCount = 0;
//     displayKills.textContent = killCount;

//     // Reset pregame countdown and hide game over menu
//     preGame = 3;
//     gameOver.style.display = "none";

//     // Reset ship's direction
//     d = "";

//     // Reset player's ship stats
//     player.hp = 100;
//     player.shield = 100;
//     player.overheat = 0;
//     player.boost = 100
//     player.x = 50;
//     player.y = 250;
//     player.speed = 5;
//     heat = -1;

//     // Reset level and experience
//     exp = 0;
//     requiredExp = 80;
//     level = 1;
//     currentLevel.textContent = level;
//     currentExp.textContent = exp;
//     requiredExpText.textContent = requiredExp + "XP";
//     let levelExp = (exp / requiredExp) * 100;
//     levelBar.style.width = `${levelExp}%`;

//     // Restart current time which affets difficulty
//     startingTime = new Date();
//     increaseDifficulty();

//     // Reset enemies data
//     enemySpeed = 1;
//     enemiesShootingSpeed = 700;

//     // Reset health and shield text display
//     healthText.textContent = player.hp+"%";
//     shieldText.textContent = player.shield+"%";

//     // Clear input field at game over menu
//     inputField.value = "";

//     // Set restoration and enemy shooting intervals again.
//     graduallyRestoreInterval = setInterval(graduallyRestore, 300);
//     enemiesShootingInterval = setInterval(enemiesShoot, 700);
// }

// // Spawn health renew every 30 seconds.
// function healthRenewFunction() {
//     if(initialHealthPushed) {
//         setTimeout(() => {
//             healthRenew.push({
//                 x: cWidth,
//                 y: Math.floor(Math.random() * ( (maxHeight - firstAid.height) - minHeight) + minHeight)
//             })
        
//             healthRenewFunction();
//         }, 30 * 1000);
//     } else {
//         setTimeout(() => {
//             healthRenewFunction();
//         }, 30 * 1000);
//     }
// }
// healthRenewFunction();

// // Spawn shield renew every minute
// function shieldRenewFunction() {
//     if(initialShieldRenewPushed) {
//         setTimeout(() => {
//             shieldRenew.push({
//                 x: cWidth,
//                 y: Math.floor(Math.random() * ( (maxHeight - shieldImage.height) - minHeight) + minHeight)
//             })

//             shieldRenewFunction();
//         }, 60 * 1000);
//     } else {
//         setTimeout(() => {
//             shieldRenewFunction();
//         }, 60 * 1000);
//     }
// }
// shieldRenewFunction();

// // Spawn timer to add more time to play every 10-15 seconds
// function timeRenewFunction(){
//     if(initialTimeRenewPushed) {
//         setTimeout(() => {
//             timeRenew.push({
//                 x: cWidth,
//                 y: Math.floor(Math.random() * ( (maxHeight - timerImage.height) - minHeight) + minHeight)
//             })

//             timeRenewFunction();
//             document.querySelector(".time").classList.remove("timeShake");
//         }, 10 * 1000);
//     } else {
//         setTimeout(() => {
//             timeRenewFunction();
//         }, 20 * 1000);
//     }
// }
// timeRenewFunction();