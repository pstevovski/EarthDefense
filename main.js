// Globals
let d;
let game;
const menu = document.querySelector(".menu");
let spaceshipX;
let spaceshipY;

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

ship.src = "images/spaceship.png";
bg.src = "images/gameBg.png";
meteor.src = "images/meteor.png";
// console.log(ship.height, ship.width);

// Spaceship starting coordinates
let shipX = 50;
let shipY = 250;

// Spaceship ammo
let ammo =[]
ammo[0]= {
    x: shipX + ship.width,
    y: shipY + (ship.height / 2)
}
// Meteors
let meteors = [];
meteors[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * (maxHeight - minHeight) + minHeight) 
}


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

        game = setInterval(draw, 50);
    }, 2500);
}
let isSpaceDown = false;
// Move the spaceshipt
function shipCommands(e){
    let key = e.keyCode;
    // console.log(key)
    if(key == 37) {
        d = "LEFT"
    } else if (key == 38) {
        d = "UP"
    } else if (key == 39) {
        d = "RIGHT"
    } else if (key == 40) {
        d = "DOWN"
    }
     else if (key == 32) {
        shoot();
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
                y: Math.floor(Math.random() * (maxHeight - minHeight) + minHeight)
            })
        }

         // If spaceship and meteor colide
        if(shipX + ship.width >= meteors[i].x && shipX <= meteors[i].x + meteor.width && shipY + ship.height >= meteors[i].y && shipY <= meteors[i].y + meteor.height) {
            // clearInterval(game);
            console.log("dead")
        }
    }
    // // Ammo (rockets) hit the meteor. BUGGED - CRASHES CHROME

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
    if(shipX == 0 || shipX >= 1300 - ship.width || shipY == 0 || shipY >= 500 - ship.height) {
        d = "";
    }

    // console.log({shipX, shipY});
    // Draw the ship
    ctx.drawImage(ship, shipX, shipY);
}
console.log(ship.width, ship.height);
console.log(meteor.width, meteor.height);
console.log(shipX, shipY);
console.log(meteors[0].x, meteors[0].y)

// Event listeners
document.addEventListener("keydown", shipCommands);
document.querySelector("#startGame").addEventListener("click", startGame);


