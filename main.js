// Globals
let d;
let game;
let score = 0;
let shipHP = 100;
let earthHP = 100;
let isSpaceDown = false;
let displayShipHP = document.querySelector(".ship-hpFill");
let displayEarthHP = document.querySelector(".earth-hpFill");
const menu = document.querySelector(".menu");
const displayScore = document.querySelector("#score");

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
const meteor = new Image();
const missile = new Image();
const explosion = new Image();
const firstAid = new Image();

ship.src = "images/spaceship.png";
bg.src = "images/gameBg.png";
meteor.src = "images/meteor.png";
missile.src = "images/torpedo.png";
explosion.src = "images/explosion.png";
firstAid.src = "images/firstAid.png";

// Spaceship starting coordinates
let shipX = 50;
let shipY = 250;
let hitBoundary = false;

// Spaceship ammo
let ammoX = shipX + ship.width;
let ammoY = shipY + (ship.height / 2);

// Meteors
let meteors = [];
meteors[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight-meteor.height) - minHeight) + minHeight)
}

// Health renew
let healthRenew = [];
healthRenew[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight - firstAid.height) - minHeight) + minHeight)
}
let initialHealthPushed = false;
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
        }, 500);

        // Show the info box
        const infobox = document.querySelector(".infobox");
        infobox.style.display = "flex";
        setTimeout(() => {
            infobox.classList.add("infoBoxActive");

            // After 5 seconds make the infobox fade away. (remove the active class).
            setTimeout(() => {
                infobox.classList.remove('infoBoxActive')
            }, 5000);
        }, 1000);

        game = setInterval(draw, 1000/60);
    }, 2500);
}
// Move the spaceship
function shipCommands(e){
    let key = e.keyCode;
    if(key == 37) {
        d = "LEFT"
    } else if (key == 38) {
        d = "UP"
    } else if (key == 39) {
        d = "RIGHT"
    } else if (key == 40) {
        d = "DOWN"
    }
}
function shoot(e){
    let key = e.keyCode;
    if(key == 32) {
        isSpaceDown = true;
        ammoX = shipX + ship.width;
        ammoY = shipY + (ship.height / 2);
    } else {
        isSpaceDown = false;
    }
}

setInterval(updateRocketPosition, 2);
function updateRocketPosition(){
        ctx.drawImage(missile, ammoX, ammoY);
        ammoX += 5;

        for(let i = 0; i < meteors.length; i++) {
            if(ammoX >= meteors[i].x && ammoX <= meteors[i].x + meteor.width && ammoY >= meteors[i].y && ammoY <= meteors[i].y + meteor.height){
                // Draw explosion of the meteor.
                ctx.drawImage(explosion, meteors[i].x - meteor.width, meteors[i].y - meteor.height);

                // Delete meteor from screen
                destroyMeteor();
            }
        }
}

function draw(){
    canvas.style.display = "block";
    ctx.drawImage(bg, 0,0);

    for(let i = 0; i < meteors.length;i++){
        // Draw a meteor
        ctx.drawImage(meteor, meteors[i].x, meteors[i].y);

        meteors[i].x--;

        if(meteors[i].x == 1200) {
            meteors.push({
                x: cWidth,
                y: Math.floor(Math.random() * ( (maxHeight-meteor.height) - minHeight) + minHeight) 
            })
        }
        // If spaceship and meteor colide
        if(shipX + ship.width >= meteors[i].x && shipX <= meteors[i].x + meteor.width && shipY + ship.height >= meteors[i].y && shipY <= meteors[i].y + meteor.height) {
            // Draw explosion at those coords.
            ctx.drawImage(explosion, meteors[i].x - meteor.width, meteors[i].y - meteor.height);

            // Delete the meteor from screen.
            destroyMeteor();

            // Deduct HP on hit.
            decreaseShipHP();

            // If spaceship HP reaches 0, end game.
            if(shipHP == 0) {
                clearInterval(game);
                endgame();
            }
        }

        // If meteor goes past the canvas width, remove.
        if(meteors[i].x + meteor.width < 0) {
            meteors.splice(meteors[i], 1);

            // Decrease earth's HP.
            decreaseEarthHP();
            
            // End game if earth is destroyed.
            if(earthHP == 0) {
                clearInterval(game);
                endgame();
            }
        }
    }
    // Create a new meteor if all meteors on screen are destroyed.
    if(meteors.length == 0) {
        meteors.push({
            x: cWidth,
            y: Math.floor(Math.random() * ( (maxHeight-meteor.height) - minHeight) + minHeight) 
        })
    }

    // Display health renew with a timeout (every 15 seconds)
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
    setTimeout(() => {
        for(let i = 0; i < healthRenew.length; i++) {
            healthRenew[i].x--;
        }
        initialHealthPushed = true;
    }, 5 * 1000);

    // Move the ship
    if(d == "LEFT") {
        shipX -= 5;
    }
    if(d == "RIGHT"){
        shipX += 5;
    }
    if(d == "UP") {
        shipY -= 5;
    }
    if(d == "DOWN") {
        shipY += 5;
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

function destroyMeteor(){
    for(let i = 0; i < meteors.length; i++) {
        // Ammo hits meteor
        let ammoDestroysMeteor = ammoX >= meteors[i].x && ammoX <= meteors[i].x + meteor.width && ammoY >= meteors[i].y && ammoY <= meteors[i].y + meteor.height;

        // Ship hits meteor
        let shipDestroysMeteor = shipX + ship.width >= meteors[i].x && shipX <= meteors[i].x + meteor.width && shipY + ship.height >= meteors[i].y && shipY <= meteors[i].y + meteor.height;

        // Either the ammo destorys the meteor, or the ship.
        if(ammoDestroysMeteor || shipDestroysMeteor) {
            let item = meteors[i];
            let index = meteors.indexOf(item);
            if(index > -1) {
                meteors.splice(index, 1);
            }
            // Update score
            score += 100;
            displayScore.textContent = score;
        }
    }
}

function decreaseShipHP()   {
    shipHP = shipHP - 20;
    displayShipHP.style.width = `${shipHP}%`;
}

function restoreShipHP() {   
    if(shipHP == 100) {
        shipHP = shipHP;
    } else {
        shipHP = shipHP + 20;
        displayShipHP.style.width = `${shipHP}%`;
    }
}
function decreaseEarthHP() {
    earthHP = earthHP  - 20;
    displayEarthHP.style.width = `${earthHP}%`;
}
function endgame(){
    const gameOver = document.querySelector(".game--over");
    gameOver.style.display = "block";
}

// Health renew callback function to push into the array - WONT SHOW
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

// Exit game
document.querySelector("#exitGame").addEventListener("click", ()=>{
    location.reload();
})

// Event listeners
document.addEventListener("keydown", shipCommands);
document.querySelector("#startGame").addEventListener("click", startGame);
document.addEventListener("keyup", shoot);



