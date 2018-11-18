import * as menus from "./lib/menus.js";
import {enemies} from "./lib/enemies.js";
import {player} from "./lib/player.js";
import {game} from "./lib/game.js";
import {Graphics, Sfx} from "./lib/assets.js";
import {Powerups} from "./lib/powerups.js";

/* TODO
1. Have loadGame, startGame, restartGame, pauseGame, continueGame, exitGame here X
2. Separate player {Object}
3. Separate assets {Object}
4. Separate menus 
5. Import player, assets, menus to this main file

BUGS: 


*/
const graphics = new Graphics();
// const player = new Player();
// const game = new Game();
const sfx = new Sfx();
// const enemies = new Enemies();
const powerups = new Powerups();

const fullPath = window.location.pathname;
const splitPath = fullPath.split('/');
if (splitPath[splitPath.length - 1] == 'index.html') {
	splitPath.pop();
}
const endPath = splitPath.length > 2 ? splitPath.join('/') : '';


// Elements
const notificationText = document.querySelector(".notification");
const menu = document.querySelector(".menu");
const displayImage = document.querySelector("#displayImage");
const message = document.querySelector("#message");
const pauseMenu = document.querySelector(".pause--menu");
const shieldContainer = document.querySelector(".shield-container");
const healthContainer = document.querySelector(".health-container");
const overheatContainer = document.querySelector(".overheat-container");



// Canvas
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cHeight = canvas.height;
const minHeight = 0;
const maxHeight = 500;
let init;

// Load game
function loadGame() {
    // Play loading music
    sfx.music.src = `${endPath}/assets/audio/loading.wav`;
    sfx.music.play();

    // Hide the main menu
    const mainMenu = document.querySelector(".main-menu");
    mainMenu.style.display = "none";
    
    // Display loading container
    const loadingContainer = document.querySelector(".loading");
    loadingContainer.style.display = "flex";
    
    // Loading bar
    let loadingBarPercent = 0;
    const loadingBar = document.querySelector(".loading-bar_fill");
    const loadingBarText = document.querySelector(".loading-text");

    let load = setInterval(()=>{
        if(loadingBarPercent < 100) {
            loadingBarPercent++;
        }
        loadingBarText.textContent = loadingBarPercent+"%";
        loadingBar.style.width = `${loadingBarPercent}%`;

        if(loadingBarPercent === 100) {
            setTimeout(()=> loadingContainer.style.display = "none", 500);
            startGame();
            clearInterval(load);
        }
    }, 50)
}

// Start the game
function startGame() {
    setTimeout(() => {
        // Display the MENU/SCORE panel
        menu.style.display = "flex";

        // Pre-game countdown
        const preGameCountdown = document.querySelector(".countdown");
        let preGame = 3;
        preGameCountdown.textContent = "3";

        // Display elements
        setTimeout(() => {
            menu.classList.add("menuActive");
            healthContainer.style.display = "block";
            shieldContainer.style.display = "block";
            overheatContainer.style.display = "flex";
            preGameCountdown.style.display = "block";
        }, 500);

        // Pre-game countdown - 3 seconds then GO !
        const preGameCountdownInterval = setInterval(()=>{
            preGame--;
            preGameCountdown.textContent = preGame;
            if(preGame === 0) {
                sfx.goVoice.play();
                preGameCountdown.textContent = "GO !";
                setTimeout(()=> preGameCountdown.style.display = "none", 250)

                // Activate enemies and ship movement.
                game.isStarted = true;

                // Enemies shoot every 2 seconds
                enemies.spawned = true;
                    
                // Start the timer countdown untill boss spawns
                game.timer(game.time);

                // Start measuring played time
                game.startingTime = new Date();

                clearInterval(preGameCountdownInterval);
            }
        }, 1000)

        // Play background music
        sfx.music.src = `${endPath}/assets/audio/Mecha Collection.mp3`;
        sfx.music.volume = 0.2;
        sfx.music.play();

        // Run the game
        init = setInterval(draw, 1000 / 60);
    }, 500);
}

// Game
function draw() {
    canvas.style.display = "block";
    ctx.drawImage(graphics.bg, 0,0);
    
    // Check if the game started
    if(game.isStarted) {
        for(let i = 0; i < enemies.enemiesArray.length; i++){
            // Draw a enemy
            ctx.drawImage(graphics.enemy, enemies.enemiesArray[i].x, enemies.enemiesArray[i].y);

            enemies.enemiesArray[i].x -= enemies.speed;

            if(enemies.enemiesArray[i].x === enemies.spawnDistance) {
                enemies.enemiesArray.push({
                    x: cWidth,
                    y: Math.floor(Math.random() * ( (maxHeight-graphics.enemy.height) - minHeight) + minHeight) 
                })
            }
            // If spaceship and enemy colide
            if(player.x + graphics.ship.width >= enemies.enemiesArray[i].x 
                && player.x <= enemies.enemiesArray[i].x + graphics.enemy.width 
                && player.y + graphics.ship.height >= enemies.enemiesArray[i].y 
                && player.y <= enemies.enemiesArray[i].y + graphics.enemy.height) {
                // Draw explosion at those coords.
                ctx.drawImage(graphics.explosion, enemies.enemiesArray[i].x - graphics.enemy.width, enemies.enemiesArray[i].y - graphics.enemy.height);
                
                // Delete the enemy from screen.
                enemies.enemiesArray.splice(i, 1);
                
                // Deduct shield on hit
                player.decreaseShield();

                // Deduct HP on hit.
                player.decreaseShipHP();
                
                // Update the kill count, thus upating the score
                game.updateKillcount();

                sfx.explosionSound.currentTime = 0;
                sfx.explosionSound.play();

                // If spaceship HP reaches 0, end game.
                if(player.hp === 0) {
                    clearInterval(init);
                    endgame();
                }
            } else if(enemies.enemiesArray[i].x + graphics.enemy.width < 0) { 
                // Remove the alien space ship from the enemies array.
                enemies.enemiesArray.splice(i, 1);
            }            
        }
        // Create a new enemy if all enemies on screen are destroyed.
        if(enemies.enemiesArray.length === 0) {
            enemies.enemiesArray.push({
                x: cWidth,
                y: Math.floor(Math.random() * ( (maxHeight-graphics.enemy.height) - minHeight) + minHeight) 
            })
        }
    }

    // PLAYER ROCKETS
    if(game.isStarted){
        for(let j = 0; j < player.ammo.length; j++) {
            ctx.drawImage(graphics.missile, player.ammo[j].x, player.ammo[j].y);
            player.ammo[j].x += player.missileSpeed;

            const hitEnemy = enemies.enemiesArray.find(e => {
                return player.ammo[j].x >= e.x 
                && player.ammo[j].x <= e.x + graphics.enemy.width 
                && player.ammo[j].y >= e.y 
                && player.ammo[j].y <= e.y + graphics.enemy.height
            })

            // Ammo colides enemy
            if (hitEnemy) {
                ctx.drawImage(graphics.explosion, hitEnemy.x - graphics.enemy.width, hitEnemy.y - graphics.enemy.height);

                // Remove the missiles
                player.ammo.splice(j, 1);

                // Remove the enemy from screen
                let enemiesArrayIndex = enemies.enemiesArray.indexOf(hitEnemy);
                if(enemiesArrayIndex > -1) {
                    enemies.enemiesArray.splice(enemiesArrayIndex, 1)
                }
                sfx.explosionSound.play();
                sfx.explosionSound.currentTime = 0;

                // Update the kill count, thus updating the score
                game.updateKillcount();
            } else if (player.ammo[j].x > cWidth) { // If player's ammo goes past canvas width
                player.ammo.splice(j, 1);                
            }
        }
    }

    // HEALTH RESTORATION - HEALTH,SHIELD,TIME FROM MODULE "POWERUPS"
    for(let i = 0; i < powerups.healthRenew.length; i++){
        ctx.drawImage(graphics.healthImage, powerups.healthRenew[i].x, powerups.healthRenew[i].y);

        const pickedUpHealthRenew = player.x + graphics.ship.width >= powerups.healthRenew[i].x 
                                && player.x <= powerups.healthRenew[i].x + graphics.healthImage.width 
                                && player.y + graphics.ship.height >= powerups.healthRenew[i].y 
                                && player.y <= powerups.healthRenew[i].y + graphics.healthImage.height;

        // If the ship touches the health, restore the ship's HP.
        if(pickedUpHealthRenew) {
            // Remove the HP restore.
            powerups.healthRenew.splice(i, 1)

            // Restore ship's HP.
            player.restoreShipHP();

            // Play Sound effect
            sfx.restorationEffect();
        } else if(powerups.healthRenew[i].x + graphics.healthImage.width < 0 ) { 
            // If HP restore goes past the canvas width, remove it.
            powerups.healthRenew.splice(i, 1);
        }
    }
    // Start moving the HP renew after a set timeout.
    setTimeout(() => {
        for(let i = 0; i < powerups.healthRenew.length; i++) {
            powerups.healthRenew[i].x--;
        }
        powerups.initialHealthPushed = true;
    }, 30 * 1000);

    // SHIELD RESTORATION
    for(let i = 0; i < powerups.shieldRenew.length; i++) {
        ctx.drawImage(graphics.shieldImage, powerups.shieldRenew[i].x, powerups.shieldRenew[i].y);

        const pickedUpShieldRenew = player.x + graphics.ship.width >= powerups.shieldRenew[i].x 
                                && player.x <= powerups.shieldRenew[i].x + graphics.shieldImage.width 
                                && player.y + graphics.ship.height >= powerups.shieldRenew[i].y 
                                && player.y <= powerups.shieldRenew[i].y + graphics.shieldImage.height

        // If the ship touches the shield, renew its shield.
        if(pickedUpShieldRenew) {
            // Remove the shield from screen
            powerups.shieldRenew.splice(i, 1);

            // Restore 50 points to the player ship shield
            player.restoreShield();

            // Play Sound effect
            sfx.restorationEffect();
        } else if(powerups.shieldRenew[i].x + graphics.shieldImage.width < 0) {
             // If the shield item goes off canvas, remove it
            powerups.shieldRenew.splice(i, 1);
        }
    }

    // Start moving the shield after 1 minute passes
    setTimeout(() => {
        for(let i = 0; i < powerups.shieldRenew.length;i++) {
            powerups.shieldRenew[i].x--;
        }
        powerups.initialShieldRenewPushed = true;
    }, 60 * 1000);

    // ADD PLAY TIME 
    for(let i = 0; i < powerups.timeRenew.length; i++){
        ctx.drawImage(graphics.timerImage, powerups.timeRenew[i].x, powerups.timeRenew[i].y)
        // If the ship touches the sand timer, add more time

        const pickedUpTimeRenew = player.x + graphics.ship.width >= powerups.timeRenew[i].x 
                            && player.x <= powerups.timeRenew[i].x + graphics.timerImage.width 
                            && player.y + graphics.ship.height >= powerups.timeRenew[i].y 
                            && player.y <= powerups.timeRenew[i].y + graphics.timerImage.height

        if(pickedUpTimeRenew) {
            // Remove the timer from the array            
            powerups.timeRenew.splice(i, 1);

            // Add time
            game.addPlaytime();

            // Play Sound effect
            sfx.restorationEffect();
        } else if(powerups.timeRenew[i].x < 0) { 
            // If clock goes past canvas
            powerups.timeRenew.splice(i, 1);
        }
    }

    // Start moving the timer image
    setTimeout(() => {
        for(let i = 0; i < powerups.timeRenew.length; i++) {
            powerups.timeRenew[i].x -= 2;
        }
        powerups.initialTimeRenewPushed = true;
    }, 10 * 1000);

    // Move the ship
    if(player.d === "LEFT") {
        player.x -= player.speed;
    }
    if(player.d === "RIGHT"){
        player.x += player.speed;
    }
    if(player.d === "UP") {
        player.y -= player.speed;
    }
    if(player.d === "DOWN") {
        player.y += player.speed;
    }

    // DIAGONAL MOVEMENT
    if(player.d === "UP_LEFT") { 
        player.x -= player.speed;
        player.y -= player.speed;
    }
    if(player.d === "DOWN_LEFT") {
        player.x -= player.speed;
        player.y += player.speed;
    }
    if(player.d === "UP_RIGHT") {
        player.x += player.speed;
        player.y -= player.speed;
    }
    if(player.d === "DOWN_RIGHT") {
        player.x += player.speed;
        player.y += player.speed;
    }

    // ALIEN (ENEMY) ROCKETS
    if(game.isStarted && enemies.spawned){
        for(let i = 0; i < enemies.ammo.length;i++) {
            ctx.drawImage(graphics.enemyMissile, enemies.ammo[i].x, enemies.ammo[i].y);
            enemies.ammo[i].x -= 15;

            const hitEnemyAmmo = enemies.ammo[i].x >= player.x 
                            && enemies.ammo[i].x <= player.x + graphics.ship.width 
                            && enemies.ammo[i].y >= player.y 
                            && enemies.ammo[i].y <= player.y + graphics.ship.height 
                            && enemies.spawned;
        
            if(hitEnemyAmmo) {
                // Draw explosion at the spot
                ctx.drawImage(graphics.explosion, player.x, player.y);
        
                // Run function when player's ship is hit.
                player.playerHit();
            } else if(enemies.ammo[i].x < 0) { // If the alien rocket goes behind player's ship
                enemies.ammo.splice(i, 1);
            }
        }
    }

    // If spaceship hits the boundry, remove the direction or teleport him top-bottom / bottom-top
    if(player.x <= 0) {
        player.x += player.speed;
    } else if (player.x >= 1300 - graphics.ship.width) {
        player.x -= player.speed;
    } else if (player.y <= -40) {
        player.y = 520 - player.speed;
    } else if (player.y >= 520) {
        player.y = -30 + player.speed;
    }

    // Draw the ship
    ctx.drawImage(graphics.ship, player.x, player.y);
    // engineFlameX = player.x - (ship.width - 42);
    // engineFlameY = player.y + (ship.height / 2 - 6);
    // ctx.drawImage(engineFlames, engineFlameX, engineFlameY);

    // Check how much time has passed and increase difficulty accordingly.
    game.increaseDifficulty();
}
// Pause game
function pauseGame(){
    // Display the menu
    pauseMenu.style.display = "flex";

    // Clear the interval for the game
    clearInterval(init);
    clearInterval(enemies.enemiesShootingInterval); // Enemies module
    clearInterval(player.graduallyRestoreInterval); // Player module
    clearInterval(game.countdown); 

    // Stop enemies and ship from moving
    game.isStarted = false;

    // Enemies shoot every 2 seconds
    enemies.spawned = false;

    // Divide the difference to get milliseconds.
    game.pausedTime = (new Date() - game.startingTime) / 1000;
    Math.floor(game.pausedTime);
}
// Continue game
function continueGame(){
    // Hide the menu
    pauseMenu.style.display = "none";

    // Run the interval
    init = setInterval(draw, 1000 / 60);
    enemies.enemiesShootingInterval = setInterval(enemies.shoot.bind(enemies), enemies.shootingSpeed); // Enemies module
    player.graduallyRestoreInterval = setInterval(player.graduallyRestore.bind(player), 300); // Player module
    game.timer(game.timer); // Game module - BUG

    // Enable enemies and ship movement
    game.isStarted = true;

    // Enemies shoot every 2 seconds
    enemies.spawned = true;

    // Continue measuring time after game was paused
    game.pausedTime *= 1000;
}

// End the game
function endgame(secondsLeft){
    // Disable the intervals
    clearInterval(enemies.enemiesShootingInterval); // Enemies module
    clearInterval(player.graduallyRestoreInterval); // Player module
    clearInterval(game.countdown);

    // End measuring time
    game.endTime = new Date();

    // Divide the difference to get the starting time
    let timeDifference = (game.endTime - game.startingTime) / 1000;
    let timePlayed = Math.floor(timeDifference);

    // Multiplie the ending score by the time played divided by 100, which will result in a multiplier in the form of, for example x0.5 - x3, based on time played
    let multiplier = timePlayed / 100;
    game.score = player.killCount * 100;
    let finalScore = game.score + (game.score * multiplier);

    // Stop movements
    game.isStarted = false;

    // Game Over / Game finished menu
    gameOver.style.display = "block";

    // If player was killed.
    if(player.hp === 0){
        displayImage.src = `${endPath}/assets/images/tombstone.png`;
        message.textContent = "At least you tried..."; // elementot go nema
    }
    
    // If the time is up
    if(secondsLeft <= 0) {
        message.textContent = "Time's up !" // elementot go nema
    }

    sfx.music.src = `${endPath}/assets/audio/Fallen in Battle.mp3`;
    sfx.music.volume = 0.2;
    sfx.music.play();
    sfx.music.loop = false;

    // Score and Highscore
    document.querySelector("#totalKills").textContent = player.killCount;
    document.querySelector("#multiplier").textContent = "x" + multiplier;
    document.querySelector("#finalScore").textContent = finalScore;
    document.querySelector("#highscore").textContent = game.highscore;

    // Display the menu with an input to enter player's name
    game.newScore(finalScore);

    if(finalScore > this.highscore) {
        localStorage.setItem("highscore", finalScore);
        document.querySelector("#highscore").textContent = localStorage.getItem("highscore");
        game.newHighscore();
    }
}

// Restart game
function restartGame() {
    // Clear the intervals
    clearInterval(game.countdown);
    clearInterval(init);
    clearInterval(player.graduallyRestoreInterval); // Player module
    clearInterval(enemies.enemiesShootingInterval); // Enemies module

    // Reset the flag variables
    game.isStarted = false;
    enemies.spawned = false;
    initialHealthPushed = false;
    initialShieldRenewPushed = false;
    initialTimeRenewPushed = false;
    player.shieldDestroyed = false;

    // Reset timer
    timerDisplay.classList.remove("timeLow"); // In case user died while time was low.
    timerDisplay.textContent = "0:30";

    // Reset the colored blocks
    player.blocks.forEach(block => {
        block.classList.remove("greenPhase")
        block.classList.remove("yellowPhase")
        block.classList.remove("redPhase")
    });

    // Destroy all enemies, healths, timers, shields and reset them to 0.
    enemies.enemiesArray.splice(0, enemies.enemiesArray.length);
    enemies.ammo.splice(0, enemies.ammo.length);
    
    healthRenew.splice(0, healthRenew.length);
    timeRenew.splice(0, timeRenew.length);
    shieldRenew.splice(0, shieldRenew.length);

    player.ammo.splice(0, player.ammo.length);
    player.map = {};
    
    // Run startGame again
    startGame();

    // Reset the kill count text.
    player.killCount = 0;
    game.displayKills.textContent = player.killCount;

    // Reset pregame countdown and hide game over menu
    preGame = 3;
    gameOver.style.display = "none";

    // Reset ship's direction
    player.d = "";

    // Reset player's ship stats
    player.hp = 100;
    player.shield = 100;
    player.overheat = 0;
    player.boost = 100
    player.x = 50;
    player.y = 250;
    player.speed = 5;
    player.heat = -1;

    // Reset level and experience
    game.requiredExpText.textContent = game.requiredExp + "XP";
    game.requiredExp = 80;
    player.exp = 0;
    player.level = 1;
    player.currentLevel.textContent = player.level;
    player.currentExp.textContent = player.exp;
    let levelExp = (exp / requiredExp) * 100;
    levelBar.style.width = `${levelExp}%`;

    // Restart current time which affets difficulty
    game.startingTime = new Date();
    game.increaseDifficulty();

    // Reset enemies data
    enemies.speed = 1;
    enemies.shootingSpeed = 700;

    // Reset health and shield text display
    player.healthText.textContent = player.hp + "%";
    player.shieldText.textContent = player.shield + "%";

    // Clear input field at game over menu
    const inputField = document.querySelector("#playerName-input");
    inputField.value = "";

    // Set restoration and enemy shooting intervals again.
    player.graduallyRestoreInterval = setInterval(player.graduallyRestore, 300); // Player module
    enemies.enemiesShootingInterval = setInterval(enemies.shoot, 700); // Enemies module
}

// Exit game
const exitGame = document.querySelectorAll(".exitGame");
exitGame.forEach(exit => exit.addEventListener("click", ()=> location.reload()));

// Event listeners
document.querySelector("#startGame").addEventListener("click", loadGame);
document.querySelector("#pauseGame").addEventListener("click", pauseGame);
document.querySelector("#continueGame").addEventListener("click", continueGame);
document.querySelector("#restartGame").addEventListener("click", restartGame);

// Pause game on ESCAPE and if clicked outside of canvas
window.addEventListener("keydown", e => {
    if(e.keyCode === 27 && game.isStarted) pauseGame();
})
window.addEventListener("click", e => {
    if(e.target.id !== "canvas" && e.target.id !== "continueGame" && game.isStarted) pauseGame();
})

