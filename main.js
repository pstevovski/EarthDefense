// Globals
let d; // Player ship direction
let game;
let score = 0;
let shipHP = 100;
let shield = 100;
let overheat = 0;
let boost = 100;
let enemySpawnDistance = 1200;
let enemySpeed = 1;
const notificationText = document.querySelector(".notification");
const menu = document.querySelector(".menu");
const displayScore = document.querySelector("#score");
const displayImage = document.querySelector("#displayImage");
const message = document.querySelector("#message");
const pauseMenu = document.querySelector(".pause--menu");
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
let minHeight = 0;
let maxHeight = 500;

// Assets
const bg = new Image();
const ship = new Image();
const enemy = new Image();
const missile = new Image();
const explosion = new Image();
const firstAid = new Image();
const alienMissile = new Image();
const missileSound = new Audio();
const enemyShootingSound = new Audio();
const explosionSound = new Audio();
const timerImage = new Image();
const shieldImage = new Image();
const music = new Audio();
const restoreSoundEffect = new Audio();

ship.src = "images/player.png";
bg.src = "images/background.png";
enemy.src = "images/enemy.png";
missile.src = "images/test.png";
explosion.src = `images/explosion/2.png`;
firstAid.src = "images/firstAid.png";
alienMissile.src = "images/testEnemyRocket.png";
missileSound.src = "Audio/weapon_player.wav";
missileSound.volume = 0.05;
explosionSound.src = "Audio/explosion_asteroid.wav";
explosionSound.volume = 0.1;
enemyShootingSound.src = "Audio/laser1.ogg";
enemyShootingSound.volume = 0.05;
timerImage.src = "images/timer.png";
shieldImage.src = "images/shieldImage.png";
music.src = "Audio/Crimson Drive.mp3";
music.volume = 0.3;
music.loop = true;
restoreSoundEffect.src = "Audio/powerUp11.ogg";
restoreSoundEffect.volume = 0.5;

// Play the theme music when page is loaded
music.play();

// Spaceship starting coordinates
let shipX = 50;
let shipY = 250;
let hitBoundary = false;
let playerSpeed = 5;

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
let alienAmmo = [];

// Timer variables
let countdown;
const timerDisplay = document.querySelector("#timerDisplay");
const time = 30;

// Sound control
function toggleMusic() {
    soundOff = !soundOff;
    if(soundOff) {
        this.src = "images/soundOff.png";
        music.volume = 0;
    } else {
        this.src = "images/soundOn.png";
        music.volume = 0.2;
    }
}

// Load game
function loadGame() {
    // Play loading music
    music.src = "Audio/loading.wav";
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
        setTimeout(() => {
            menu.classList.add("menuActive");
            healthContainer.style.display = "block";
            shieldContainer.style.display = "block";
        }, 500);

        // Pre-start countdown - 3 seconds then GO !
        let preGame = 3;
        const preGameCountdown = document.querySelector(".countdown");
        preGameCountdown.style.display = "block";
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
        music.src = "Audio/Mecha Collection.mp3";
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
        }, 3000);

        game = setInterval(draw, 1000 / 60);
    }, 500);
}

// Move the spaceship
function shipCommands(e){
    let key = e.keyCode;
    // If game has started, enable ship movement.
    if(gameStarted) { 
        if(key == 37) {
            d = "LEFT"
        } else if (key == 38) {
            d = "UP"
        } else if (key == 39) {
            d = "RIGHT"
        } else if (key == 40) {
            d = "DOWN"
        }

        // Player spaceship speed boost
        if(key == 16 && d == "LEFT" || key == 16 && d == "RIGHT") {
            if(boost > 0 && boost <= 100) {
                speedBooster = true;
                playerSpeed = 10;
                // Empty out the speed booster
                boost = boost - 1;
            }
            // Disable speed boost if it reaches 0
            if(boost <= 0) {
                speedBooster = false;
                playerSpeed = 5;
                emptyWarningText.textContent = "BOOSTER EMPTY !";
                emptyWarningText.classList.add("emptyWarning-textActive");
                fillBooster();
            }
        }
    }
}

// Clear spaceship's commands when key is released
function clearShipCommands() {
    playerSpeed = 5;
    speedBooster = false;
}

// Player shoots
function shoot(e){
    let key = e.keyCode;
    if(gameStarted && isOverheated == false) { 
        if(key == 32) {
            isSpaceDown = true;
            // Display the rocket WHEN the user shoots.
            ammo.push({
                x: shipX + ship.width,
                y: shipY + (ship.height / 2)
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
function overheated(){
    overheat = overheat + 5;

    // If overheat meter reaches max(100), stop the ship from shooting, when it starts cooling off enable shooting.
    if(overheat == 100) {
        isOverheated = true;
        emptyWarningText.textContent = "OVERHEATED !";
        emptyWarningText.classList.add("emptyWarning-textActive");
        coolOut();
    } else if (overheat < 100 && overheat > 0) {
        isOverheated = false;
    }
}

// Gradually cool out the gun BEFORE it reaches overheating point
function graduallyRestore(){
    // Restore / coolout gun overheating
    if(overheat <= 95 && overheat >= 5) {
        overheat = overheat - 5;
    }

    // Restore ship's booster
    if(boost >= 0 && boost <= 99) {
        boost = boost + 1;
    }
}
let graduallyRestoreInterval = setInterval(graduallyRestore, 800)

// // When gun overheats, wait 1 second, then cool it out and enable shooting.
function coolOut(){
    setTimeout(() => {
        overheat = 0;
        isOverheated = false;
        emptyWarningText.classList.remove("emptyWarning-textActive");
    }, 2000);
}

// If speed booster is empty (0), fill it up instantly after 3 seconds
function fillBooster() {
    setTimeout(() => {
        boost = 100;
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
            if(shipX + ship.width >= enemies[i].x && shipX <= enemies[i].x + enemy.width && shipY + ship.height >= enemies[i].y && shipY <= enemies[i].y + enemy.height) {
                // Draw explosion at those coords.
                ctx.drawImage(explosion, enemies[i].x - enemy.width, enemies[i].y - enemy.height);
                
                // Delete the enemy from screen.
                let enemiesArray = enemies[i];
                let enemiesArrayIndex = enemies.indexOf(enemiesArray);
                if(enemiesArrayIndex > -1) {
                    enemies.splice(enemiesArrayIndex, 1);
                }
                
                // Deduct shield on hit
                decreaseShield();

                // Deduct HP on hit.
                decreaseShipHP();
                
                // Update the score
                updateScore();

                explosionSound.currentTime = 0;
                explosionSound.play();

                // If spaceship HP reaches 0, end game.
                if(shipHP == 0) {
                    clearInterval(game);
                    endgame();
                }
            }
            // Remove the alien space ship from the enemies array.
            if(enemies[i].x + enemy.width < 0) {
                enemies.splice(enemies[i], 1);
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

            // Ammo colides enemy
            for(let i = 0; i < enemies.length; i++) {
                if(ammo[j].x >= enemies[i].x && ammo[j].x <= enemies[i].x + enemy.width && ammo[j].y >= enemies[i].y && ammo[j].y <= enemies[i].y + enemy.height){
                    // Draw explosion of the enemy.
                    ctx.drawImage(explosion, enemies[i].x - enemy.width, enemies[i].y - enemy.height);

                    // Remove the missiles
                    let missile = ammo[j];
                    let missileIndex = ammo.indexOf(missile);
                    if(missileIndex > -1) {
                        ammo.splice(missileIndex, 1);
                    }

                    // Remove the enemy from screen
                    let enemiesArray = enemies[i];
                    let enemiesArrayIndex = enemies.indexOf(enemiesArray);
                    if(enemiesArrayIndex > -1) {
                        enemies.splice(enemiesArrayIndex, 1)
                    }
                    explosionSound.play();
                    explosionSound.currentTime = 0;
                    updateScore();
                }
            }

            // If player's ammo goes past canvas width
            if(ammo[j].x > cWidth){
                let missile = ammo[j];
                let missileIndex = ammo.indexOf(missile);
                if(missileIndex > -1) {
                    ammo.splice(missileIndex, 1);
                }
            }
        }
    }

    // HEALTH RESTORATION
    for(let i = 0; i < healthRenew.length; i++){
        ctx.drawImage(firstAid, healthRenew[i].x, healthRenew[i].y);

        // If the ship touches the health, restore the ship's HP.
        if(shipX + ship.width >= healthRenew[i].x && shipX <= healthRenew[i].x + firstAid.width && shipY + ship.height >= healthRenew[i].y && shipY <= healthRenew[i].y + firstAid.height) {
            // Remove the HP restore.
            let hpItem = healthRenew[i];
            let hpIndex = healthRenew.indexOf(hpItem);
            if(hpIndex > -1) {
                healthRenew.splice(hpIndex, 1)
            }
            // Restore ship's HP.
            restoreShipHP();
            // Play Sound effect
            restoreSound();
        }
        // If HP restore goes past the canvas width, remove it.
        if(healthRenew[i].x + firstAid.width < 0 ) {
            healthRenew.splice(healthRenew[i], 1);
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

        // If the ship touches the shield, renew its shield.
        if(shipX + ship.width >= shieldRenew[i].x && shipX <= shieldRenew[i].x + shieldImage.width && shipY + ship.height >= shieldRenew[i].y && shipY <= shieldRenew[i].y + shieldImage.height) {
            // Remove the shield from screen
            let shieldItem = shieldRenew[i];
            let shieldIndex = shieldRenew.indexOf(shieldItem);
            if(shieldIndex > -1) {
                shieldRenew.splice(shieldIndex, 1);
            }

            // Restore 50 points to the player ship shield
            restoreShield();
            // Play Sound effect
            restoreSound();
        }
        // If the shield item goes off canvas, remove it
        if(shieldRenew[i].x + shieldImage.width < 0) {
            shieldRenew.splice(shieldRenew[i], 1);
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
        if(shipX + ship.width >= timeRenew[i].x && shipX <= timeRenew[i].x + timerImage.width && shipY + ship.height >= timeRenew[i].y && shipY <= timeRenew[i].y + timerImage.height) {
            // Remove the timer from the array
            let timerItem = timeRenew[i];
            let timerIndex = timeRenew.indexOf(timerItem);
            if(timerIndex > -1) {
                timeRenew.splice(timerIndex, 1);
            }
            // Add time
            addPlaytime();

            // Play Sound effect
            restoreSound();
        }

        // If clock goes past canvas
        if(timeRenew[i].x < 0) {
            timeRenew.splice(timeRenew[i], 1);
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
        shipX -= playerSpeed;
    }
    if(d == "RIGHT"){
        shipX += playerSpeed;
    }
    if(d == "UP") {
        shipY -= playerSpeed;
    }
    if(d == "DOWN") {
        shipY += playerSpeed;
    }

    // ALIEN (ENEMY) ROCKETS
    if(gameStarted && enemiesSpawned){
        for(let i = 0; i < alienAmmo.length;i++) {
            ctx.drawImage(alienMissile, alienAmmo[i].x, alienAmmo[i].y);
            alienAmmo[i].x -= 15;
        
            if(alienAmmo[i].x >= shipX && alienAmmo[i].x <= shipX + ship.width && alienAmmo[i].y >= shipY && alienAmmo[i].y <= shipY + ship.height && enemiesSpawned == true ) {
                // Draw explosion at the spot
                ctx.drawImage(explosion, shipX, shipY);
        
                // Run function when player's ship is hit.
                playerHit();
            }

            // If the alien rocket goes behind player's ship
            if(alienAmmo[i].x < 0) {
                let alienRocket = alienAmmo[i];
                let alienRocketIndex = alienAmmo.indexOf(alienRocket);
                if(alienRocketIndex > -1) {
                    alienAmmo.splice(alienRocketIndex, 1)
                }
            }
        }
    }

    // If spaceship hits the boundry, remove the direction
    if(shipX <= 0) {
        shipX += 5;
    } else if (shipX >= 1300 - ship.width) {
        shipX -= 5;
    } else if (shipY <= 0) {
        shipY += 5;
    } else if (shipY >= 500 - ship.height) {
        shipY -= 5;
    }

    // Draw the ship
    ctx.drawImage(ship, shipX, shipY);
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
        let maxShip = enemies.length;
        minShip = Math.ceil(minShip);
        maxShip = Math.floor(maxShip);
        let randomShip = Math.floor(Math.random() * (maxShip - minShip + 1)) + minShip;
        // Randomize
        alienAmmo.push({
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
    // Destroy the alien ammo upon hit
    for(let i = 0; i < alienAmmo.length; i++) {
        let alienRockets = alienAmmo[i];
        let alienIndex = alienAmmo.indexOf(alienRockets);
        if(alienIndex > -1) {
            alienAmmo.splice(alienIndex, 1);
        } 
    }
    // Decrease shield
    decreaseShield();

    // Decrease ship HP
    decreaseShipHP();
    if(shipHP == 0) {
        endgame();
        clearInterval(game);
    }
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

// SHIP SHIELD

function decreaseShield() {
    // Decrease shield
    if(shield >= 20 && shield <= 100) {
        shield = shield - 20;
        shieldContainer.removeChild(shieldContainer.children[0]);
    }
    // If shield is at 0, mark it as destroyed
    if(shield == 0) {
        shieldDestroyed = true;
    }
}

// SHIP HEALTH:
function decreaseShipHP() {
    // BUGGED (?)
    if(shieldDestroyed) {
        if(shipHP <= 100){
            shipHP = shipHP - 20;
            healthContainer.removeChild(healthContainer.children[0]);
        } else if(shipHP == 0) {
            endgame();
            clearInterval(game);
            clearInterval(enemiesShootingInterval);
        }
    }
}

const dispalyHealthItem = document.createElement("img");
dispalyHealthItem.setAttribute('src', 'images/firstAid.png');
dispalyHealthItem.setAttribute('width', '32px');
dispalyHealthItem.setAttribute('height', '32px');

function restoreShipHP() {
    // BUGGED (?)
    if(shipHP == 100) {
        shipHP = shipHP;
    } else{
        healthContainer.insertBefore(dispalyHealthItem, healthContainer.firstChild);
        shipHP = shipHP + 20;
        notificationText.innerHTML = `<i class="material-icons health">local_hospital</i><p>Health renewed!</p>`;
        displayNotification();
    }
}
const displayShieldItem = document.createElement("img");
displayShieldItem.setAttribute('src', 'images/shieldImage.png');
displayShieldItem.setAttribute('width', '32px');
displayShieldItem.setAttribute('height', '32px');

function restoreShield() {
    if(shield == 100) {
        shield = shield;
    } else if(shield <= 80){
        shield = shield + 20;
        shieldContainer.appendChild(displayShieldItem);
        notificationText.innerHTML = `<i class="material-icons shield">security</i><p>Shield restored!</p>`;
        displayNotification();
    }
    shieldDestroyed = false;
}

// When the game has ended / been completed.
function endgame(secondsLeft){
    // Disable intervals
    clearInterval(enemiesShootingInterval);
    clearInterval(graduallyRestoreInterval);
    clearInterval(countdown);

    // Stop movements
    gameStarted = false;

    // Game Over / Game finished menu
    const gameOver = document.querySelector(".game--over");
    gameOver.style.display = "block";

    // If player was killed.
    if(shipHP === 0){
        displayImage.src = "images/tombstone.png";
        message.textContent = "At least you tried...";
        music.src = "Audio/Fallen in Battle.mp3";
        music.volume = 0.2;
        music.play();
        music.loop = false;
    }
    if(secondsLeft <= 0) {
        message.textContent = "Time's up !"
        music.src = "Audio/Fallen in Battle.mp3";
        music.volume = 0.2;
        music.play();
        music.loop = false;
    }
    

    // Score and Highscore
    document.querySelector("#finalScore").textContent = score;
    let highscore = localStorage.getItem("highscore");
    document.querySelector("#highscore").textContent = highscore;
    if(score > highscore) {
        localStorage.setItem("highscore", score);
        document.querySelector("#highscore").textContent = localStorage.getItem("highscore");
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
function displayPauseMenu(){
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
}

// Continue game
function continueGame(){
    console.log({secondsLeft})
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
}

// Exit game
document.querySelectorAll(".exitGame").forEach(exit => exit.addEventListener("click", ()=>{
    location.reload();
}))

// Event listeners
document.addEventListener("keydown", shipCommands);
document.addEventListener("keyup", clearShipCommands);
document.querySelector("#startGame").addEventListener("click", loadGame);
document.addEventListener("keyup", shoot);
document.querySelector("#openMenu").addEventListener("click", displayPauseMenu);
document.querySelector("#continueGame").addEventListener("click", continueGame);
soundControl.forEach(control => control.addEventListener("click", toggleMusic));