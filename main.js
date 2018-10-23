// Globals
let d;
let game;
let score = 0;
let shipHP = 100;
let shield = 100;
let overheat = 0;
let boost = 100;
let meteorSpawnDistance = 1200;
let meteorsSpeed = 1;
const displayShipHP = document.querySelector(".ship-hpFill");
const displayShield = document.querySelector(".shipShield-fill");
const notificationText = document.querySelector(".notification");
const menu = document.querySelector(".menu");
const displayScore = document.querySelector("#score");
const displayImage = document.querySelector("#displayImage");
const message = document.querySelector("#message");
const pauseMenu = document.querySelector(".pause--menu");
const displaySpeedBooster = document.querySelector(".speedBooster-fill");
const overheatText = document.querySelector("#overheatText");
const boosterText = document.querySelector("#boosterText");

// Flag variables
let isSpaceDown = false;
let gameStarted = false;
let isOverheated = false;
let enemiesSpawned = false;
let displayTimer = false;
let speedBooster = false;
let shieldDestroyed = false;

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
const alienMissileSound = new Audio();
const explosionSound = new Audio();
const timerImage = new Image();

ship.src = "images/spaceship.png";
bg.src = "images/bg2.jpg";
enemy.src = "images/enemySpaceship.png";
missile.src = "images/testRocket.png";
explosion.src = `images/explosion/2.png`;
firstAid.src = "images/firstAid.png";
alienMissile.src = "images/testEnemyRocket.png";
missileSound.src = "Audio/weapon_player.wav";
missileSound.volume = 0.1;
explosionSound.src = "Audio/explosion_asteroid.wav";
explosionSound.volume = 0.1;
alienMissileSound.src = "Audio/weapon_enemy.wav";
alienMissileSound.volume = 0.1;
timerImage.src = "images/timer.png";

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

// Start game
function startGame(){
    const mainMenu = document.querySelector(".main-menu");
    mainMenu.classList.add("mainMenuFade")

    setTimeout(() => {
        mainMenu.style.display = "none";
        
        // Display the MENU/SCORE panel
        menu.style.display = "flex";
        setTimeout(() => {
            menu.classList.add("menuActive");
        }, 5000);

        // Show the info box
        const infobox = document.querySelector(".infobox");
        infobox.style.display = "flex";
        setTimeout(() => {
            infobox.classList.add("infoBoxActive");

            // After 5 seconds make the infobox fade away. (remove the active class).
            setTimeout(() => {
                infobox.classList.remove('infoBoxActive')

                // Activate enemies and ship movement.
                gameStarted = true;

                // Enemies shoot every 2 seconds
                enemiesSpawned = true;

                // Display timer
                displayTimer = true;
                
                // Start the timer countdown untill boss spawns
                timer(time);
            }, 5000);
        }, 1000);

        const controlsInfo = document.querySelector(".controlsInfo");
        setTimeout(() => {
            controlsInfo.style.display = "block";

            // Hide the controls info
            setTimeout(() => {
                controlsInfo.classList.add("controlsInfoActive");
            }, 2000);
        }, 8000);

        game = setInterval(draw, 1000/60);
    }, 2500);
}

// Move the spaceship
function shipCommands(e){
    let key = e.keyCode;
    console.log(key);
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
            if(boost >= 5 && boost <= 100) {
                speedBooster = true;
                playerSpeed = 15;
                // Empty out the speed booster
                boost = boost - 5;
                displaySpeedBooster.style.width = `${boost}%`;
                boosterText.textContent = boost+'%';
            }
            // Disable speed boost if it reaches 0
            if(boost <= 0) {
                speedBooster = false;
                playerSpeed = 5;
                fillBooster();
            }
            console.log(boost);
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
const overheatFill = document.querySelector(".gunOverheat-fill");
function overheated(){
    overheat = overheat + 5;
    overheatFill.style.width = `${overheat}%`;
    overheatText.textContent = overheat+'%';
    // If overheat meter reaches max(100), stop the ship from shooting, when it starts cooling off enable shooting.
    if(overheat == 100) {
        isOverheated = true;
        coolOut();
    } else if (overheat < 100 && overheat > 0) {
        isOverheated = false;
    }
}

// Gradually cool out the gun BEFORE it reaches overheating point
function graduallyCoolOut(){
    if(overheat <= 95 && overheat > 5) {
        overheat = overheat - 5;
        overheatFill.style.width = `${overheat}%`;
        overheatText.textContent = overheat+'%';
    }
}
const cooloutInterval = setInterval(graduallyCoolOut, 800)

// When gun overheats, wait 1 second, then cool it out and enable shooting.
function coolOut(){
    setTimeout(() => {
        overheat = 0;
        isOverheated = false;
        overheatFill.style.width = `${overheat}%`;
        overheatText.textContent = overheat+'%';
    }, 1000);
}

// Gradually fill booster
function graduallyFillBooster() {
    if(boost >= 5 && boost <= 95) {
        boost = boost + 5;
        displaySpeedBooster.style.width = `${boost}%`;
        boosterText.textContent = boost+'%';
    }
}
const boosterInterval = setInterval(graduallyFillBooster, 800);
// If speed booster is empty (0), fill it up instantly after 3 seconds
function fillBooster() {
    setTimeout(() => {
        boost = 100;
        speedBooster = true;
        displaySpeedBooster.style.width = `${boost}%`;
        boosterText.textContent = boost+'%';
    }, 3000);
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

            enemies[i].x -= meteorsSpeed;

            if(enemies[i].x == meteorSpawnDistance) {
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

                    // Delete enemy from screen and add points.
                    // destroyEnemy();
                    
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

    // Display health renew with a timeout
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

    // Display time renew 
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
        }
    }
    // Start moving the timer image
    setTimeout(() => {
        for(let i = 0; i < timeRenew.length; i++) {
            timeRenew[i].x--;
        }
        initialTimeRenewPushed = true;
    }, 15 * 1000);

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
            displayNotification(secondsLeft);
        }
        if(secondsLeft < 0) {
            // If the timer ran out, end the game
            clearInterval(countdown);
            clearInterval(game);
            endgame();
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
    secondsLeft = secondsLeft + 15;
    timer(secondsLeft);
    console.log({time, secondsLeft});
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
        alienMissileSound.currentTime = 0;
        alienMissileSound.play();
        }
}

const enemiesShootingInterval = setInterval(enemiesShoot, enemiesShootingSpeed);

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
        meteorsSpeed = 2;
        displayNotification();
    }
    if (score == 5000) {
        meteorsSpeed = 4;
        meteorSpawnDistance = 1000;
        enemiesShootingSpeed = 550;
        displayNotification();
    }
    if(score == 8000) {
        enemiesShootingSpeed = 350;
    }
    if(score == 10000) {
        enemiesShootingSpeed = 100;
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
    // Decrease from shield if its between 10 and 100
    if(shield >= 10 && shield <= 100) {
        shield = shield - 10;
        displayShield.style.width = `${shield}%`;
        document.querySelector("#shieldText").textContent = shield+'%';
    }
    // If shield is at 0, mark it as destroyed
    if(shield == 0) {
        shieldDestroyed = true;
    }
}

// SHIP HEALTH:
function decreaseShipHP()   {
    if(shieldDestroyed) {
        shipHP = shipHP - 20;
        displayShipHP.style.width = `${shipHP}%`;
        // Change the text in the bar
        document.querySelector("#hpText").textContent = shipHP+'%';

        if(shipHP == 0) {
            endgame();
            clearInterval(game);
            clearInterval(enemiesShootingInterval);
        }
    }
}

function restoreShipHP() {
    if(shipHP == 100) {
        shipHP = shipHP;
    } else {
        shipHP = shipHP + 20;
        displayShipHP.style.width = `${shipHP}%`;
        notificationText.innerHTML = `<i class="material-icons">local_hospital</i><p>Health renewed!</p>`;
        displayNotification();
    }
}

// When the game has ended / been completed.
function endgame(){
    // Disable intervals
    clearInterval(enemiesShootingInterval);
    clearInterval(cooloutInterval);
    clearInterval(boosterInterval);
    clearInterval(countdown);

    // Stop movements
    gameStarted = false;

    // Game Over / Game finished menu
    const gameOver = document.querySelector(".game--over");
    gameOver.style.display = "block";

    // If player was killed.
    if(shipHP === 0){
        displayImage.src = "images/gravestone.svg";
        message.textContent = "Thank you for your service. At least you tried.";
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
    if(initialHealthPushed == true) {
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

// Spawn timer to add more time to play every 10-15 seconds
function timeRenewFunction(){
    if(initialTimeRenewPushed == true) {
        setTimeout(() => {
            timeRenew.push({
                x: cWidth,
                y: Math.floor(Math.random() * ( (maxHeight - timerImage.height) - minHeight) + minHeight)
            })

            timeRenewFunction();
        }, 15 * 1000);
    } else {
        setTimeout(() => {
            timeRenewFunction();
        }, 15 * 1000);
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
    clearInterval(cooloutInterval);
    clearInterval(boosterInterval);
    clearInterval(countdown);

    // Stop enemies and ship from moving
    gameStarted = false;
}

// Continue game
function continueGame(){
    // Hide the menu
    pauseMenu.style.display = "none";

    // Run the interval
    game = setInterval(draw, 1000 / 60);
    enemiesShootingInterval = setInterval(enemiesShoot, 700);
    cooloutInterval = setInterval(graduallyCoolOut, 800);
    boosterInterval = setInterval(graduallyFillBooster, 800);

    // Enable enemies and ship movement
    gameStarted = true;
}

// Exit game
document.querySelectorAll(".exitGame").forEach(exit => exit.addEventListener("click", ()=>{
    location.reload();
}))

// Event listeners
document.addEventListener("keydown", shipCommands);
document.addEventListener("keyup", clearShipCommands);
document.querySelector("#startGame").addEventListener("click", startGame);
document.addEventListener("keyup", shoot);
document.querySelector("#openMenu").addEventListener("click", displayPauseMenu);
document.querySelector("#continueGame").addEventListener("click", continueGame);


