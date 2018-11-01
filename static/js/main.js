// Globals
const fullPath = window.location.pathname;
// console.log(fullPath)
const splitPath = fullPath.split('/');
// console.log(splitPath.length)
if (splitPath[splitPath.length - 1] == 'index.html') {
	splitPath.pop();
}
const endPath = splitPath.length > 2 ? splitPath.join('/') : '';
// console.log(endPath);

let d; // Player ship direction
let game;
let score = 0;
let enemySpawnDistance = 1200;
let enemySpeed = 1;
let killCount = 0;
let highscore = localStorage.getItem("highscore");
let startingTime, endTime; // Measure time
let pausedTime;

const notificationText = document.querySelector(".notification");
const menu = document.querySelector(".menu");
const displayScore = document.querySelector("#score");
const displayImage = document.querySelector("#displayImage");
const message = document.querySelector("#message");
const pauseMenu = document.querySelector(".pause--menu");
const overheatContainer = document.querySelector(".overheat-container");
const overheatProgress = document.querySelector(".overheat-progress");
const shieldContainer = document.querySelector(".shield-container");
const healthContainer = document.querySelector(".health-container");
const soundControl = document.querySelectorAll(".soundControl");

// Flag variables
let isSpaceDown = false;
let gameStarted = false;
let isOverheated = false;
let enemiesSpawned = false;
let speedBooster = false;
let shieldDestroyed = false;
let soundOff = false;

// Canvas
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cHeight = canvas.height;
const minHeight = 0;
const maxHeight = 500;

// Image assets
const bg = new Image();
const ship = new Image();
const enemy = new Image();
const missile = new Image();
const explosion = new Image();
const firstAid = new Image();
const alienMissile = new Image();
const engineFlames = new Image();
const timerImage = new Image();
const shieldImage = new Image();
bg.src = `${endPath}/assets/images/background.png`;
ship.src = `${endPath}/assets/images/player.png`;
enemy.src = `${endPath}/assets/images/enemy.png`;
missile.src = `${endPath}/assets/images/playerRocket.png`;
explosion.src = `${endPath}/assets/images/3.png`;
firstAid.src = `${endPath}/assets/images/firstAid.png`;
alienMissile.src = `${endPath}/assets/images/enemyRocket.png`;
timerImage.src = `${endPath}/assets/images/timer.png`;
shieldImage.src = `${endPath}/assets/images/shieldImage.png`;
engineFlames.src = `${endPath}/assets/images/engineFlameNormal.png`;

// Sound assets
const enemyShootingSound = new Audio();
const missileSound = new Audio();
const explosionSound = new Audio();
const music = new Audio();
const restoreSoundEffect = new Audio();
const alarm = new Audio();

missileSound.src = `${endPath}/assets/audio/weapon_player.wav`;
explosionSound.src = `${endPath}/assets/audio/explosion_enemy.wav`;
enemyShootingSound.src = `${endPath}/assets/audio/laser1.ogg`;
music.src = `${endPath}/assets/audio/music_background.wav`;
restoreSoundEffect.src = `${endPath}/assets/audio/powerUp11.ogg`;
alarm.src = `${endPath}/assets/audio/alarm.wav`;

// Set the volume of the sound assets
missileSound.volume = 0.05;
explosionSound.volume = 0.1;
enemyShootingSound.volume = 0.05;
music.volume = 0.3;
restoreSoundEffect.volume = 0.5;
alarm.volume = 0.1;

// Enable looping of the background music
music.loop = true;

// Play the theme music when page is loaded
window.onload = function playMusic() {
    music.play();
}

// Spaceship starting coordinates
let player = {
    x: 50,
    y: 250,
    speed: 5,
    hp: 100,
    shield: 100,
    overheat: 0,
    boost: 100
}
let engineFlameX;
let engineFlameY;

// Player ammo
let ammo = [];

// Enemies
let enemies = [];
enemies[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight-enemy.height) - minHeight) + minHeight)
}

// Health renew
let healthRenew = [];
healthRenew[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight - firstAid.height) - minHeight) + minHeight)
}
let initialHealthPushed = false;

// Shield - player ship shield renewal
let shieldRenew = [];
shieldRenew[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight - shieldImage.height) - minHeight) + minHeight)
}
let initialShieldRenewPushed = false;

// Timer(s) array
let timeRenew = [];
timeRenew[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight - timerImage.height) - minHeight) + minHeight)
}
let initialTimeRenewPushed = false;

// Aliens (enemies)
let enemyAmmo = [];

// Timer variables
let countdown;
const timerDisplay = document.querySelector("#timerDisplay");
const time = 30;

// Sound control
function toggleMusic() {
    soundOff = !soundOff;
    if(soundOff) {
        this.src = `${endPath}/assets/images/soundOff.png`;
        music.volume = 0;
    } else {
        this.src = `${endPath}/assets/images/soundOn.png`;
        music.volume = 0.2;
    }
}

// Load game
function loadGame() {
    // Play loading music
    music.src = `${endPath}/assets/audio/loading.wav`;
    music.play();

    const mainMenu = document.querySelector(".main-menu");
    // mainMenu.classList.add("mainMenuFade")
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

// Start game
function startGame(){
    setTimeout(() => {
        // Display the MENU/SCORE panel
        menu.style.display = "flex";
        const preGameCountdown = document.querySelector(".countdown");
        setTimeout(() => {
            menu.classList.add("menuActive");
            healthContainer.style.display = "block";
            shieldContainer.style.display = "block";
            overheatContainer.style.display = "flex";
            preGameCountdown.style.display = "block";
        }, 500);

        // Pre-start countdown - 3 seconds then GO !
        let preGame = 3;
        const preGameCountdownInterval = setInterval(()=>{
            preGame--;
            preGameCountdown.textContent = preGame;
            if(preGame == 0) {
                preGameCountdown.textContent = "GO !";
                setTimeout(()=> preGameCountdown.style.display = "none", 250)
                clearInterval(preGameCountdownInterval);
            }
        }, 1000)

        // Play the theme music again
        music.src = `${endPath}/assets/audio/Mecha Collection.mp3`;
        music.volume = 0.2;
        music.play();

        // After 5 seconds make the infobox fade away. (remove the active class).
        setTimeout(() => {
            // Activate enemies and ship movement.
            gameStarted = true;

            // Enemies shoot every 2 seconds
            enemiesSpawned = true;
                
            // Start the timer countdown untill boss spawns
            timer(time);

            // Start measuring played time
            startingTime = new Date();
        }, 3000);

        game = setInterval(draw, 1000 / 60);
    }, 500);
}

// Move the spaceship
function movement(e){
    let key = e.keyCode;
    // If game has started, enable ship movement.
    if(gameStarted) { 
        if(key == 37) {
            d = "LEFT"
        } else if (key == 38) {
            d = "UP"
            ship.src = `${endPath}/assets/images/playerUp.png`;
        } else if (key == 39) {
            d = "RIGHT"
        } else if (key == 40) {
            d = "DOWN"
            ship.src = `${endPath}/assets/images/playerDown.png`;
        }

        // Player spaceship speed boost
        if(key == 16 && d == "LEFT" || key == 16 && d == "RIGHT") {
            if(player.boost > 0 && player.boost <= 100) {
                speedBooster = true;
                player.speed = 15;
                // Empty out the speed booster
                player.boost = player.boost - 2;
                engineFlames.src = `${endPath}/assets/images/engineFlameBooster.png`;
            }
            // Disable speed boost if it reaches 0
            if(player.boost <= 0) {
                speedBooster = false;
                player.speed = 5;
                emptyWarningText.textContent = "BOOSTER EMPTY !";
                emptyWarningText.classList.add("emptyWarning-textActive");
                alarm.currentSrc = 0;
                alarm.play();
                fillBooster();
            }
        }
    }
}

// Clear spaceship's commands when key is released
function clearShipCommands() {
    player.speed = 5;
    speedBooster = false;
    ship.src = `${endPath}/assets/images/player.png`;
    engineFlames.src = `${endPath}/assets/images/engineFlameNormal.png`;
}

// Player shoots
function shoot(e){
    let key = e.keyCode;
    if(gameStarted && isOverheated == false) { 
        if(key == 32) {
            isSpaceDown = true;
            // Display the rocket WHEN the user shoots.
            ammo.push({
                x: player.x + ship.width,
                y: player.y + (ship.height / 2)
            })
            missileSound.play();
            missileSound.currentTime = 0;
            overheated();
        } else {
            isSpaceDown = false;
        }
    }
}

// Overheat the spaceship's guns.
const emptyWarningText = document.querySelector(".emptyWarning-text");
const blocks = document.querySelectorAll(".overheat-bar_block");
let heat = -1;

// Display the overheating by painting the blocks
function heatingUp() {
    if(heat >= -1 && heat <= 10) {
        heat++;
    }
    if(heat >= 0 && heat <= 3) {
        blocks[heat].classList.add("greenPhase");
    } else if (heat >= 4 && heat <= 6) {
        blocks[heat].classList.add("yellowPhase");
    } else if (heat >= 7 && heat <= 10) {
        blocks[heat].classList.add("redPhase");
    }
}

// Increase the overheat of the ship and see if it reaches "boiling" point
function overheated(){
    player.overheat = player.overheat + 10;

    // If player.overheat meter reaches max(100), stop the ship from shooting, when it starts cooling off enable shooting.
    if(player.overheat == 100) {
        isOverheated = true;
        emptyWarningText.textContent = "OVERHEATED !";
        emptyWarningText.classList.add("emptyWarning-textActive");
        alarm.currentSrc = 0;
        alarm.play();
        coolOut();
    } else if (player.overheat < 100 && player.overheat > 0) {
        isOverheated = false;
        heatingUp();
    }
}

// Gradually cool out the gun BEFORE it reaches overheating point
function graduallyRestore(){
    if(player.overheat <= 90 && player.overheat >= 10) {
        player.overheat = player.overheat - 10;
        
        // Coolout the ship's heat
        if(heat >= 0 && heat <= 3) {
            blocks[heat].classList.remove("greenPhase");
            heat--;
        } else if(heat >= 4 && heat <= 6) {
            blocks[heat].classList.remove("yellowPhase");
            heat--;
        } else if(heat >= 7 && heat <= 10) {
            blocks[heat].classList.remove("redPhase");
            heat--;
        }
    }

    // Restore ship's booster
    if(player.boost >= 0 && player.boost <= 99) {
        player.boost = player.boost + 2;
    }
}
// let graduallyRestoreInterval = setInterval(graduallyRestore, 300)
let graduallyRestoreInterval = setInterval(graduallyRestore, 300)

// When gun overheats, wait 1 second, then cool it out and enable shooting.
function coolOut(){
    setTimeout(() => {
        player.overheat = 0;
        isOverheated = false;
        emptyWarningText.classList.remove("emptyWarning-textActive");
        blocks.forEach(block => {
            block.classList.remove("greenPhase")
            block.classList.remove("yellowPhase")
            block.classList.remove("redPhase")
        });
        heat = -1;
    }, 2000);
}

// If speed booster is empty (0), fill it up instantly after 3 seconds
function fillBooster() {
    setTimeout(() => {
        player.boost = 100;
        speedBooster = true;
        emptyWarningText.classList.remove("emptyWarning-textActive");
    }, 6000);
}

// The game
function draw(){
    canvas.style.display = "block";
    ctx.drawImage(bg, 0,0);
    
    // Check if the game started
    if(gameStarted) {
        for(let i = 0; i < enemies.length;i++){
            // Draw a enemy
            ctx.drawImage(enemy, enemies[i].x, enemies[i].y);

            enemies[i].x -= enemySpeed;

            if(enemies[i].x == enemySpawnDistance) {
                enemies.push({
                    x: cWidth,
                    y: Math.floor(Math.random() * ( (maxHeight-enemy.height) - minHeight) + minHeight) 
                })
            }
            // If spaceship and enemy colide
            if(player.x + ship.width >= enemies[i].x 
                && player.x <= enemies[i].x + enemy.width 
                && player.y + ship.height >= enemies[i].y 
                && player.y <= enemies[i].y + enemy.height) {
                // Increase kill count
                killCount++;

                // Draw explosion at those coords.
                ctx.drawImage(explosion, enemies[i].x - enemy.width, enemies[i].y - enemy.height);
                
                // Delete the enemy from screen.
                enemies.splice(i, 1);
                
                // Deduct shield on hit
                decreaseShield();

                // Deduct HP on hit.
                decreaseShipHP();
                
                // Update the score
                updateScore();

                explosionSound.currentTime = 0;
                explosionSound.play();

                // If spaceship HP reaches 0, end game.
                if(player.hp == 0) {
                    clearInterval(game);
                    endgame();
                }
            } else if(enemies[i].x + enemy.width < 0) { 
                // Remove the alien space ship from the enemies array.
                enemies.splice(i, 1);
            }            
        }
        // Create a new enemy if all enemies on screen are destroyed.
        if(enemies.length == 0) {
            enemies.push({
                x: cWidth,
                y: Math.floor(Math.random() * ( (maxHeight-enemy.height) - minHeight) + minHeight) 
            })
        }
    }

    // PLAYERS ROCKETS
    if(gameStarted){
        for(let j = 0; j < ammo.length; j++) {
            ctx.drawImage(missile, ammo[j].x, ammo[j].y);
            ammo[j].x += 15;

            const hitEnemy = enemies.find(e => {
                return ammo[j].x >= e.x 
                && ammo[j].x <= e.x + enemy.width 
                && ammo[j].y >= e.y 
                && ammo[j].y <= e.y + enemy.height
            })

            // Ammo colides enemy
            if (hitEnemy) {
                ctx.drawImage(explosion, hitEnemy.x - enemy.width, hitEnemy.y - enemy.height);
                // Increase kill count
                killCount++;

                // Remove the missiles
                ammo.splice(j, 1);

                // Remove the enemy from screen
                let enemiesArrayIndex = enemies.indexOf(hitEnemy);
                if(enemiesArrayIndex > -1) {
                    enemies.splice(enemiesArrayIndex, 1)
                }
                explosionSound.play();
                explosionSound.currentTime = 0;
                updateScore();
            } else if (ammo[j].x > cWidth) { // If player's ammo goes past canvas width
                ammo.splice(j, 1);                
            }
        }
    }

    // HEALTH RESTORATION
    for(let i = 0; i < healthRenew.length; i++){
        ctx.drawImage(firstAid, healthRenew[i].x, healthRenew[i].y);

        const pickedUpHealthRenew = player.x + ship.width >= healthRenew[i].x 
                                && player.x <= healthRenew[i].x + firstAid.width 
                                && player.y + ship.height >= healthRenew[i].y 
                                && player.y <= healthRenew[i].y + firstAid.height;
        // If the ship touches the health, restore the ship's HP.
        if(pickedUpHealthRenew) {
            // Remove the HP restore.
            healthRenew.splice(i, 1)
            // Restore ship's HP.
            restoreShipHP();
            // Play Sound effect
            restoreSound();
        } else if(healthRenew[i].x + firstAid.width < 0 ) { // If HP restore goes past the canvas width, remove it.
            healthRenew.splice(i, 1);
        }
    }
    // Start moving the HP renew after a set timeout.
    setTimeout(() => {
        for(let i = 0; i < healthRenew.length; i++) {
            healthRenew[i].x--;
        }
        initialHealthPushed = true;
    }, 30 * 1000);

    // SHIELD RESTORATION
    for(let i = 0; i < shieldRenew.length; i++) {
        ctx.drawImage(shieldImage, shieldRenew[i].x, shieldRenew[i].y);

        const pickedUpShieldRenew = player.x + ship.width >= shieldRenew[i].x 
                                && player.x <= shieldRenew[i].x + shieldImage.width 
                                && player.y + ship.height >= shieldRenew[i].y 
                                && player.y <= shieldRenew[i].y + shieldImage.height

        // If the ship touches the shield, renew its shield.
        if(pickedUpShieldRenew) {
            // Remove the shield from screen
            shieldRenew.splice(i, 1);

            // Restore 50 points to the player ship shield
            restoreShield();
            // Play Sound effect
            restoreSound();
        } else if(shieldRenew[i].x + shieldImage.width < 0) { // If the shield item goes off canvas, remove it
            shieldRenew.splice(i, 1);
        }
    }

    // Start moving the shield after 1 minute passes
    setTimeout(() => {
        for(let i = 0; i < shieldRenew.length;i++) {
            shieldRenew[i].x--;
        }
        initialShieldRenewPushed = true;
    }, 60 * 1000);

    // ADD PLAY TIME 
    for(let i = 0; i < timeRenew.length; i++){
        ctx.drawImage(timerImage, timeRenew[i].x, timeRenew[i].y)
        // If the ship touches the sand timer, add more time

        const pickedUpTimeRenew = player.x + ship.width >= timeRenew[i].x 
                            && player.x <= timeRenew[i].x + timerImage.width 
                            && player.y + ship.height >= timeRenew[i].y 
                            && player.y <= timeRenew[i].y + timerImage.height

        if(pickedUpTimeRenew) {
            // Remove the timer from the array            
            timeRenew.splice(i, 1);
            // Add time
            addPlaytime();

            // Play Sound effect
            restoreSound();
        } else if(timeRenew[i].x < 0) { // If clock goes past canvas
            timeRenew.splice(i, 1);
        }
    }

    // Start moving the timer image
    setTimeout(() => {
        for(let i = 0; i < timeRenew.length; i++) {
            timeRenew[i].x -= 2;
        }
        initialTimeRenewPushed = true;
    }, 10 * 1000);

    // Move the ship
    if(d == "LEFT") {
        player.x -= player.speed;
    }
    if(d == "RIGHT"){
        player.x += player.speed;
    }
    if(d == "UP") {
        player.y -= player.speed;
    }
    if(d == "DOWN") {
        player.y += player.speed;
    }

    // ALIEN (ENEMY) ROCKETS
    if(gameStarted && enemiesSpawned){
        for(let i = 0; i < enemyAmmo.length;i++) {
            ctx.drawImage(alienMissile, enemyAmmo[i].x, enemyAmmo[i].y);
            enemyAmmo[i].x -= 15;

            const hitEnemyAmmo = enemyAmmo[i].x >= player.x 
                            && enemyAmmo[i].x <= player.x + ship.width 
                            && enemyAmmo[i].y >= player.y 
                            && enemyAmmo[i].y <= player.y + ship.height 
                            && enemiesSpawned
        
            if(hitEnemyAmmo) {
                // Draw explosion at the spot
                ctx.drawImage(explosion, player.x, player.y);
        
                // Run function when player's ship is hit.
                playerHit();
            } else if(enemyAmmo[i].x < 0) { // If the alien rocket goes behind player's ship
                enemyAmmo.splice(i, 1);
            }
        }
    }

    // If spaceship hits the boundry, remove the direction
    if(player.x <= 0) {
        player.x += player.speed;
    } else if (player.x >= 1300 - ship.width) {
        player.x -= player.speed;
    } else if (player.y <= 0) {
        player.y += 5;
    } else if (player.y >= 500 - ship.height) {
        player.y -= 5;
    }

    // Draw the ship
    ctx.drawImage(ship, player.x, player.y);
    engineFlameX = player.x - (ship.width - 42);
    engineFlameY = player.y + (ship.height / 2 - 6);
    ctx.drawImage(engineFlames, engineFlameX, engineFlameY);
    document.querySelector("#killCount").textContent = killCount;
}
// Restore sound effect (shield, health, time)
function restoreSound() {
    restoreSoundEffect.currentTime = 0;
    restoreSoundEffect.play();
}

// Timer
let secondsLeft;
function timer(seconds) {
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() =>{
        secondsLeft = Math.round((then - Date.now()) / 1000);
        // Show a warning for few seconds left
        if(secondsLeft === 10) {
            timerDisplay.classList.add("timeLow");
            displayNotification(secondsLeft);
        } else if (secondsLeft > 10) {
            timerDisplay.classList.remove("timeLow");
        } else if (secondsLeft < 0) {
            // If the timer ran out, end the game
            clearInterval(countdown);
            clearInterval(game);
            endgame(secondsLeft);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000)
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    timerDisplay.textContent = `${minutes}:${remainder < 10 ? 0 : ""}${remainder}`;
}
// Add additional playtime
function addPlaytime() {
    let minTime = 8;
    let maxTime = 12;
    minTime = Math.ceil(minTime);
    maxTime = Math.floor(maxTime);
    let spawnTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

    secondsLeft = secondsLeft + spawnTime;
    timer(secondsLeft);
    document.querySelector(".time").classList.add("timeShake");
    notificationText.innerHTML = `<i class="material-icons timer">timer</i><p>Added playtime!</p>`;
    displayNotification();
 }

// Enemies
let enemiesShootingSpeed = 700;
function enemiesShoot(){
    // If the enemies are spawned
    if(enemiesSpawned) {
        let minShip = 0;
        let maxShip = enemies.length - 1;
        let randomShip = Math.floor(Math.random() * (maxShip - minShip + 1)) + minShip;
        // Randomize
        enemyAmmo.push({
            x: enemies[randomShip].x - enemy.width,
            y: enemies[randomShip].y + (enemy.height / 2)
        })
        enemyShootingSound.currentTime = 0;
        enemyShootingSound.play();
        }
}
let enemiesShootingInterval = setInterval(enemiesShoot, enemiesShootingSpeed);

// When player's ship is hit by aliens missiles
function playerHit(){
    explosionSound.currentTime = 0;
    explosionSound.play();

    // Destroy the alien ammo upon hit
    for(let i = 0; i < enemyAmmo.length; i++) {
        let enemyRockets = enemyAmmo[i];
        let enemyRocketsIndex = enemyAmmo.indexOf(enemyRockets);
        if(enemyRocketsIndex > -1) {
            enemyAmmo.splice(enemyRocketsIndex, 1);
        } 
    }
    // Decrease shield
    decreaseShield();

    // Decrease ship HP
    decreaseShipHP();
    if(player.hp == 0) {
        endgame();
        clearInterval(game);
    }
}

// Display notification that the user has a new HIGHSCORE
function newHighscore() {
    emptyWarningText.textContent = "NEW HIGHSCORE !!!";
    emptyWarningText.classList.add("emptyWarning-Highscore");

    // Remove the notification
    setTimeout(() => {
        emptyWarningText.classList.remove("emptyWarning-Highscore");
    }, 2000);
}

// Update the score and deal with difficulty
function updateScore() {
    // Update score
    score += 100;
    displayScore.textContent = score;

    // Increase difficulty when user reaches a certain score point.
    if(score == 3000) {
        enemySpeed = 2;
        enemiesShootingSpeed = 400;
        displayNotification();
    }
    if (score == 5000) {
        enemySpeed = 5;
        enemiesShootingSpeed = 300;
        displayNotification();
    }
    if(score == 8000) {
        enemiesShootingSpeed = 150;
    }
    if(score == 10000) {
        enemiesShootingSpeed = 60;
    }
}

// Display notifications
function displayNotification(secondsLeft){
    notificationText.classList.add("activeNotification");
    if(score == 3000) {
        notificationText.innerHTML = `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
    } else if (score == 6000) {
        notificationText.innerHTML= `<i class="material-icons">warning</i> <p>Another Disturbance!</p>`
    } else if (score == 10000) {
        notificationText.innerHTML = `<i class="material-icons">warning</i> <p>Watch out for the alien spaceship!!</p>`
    }

    // If there are 10 seconds left, show a warning
    if(secondsLeft === 10) {
        notificationText.innerHTML = `<i class="material-icons">warning</i><p>Few seconds left!</p>`
    }

    // Remove the class after 4 seconds
    setTimeout(() => {
        notificationText.classList.remove('activeNotification');
    }, 4000);
}

const shieldText = document.querySelector("#shieldText");
const healthText = document.querySelector("#healthText");

// SHIP HEALTH:
function restoreShipHP() {
    if(player.hp == 100) {
        player.hp = player.hp;
    } else{
        // Restore ships HP and display a notification.
        player.hp = player.hp + 20;
        healthText.textContent = player.hp+"%";
        notificationText.innerHTML = `<i class="material-icons health">local_hospital</i><p>Health renewed!</p>`;
        displayNotification();
    }
}
function decreaseShipHP() {
    if(player.hp >= 20 && player.hp <= 100 && shieldDestroyed){
        player.hp = player.hp - 20;
        healthText.textContent = player.hp+"%";
    } else if(player.hp == 0) {
        endgame();
        clearInterval(game);
        clearInterval(enemiesShootingInterval);
    }
}

// SHIP SHIELD
function restoreShield() {
    if(player.shield == 100) {
        shieldDestroyed = false;
        player.shield = player.shield;
    } else if(player.shield <= 80){
        // Enable shield on player's ship
        shieldDestroyed = false;

        // Restore shield points and display a notification
        player.shield = player.shield + 20;
        shieldText.textContent = player.shield+"%";
        notificationText.innerHTML = `<i class="material-icons shield">security</i><p>Shield restored!</p>`;
        displayNotification();
    }
}
function decreaseShield() {
    // Decrease shield
    if(player.shield >= 20 && player.shield <= 100) {
        player.shield = player.shield - 20;
        shieldText.textContent = player.shield+"%";
    }
    // If shield is at 0, mark it as destroyed
    if(player.shield == 0) {
        shieldDestroyed = true;
    }
}
// When the game has ended / been completed.
function endgame(secondsLeft){
    // Disable intervals
    clearInterval(enemiesShootingInterval);
    clearInterval(graduallyRestoreInterval);
    clearInterval(countdown);

    // End measuring time
    endTime = new Date();

    // Divide the difference to get milliseconds.
    let timeDifference = (endTime - startingTime) / 1000;

    let timePlayed = Math.round(timeDifference);
    // Multiplie the ending score by the time played divided by 100, which will result in a multiplier
    // in the form of, for example x0.5 - x3, based on time played
    let multiplier = timePlayed / 100;
    let finalScore = score + (score * multiplier);

    // Stop movements
    gameStarted = false;

    // Game Over / Game finished menu
    const gameOver = document.querySelector(".game--over");
    gameOver.style.display = "block";

    // If player was killed.
    if(player.hp === 0){
        displayImage.src = `${endPath}/assets/images/tombstone.png`;
        message.textContent = "At least you tried...";
    }
    if(secondsLeft <= 0) {
        message.textContent = "Time's up !"
    }
    
    music.src = `${endPath}/assets/audio/Fallen in Battle.mp3`;
    music.volume = 0.2;
    music.play();
    music.loop = false;

    // Score and Highscore
    document.querySelector("#currentScore").textContent = score;
    document.querySelector("#multiplier").textContent = "x"+multiplier;
    document.querySelector("#finalScore").textContent = finalScore;
    document.querySelector("#highscore").textContent = highscore;

    if(finalScore > highscore) {
        localStorage.setItem("highscore", finalScore);
        document.querySelector("#highscore").textContent = localStorage.getItem("highscore");
        newHighscore();
    }
}

// Spawn health renew every 30 seconds.
function healthRenewFunction() {
    if(initialHealthPushed) {
        setTimeout(() => {
            healthRenew.push({
                x: cWidth,
                y: Math.floor(Math.random() * ( (maxHeight - firstAid.height) - minHeight) + minHeight)
            })
        
            healthRenewFunction();
        }, 30 * 1000);
    } else {
        setTimeout(() => {
            healthRenewFunction();
        }, 30 * 1000);
    }
}
healthRenewFunction();

// Spawn shield renew every minute
function shieldRenewFunction() {
    if(initialShieldRenewPushed) {
        setTimeout(() => {
            shieldRenew.push({
                x: cWidth,
                y: Math.floor(Math.random() * ( (maxHeight - shieldImage.height) - minHeight) + minHeight)
            })

            shieldRenewFunction();
        }, 60 * 1000);
    } else {
        setTimeout(() => {
            shieldRenewFunction();
        }, 60 * 1000);
    }
}
shieldRenewFunction();

// Spawn timer to add more time to play every 10-15 seconds
function timeRenewFunction(){
    if(initialTimeRenewPushed) {
        setTimeout(() => {
            timeRenew.push({
                x: cWidth,
                y: Math.floor(Math.random() * ( (maxHeight - timerImage.height) - minHeight) + minHeight)
            })

            timeRenewFunction();
            document.querySelector(".time").classList.remove("timeShake");
        }, 10 * 1000);
    } else {
        setTimeout(() => {
            timeRenewFunction();
        }, 20 * 1000);
    }
}
timeRenewFunction();

// Pause game
function pauseGame(){
    // Display the menu
    pauseMenu.style.display = "flex";

    // Clear the interval for the game
    clearInterval(game);
    clearInterval(enemiesShootingInterval);
    clearInterval(graduallyRestoreInterval);
    clearInterval(countdown);

    // Stop enemies and ship from moving
    gameStarted = false;
    // Enemies shoot every 2 seconds
    enemiesSpawned = false;

    // Divide the difference to get milliseconds.
    pausedTime = (new Date() - startingTime) / 1000;
    Math.floor(pausedTime);
}

// Continue game
function continueGame(){
    // Hide the menu
    pauseMenu.style.display = "none";

    // Run the interval
    game = setInterval(draw, 1000 / 60);
    enemiesShootingInterval = setInterval(enemiesShoot, 700);
    graduallyRestoreInterval = setInterval(graduallyRestore, 800);
    timer(secondsLeft);

    // Enable enemies and ship movement
    gameStarted = true;
    // Enemies shoot every 2 seconds
    enemiesSpawned = true;

    // Continue measuring time after game was paused
    pausedTime *= 1000;
}

// Exit game
document.querySelectorAll(".exitGame").forEach(exit => exit.addEventListener("click", ()=>{
    location.reload();
}))

// About menu show/hide
const aboutMenu = document.querySelector(".aboutMenu");
document.getElementById("about").addEventListener("click", ()=>{
    aboutMenu.style.display = "block";
})
document.getElementById("closeAbout").addEventListener("click", ()=>{
    aboutMenu.style.display = "none";
})

// Menu buttons sounds
const mainMenuButtons = document.querySelectorAll(".main-menu_buttons");
const menuMove = new Audio();
const menuSelect = new Audio();
menuMove.volume = 0.35;
menuMove.src = `${endPath}/assets/audio/menu hover.wav`
menuSelect.volume = 0.35;
menuSelect.src = `${endPath}/assets/audio/menu select.wav`;
mainMenuButtons.forEach(btn => btn.addEventListener("mouseover", ()=>{
    menuMove.currentTime = 0;
    menuMove.play();
}))
mainMenuButtons.forEach(btn => btn.addEventListener("click", ()=>{
    menuSelect.currentTime = 0;
    menuSelect.play();
}))

// Event listeners
document.addEventListener("keydown", movement);
document.addEventListener("keyup", clearShipCommands);
document.querySelector("#startGame").addEventListener("click", loadGame);
document.addEventListener("keydown", shoot);
document.querySelector("#openMenu").addEventListener("click", pauseGame);
document.querySelector("#continueGame").addEventListener("click", continueGame);
soundControl.forEach(control => control.addEventListener("click", toggleMusic));