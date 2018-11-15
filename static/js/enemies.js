import Game from "./game.js";

const fullPath = window.location.pathname;
const splitPath = fullPath.split('/');
if (splitPath[splitPath.length - 1] == 'index.html') {
	splitPath.pop();
}
const endPath = splitPath.length > 2 ? splitPath.join('/') : '';
let minHeight = 0;
let maxHeight = 500;
class Enemies {
    constructor() {
        this.speed = 1;
        this.spawnDistance = 1200;
        this.enemiesArray = [];
        this.ammo = [];
        this.spawned = true;
        this.shootingSpeed = 700;
        
        this.enemyShip = new Image();
        this.enemyMissile = new Image(); 
        this.enemyShooting = new Audio();


        this.x = Game.width;
        // this.y = Math.floor(Math.random() * ( (Game.maxHeight - this.enemyShip.height) - Game.minHeight) + Game.minHeight);

        this.enemyShip.src = `${endPath}/assets/images/enemy.png`; // moved to enemies
        this.enemyMissile.src = `${endPath}/assets/images/enemyRocket.png`; // moved to enemies
        this.enemyShooting.src = `${endPath}/assets/audio/laser1.ogg`; // moved to enemies

    }

    spawnEnemies() {
        this.enemiesArray.push({
            x: 1280 - this.enemyShip.width,
            y: Math.floor(Math.random() * ( (maxHeight-this.enemyShip.height) - minHeight) + minHeight)
        })
    }

    shoot() {
        if(this.spawned) {
            let minShip = 0;
            let maxShip = this.enemiesArray.length - 1;
            let randomShip = Math.floor(Math.random() * (maxShip - minShip + 1)) + minShip;
            // Randomize
            this.ammo.push({
                x: this.enemiesArray[randomShip].x - this.enemyShip.width,
                y: this.enemiesArray[randomShip].y + (this.enemyShip.height / 2)
            })

            this.enemyShooting.currentTime = 0;
            this.enemyShooting.play();
            console.log(randomShip);
        }
        console.log(this.ammo);
    }
}
const enemies = new Enemies();


// let enemiesShootingInterval = setInterval(enemies.shoot.bind(enemies), enemies.shootingSpeed);