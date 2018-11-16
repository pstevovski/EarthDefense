import Game from "./game.js";
import {Graphics, Sfx} from "./assets.js";

const emptyWarningText = document.querySelector(".emptyWarning-text");
const blocks = document.querySelectorAll(".overheat-bar_block");
const shieldText = document.querySelector("#shieldText");
const healthText = document.querySelector("#healthText");

export class Player {
    constructor() {
        this.d = null; // Direction
        this.x = 50;
        this.y = 250;
        this.speed = 5;
        this.hp = 100;
        this.shield = 100;
        this.overheat = 0;
        this.booster = 100;
        this.missileSpeed = 15;
        this.ammo = [];
        this.speedBooster = false;
        this.isOverheated = false;
        this.isSpaceDown = false;
        this.shieldDestroyed = false;

        // Player's level
        this.level = 1;
        this.exp = 0;
        this.requiredExp = 80;
        this.killCount = 0;

        // Ship's default commands
        this.left = 37;
        this.right = 39;
        this.up = 38;
        this.down = 40;
        this.shooting = 32;
        this.useBooster = 16;
        this.map = {};
    };

    updateKillCount() {
        this.killCount++;
        this.exp += 20;

        if(this.exp === this.requiredExp) {
            this.exp = 0;
            this.requiredExp = this.requiredExp * 2;

        }
    }
    
    // Player movement
    playerMovement (e) {
        e = e || event;
        if(game.isStarted) {
            this.map[e.keyCode] = e.type === "keydown";
            if(this.map[this.left] && this.map[this.up] || this.map[this.left] && this.map[this.up] && this.map[this.shooting]) {
                this.d = "UP_LEFT";
            }  else if (this.map[this.left] || this.map[this.left] && this.map[this.shooting]) {
                this.d = "LEFT"; 
            } else if(this.map[this.right] && this.map[this.up] || this.map[this.right] && this.map[this.up] && this.map[this.shooting]) {
                this.d = "UP_RIGHT";
            } else if(this.map[this.right] && this.map[this.down] || this.map[this.right] && this.map[this.down] && this.map[this.shooting]) {
                this.d = "DOWN_RIGHT";
            } else if(this.map[this.right] || this.map[this.right] && this.map[this.shooting]) {
                this.d = "RIGHT";
            } else if(this.map[this.down] || this.map[this.down] && this.map[this.shooting]) {
                this.d = "DOWN";
            } else if(this.map[this.up] || this.map[this.up] && this.map[this.shooting]) {
                this.d = "UP";
            }

            // Player uses speed booster
            if(this.map[this.useBooster] && this.d === "LEFT"
            || this.map[this.useBooster] && this.d === "RIGHT"){
                if(this.booster > 0 && this.booster <= 100) {
                    this.speedBooster = true;
                    this.speed += 10;

                    // Empty the booster
                    this.booster -= 2;
                }

                // Disable the booster if it reaches 0
                if(this.booster <= 0) {
                    this.speedBooster = false;
                    this.speed = this.speed;
                    emptyWarningText.textContent = "BOOSTER EMPTY !";
                    emptyWarningText.classList.add("emptyWarning-textActive");

                    // Play alarm sound
                    sfx.alarmSound.currentTime = 0;
                    sfx.alarmSound.play();

                    this.fillBooster();
                }
            }
        }
    }

    clearShipCommands() {
        this.isSpaceDown = false;
        this.speedBooster = false;
        this.d = "";
        // graphics.ship.src = `${endPath}/assets/images/player.png`;
        // this.speed = speedIncreased;
        // engineFlames.src = `${endPath}/assets/images/engineFlameNormal.png`;
    }

    shoot(e) {
        e = e || event;
        if(game.isStarted && !this.isOverheated) {
        if(this.isSpaceDown) return; // End the function if user is already holding space

        if(e.keyCode === this.shooting) {
            this.isSpaceDown = true;
            if(this.level < 3) {
                new Ammo(0);
            } else if (this.level >= 3 && this.level <= 5) {
                new Ammo(0)
                new Ammo(20);
            } else if (this.level >= 5 && this.level <= 7) {
                new Ammo(0);
                new Ammo(20);
                new Ammo(-20);
            }
            sfx.playerShooting.currentTime = 0;
            sfx.playerShooting.play();
            this.overheating();

            //  Prevent default action if user sets shooting to be on alt, ctrl etc.
            e.preventDefault();
        }
     }
    }

     // Overheating
     overheating() {
        this.overheat = this.overheat + 10;

        // If player.overheat meter reaches max(100), stop the ship from shooting, when it starts cooling off enable shooting.
        if(this.overheat === 100) {
            this.isOverheated = true;
            emptyWarningText.textContent = "OVERHEATED !";
            emptyWarningText.classList.add("emptyWarning-textActive");

            // Play alarm sound
            sfx.alarmSound.currentSrc = 0;
            sfx.alarmSound.play();


            this.coolOut();
        } else if (this.overheat > 0 && this.overheat < 100) {
            this.isOverheated = false;
            this.displayOverheating();
        }
     }

     // Display overheating by painting the blocks
     displayOverheating() {
         if(this.heat >= -1 && this.heat <= 10) {
             this.heat++;
         }

         // Cycle trough the blocks and add according classes.
         if(this.heat >= 0 && this.heat <= 3) {
             blocks[this.heat].classList.add("greenPhase");
         } else if(this.heat >= 4 && this.heat <= 6) {
             blocks[this.heat].classList.add("yellowPhase");
         } else if(this.heat >= 7 && this.heat <= 10) {
             blocks[this.heat].classList.add("redPhase");
         }
     }

    // Gradually restore guns heat and booster
    graduallyRestore() {
        if(this.overheat >= 10 && this.overheat <= 90) {
            this.overheat = this.overheat - 10;

            // Re-color the blocks (remove classes)
            if(this.heat >= 0 && this.heat <= 3) {
                blocks[this.heat].classList.remove("greenPhase");
                this.heat--;
            } else if (this.heat >= 4 && this.heat <= 6) {
                blocks[this.heat].classList.remove("yellowPhase");
                this.heat--;
            } else if(this.heat >= 7 && this.heat <= 10) {
                blocks[this.heat].classList.remove("redPhase");
                this.heat--;
            }
        }

        //  Restore ship's booster
        if(this.booster >= 0 && this.booster <= 98) {
            this.booster = this.booster + 2;
        }
    }

    // When guns overheat (reach 100), wait 3 seconds and restore to 0.
    coolOut() {
        setTimeout(() => {
            this.overheat = 0;
            this.isOverheated = false;
            emptyWarningText.classList.remove("emptyWarning-textActive");
            blocks.forEach(block => {
                block.classList.remove("greenPhase")
                block.classList.remove("yellowPhase")
                block.classList.remove("redPhase")
            });
            this.heat = -1;
        }, 2000);
    }

    // Restore the booster to max (100) after 5 seconds after it is emptied.
    restoreBooster() {
        setTimeout(() => {
            this.booster = 100;
            this.speedBooster = true;
            emptyWarningText.classList.remove("emptyWarning-textActive");
        }, 5000);
    }

    // If the player is hit by the enemies
    playerHit() {
        // Play explosion sound
        sfx.explosionSound.currentTime = 0; // ASSETS 
        sfx.explosionSound.play(); // ASSETS

        // Destroy the alien ammo upon hit
        for(let i = 0; i < enemy.ammo.length; i++) {
            let enemyRockets = enemy.ammo[i];
            let enemyRocketsIndex = enemy.ammo.indexOf(enemyRockets);
            if(enemyRocketsIndex > -1) {
                enemy.ammo.splice(enemyRocketsIndex, 1);
            } 
        }
        // Decrease shield
        this.decreaseShield();

        // Decrease ship HP
        this.decreaseShipHP();

        if(this.hp === 0) {
            game.endgame();
            clearInterval(game);
        }
    }

    // Restore the ship's HP
    restoreShipHP() {
        const healthText = document.querySelector("#healthText"); 
        if(this.hp === 100) {
            this.hp = this.hp;
        } else{
            // Restore ships HP and display a notification.
            this.hp = this.hp + 20;
            healthText.textContent = this.hp+"%";
            notificationText.innerHTML = `<i class="material-icons health">local_hospital</i><p>Health renewed!</p>`;
            game.displayNotification();
        }

        game.height;
    }

    // Decrease the ship's HP on hit
    decreaseShipHP() {
        if(this.hp >= 20 && this.hp <= 100 && this.shieldDestroyed){
            this.hp = this.hp - 20;
            healthText.textContent = this.hp+"%";
        } else if(this.hp === 0) {
            game.endgame();
            clearInterval(game);
            clearInterval(enemiesShootingInterval);
        }
    }

    // Restoring the ship's shield
    restoreShield() {
        if(this.shield == 100) {
            this.shieldDestroyed = false;
            this.shield = this.shield;
        } else if(this.shield <= 80){
            // Enable shield on player's ship
            this.shieldDestroyed = false;

            // Restore shield points and display a notification
            this.shield = this.shield + 20;
            shieldText.textContent = this.shield+"%";
            notificationText.innerHTML = `<i class="material-icons shield">security</i><p>Shield restored!</p>`;
            game.displayNotification();
        }
    }

    // Decrease the ship's shield on hit
    decreaseShield() {
        // Decrease shield
        if(this.shield >= 20 && this.shield <= 100) {
            this.shield = this.shield - 20;
            shieldText.textContent = this.shield+"%";
        } else if(this.shield < 20) {
            // If shield is at 0 (at 20% shield gets deducted 20, so it goes straight to 0), mark it as destroyed
            this.shieldDestroyed = true;
        }
    }

}

class Ammo {
    constructor(ammoY) {
        player.ammo.push({
            x: player.x,
            y: player.y + ammoY
        })
    }
}

const player = new Player();
const game = new Game();
const graphics = new Graphics();
const sfx = new Sfx();

onkeydown = onkeyup = player.playerMovement.bind(player);
document.addEventListener("keydown", player.shoot.bind(player));
document.addEventListener("keyup", player.clearShipCommands.bind(player));

// let graduallyRestoreInterval = setInterval(player.graduallyRestore, 300);

/////////////////////////////////////////////////////////////////////////////////////////////////////

// let d; // Player ship direction
// let score = 0;
// let killCount = 0;
// const displayKills = document.querySelector("#killCount");
// const overheatContainer = document.querySelector(".overheat-container");
// const overheatProgress = document.querySelector(".overheat-progress");
// const shieldContainer = document.querySelector(".shield-container");
// const healthContainer = document.querySelector(".health-container");
// let isSpaceDown = false;
// let isOverheated = false;
// let speedBooster = false;
// let shieldDestroyed = false;
// Player spaceship properties
// let player = {
//     x: 50,
//     y: 250,
//     speed: 5,
//     hp: 100,
//     shield: 100,
//     overheat: 0,
//     boost: 100,
//     missileSpeed: 15,
// }
// let engineFlameX;
// let engineFlameY;

// // Player ammo
// const ammo = [];
// Default ship controls
// let left = 37 // Left arrow key
// let up = 38; // Up arrow key
// let right = 39; // Right arrow key
// let down = 40; // Down arrow key
// let shooting = 32; // Space
// let useBooster = 16; // Shift
// Move the spaceship
// let map = {}
// onkeydown = onkeyup = function (e) {
//     e = e || event;
//     if(gameStarted) {
//         map[e.keyCode] = e.type == "keydown";
//         if(map[left] && map[up] || map[left] && map[up] && map[shooting]) {
//             d = "UP_LEFT"
//         } else if(map[left] && map[down] || map[left] && map[down] && map[shooting]) {
//             d = "DOWN_LEFT"
//         } else if(map[left] || map[left] && map[shooting]) {
//             d = "LEFT";
//         } else if(map[right] && map[up] || map[right] && map[up] && map[shooting]) {
//             d = "UP_RIGHT";
//         } else if(map[right] && map[down] || map[right] && map[down] && map[shooting]) {
//             d = "DOWN_RIGHT"
//         } else if(map[right] || map[right] && map[shooting]) {
//             d = "RIGHT";
//         } else if(map[down] || map[down] && map[shooting]) {
//             d = "DOWN";
//         } else if(map[up] || map[up] && map[shooting]) {
//             d = "UP";
//         }
//         // Player spaceship speed boost
//         if(map[useBooster] && d =="LEFT" || map[useBooster] && d == "RIGHT") {
//             if(player.boost > 0 && player.boost <= 100) {
//                 speedBooster = true;
//                 player.speed += 10;
//                 // Empty out the speed booster
//                 player.boost = player.boost - 2;
//                 engineFlames.src = `${endPath}/assets/images/engineFlameBooster.png`;
//             }
//             // Disable speed boost if it reaches 0
//             if(player.boost <= 0) {
//                 speedBooster = false;
//                 player.speed = player.speed;
//                 emptyWarningText.textContent = "BOOSTER EMPTY !";
//                 emptyWarningText.classList.add("emptyWarning-textActive");
//                 alarm.currentSrc = 0;
//                 alarm.play();
//                 fillBooster();
//             }
//         }
//     }
// }
// Clear spaceship's commands when key is released
// function clearShipCommands() {
//     player.speed = speedIncreased;
//     speedBooster = false;
//     isSpaceDown = false;
//     d = "";
//     ship.src = `${endPath}/assets/images/player.png`;
//     engineFlames.src = `${endPath}/assets/images/engineFlameNormal.png`;
// }
// Player shoots
// function shoot(e){
//     const key = e.keyCode;
//     if(gameStarted && !isOverheated) { 
//         if(isSpaceDown) return; // If space is already pressed and hold, end the function.
//         if(key == shooting) {
//             isSpaceDown = true;
//             // Display the rocket WHEN the user shoots.
//             if(level < 3) {
//                 ammo.push({
//                     x: player.x + ship.width,
//                     y: player.y + (ship.height / 2)
//                 })
//             } else if(level >= 3 && level <= 5) {
//                 ammo.push({
//                     x: player.x + ship.width,
//                     y: player.y + (ship.height / 2)
//                 })
//                 ammo.push({
//                     x: player.x + ship.width,
//                     y: player.y - 10
//                 })
//             } else if(level >= 6) {
//                 ammo.push({
//                     x: player.x + ship.width,
//                     y: player.y + (ship.height / 2)
//                 })
//                 ammo.push({
//                     x: player.x + ship.width,
//                     y: player.y - (ship.height / 2 - 10)
//                 })
//                 ammo.push({
//                     x: player.x + ship.width,
//                     y: player.y + (ship.height / 2 + 30)
//                 })
//             } // NOT THE BEST ammo upgrade system, will need to rework this later on.
//             missileSound.play();
//             missileSound.currentTime = 0;
//             overheated();
//         }
//     }
//     // In case user sets shooting control to be alt/ctrl etc.
//     e.preventDefault();
// }
// Overheat the spaceship's guns.
// const emptyWarningText = document.querySelector(".emptyWarning-text");
// const blocks = document.querySelectorAll(".overheat-bar_block");
// let heat = -1;
// Display the overheating by painting the blocks
// function heatingUp() {
//     if(heat >= -1 && heat <= 10) {
//         heat++;
//     }
//     if(heat >= 0 && heat <= 3) {
//         blocks[heat].classList.add("greenPhase");
//     } else if (heat >= 4 && heat <= 6) {
//         blocks[heat].classList.add("yellowPhase");
//     } else if (heat >= 7 && heat <= 10) {
//         blocks[heat].classList.add("redPhase");
//     }
// }
// Increase the overheat of the ship and see if it reaches "boiling" point
// function overheated(){
//     player.overheat = player.overheat + 10;

//     // If player.overheat meter reaches max(100), stop the ship from shooting, when it starts cooling off enable shooting.
//     if(player.overheat == 100) {
//         isOverheated = true;
//         emptyWarningText.textContent = "OVERHEATED !";
//         emptyWarningText.classList.add("emptyWarning-textActive");
//         alarm.currentSrc = 0;
//         alarm.play();
//         coolOut();
//     } else if (player.overheat < 100 && player.overheat > 0) {
//         isOverheated = false;
//         heatingUp();
//     }
// }
// Gradually cool out the gun BEFORE it reaches overheating point
// function graduallyRestore(){
//     if(player.overheat <= 90 && player.overheat >= 10) {
//         player.overheat = player.overheat - 10;
        
//         // Coolout the ship's heat
//         if(heat >= 0 && heat <= 3) {
//             blocks[heat].classList.remove("greenPhase");
//             heat--;
//         } else if(heat >= 4 && heat <= 6) {
//             blocks[heat].classList.remove("yellowPhase");
//             heat--;
//         } else if(heat >= 7 && heat <= 10) {
//             blocks[heat].classList.remove("redPhase");
//             heat--;
//         }
//     }

//     // Restore ship's booster
//     if(player.boost >= 0 && player.boost <= 99) {
//         player.boost = player.boost + 2;
//     }
// }
// let graduallyRestoreInterval = setInterval(graduallyRestore, 300)
// When gun overheats, wait 1 second, then cool it out and enable shooting.
// function coolOut(){
//     setTimeout(() => {
//         player.overheat = 0;
//         isOverheated = false;
//         emptyWarningText.classList.remove("emptyWarning-textActive");
//         blocks.forEach(block => {
//             block.classList.remove("greenPhase")
//             block.classList.remove("yellowPhase")
//             block.classList.remove("redPhase")
//         });
//         heat = -1;
//     }, 2000);
// }
// If speed booster is empty (0), fill it up instantly after 3 seconds
// function fillBooster() {
//     setTimeout(() => {
//         player.boost = 100;
//         speedBooster = true;
//         emptyWarningText.classList.remove("emptyWarning-textActive");
//     }, 6000);
// }
// When player's ship is hit by aliens missiles
// function playerHit(){
//     explosionSound.currentTime = 0;
//     explosionSound.play();

//     // Destroy the alien ammo upon hit
//     for(let i = 0; i < enemyAmmo.length; i++) {
//         let enemyRockets = enemyAmmo[i];
//         let enemyRocketsIndex = enemyAmmo.indexOf(enemyRockets);
//         if(enemyRocketsIndex > -1) {
//             enemyAmmo.splice(enemyRocketsIndex, 1);
//         } 
//     }
//     // Decrease shield
//     decreaseShield();

//     // Decrease ship HP
//     decreaseShipHP();
//     if(player.hp == 0) {
//         endgame();
//         clearInterval(game);
//     }
// }
// Update the score
// let exp = 0;
// let requiredExp = 80;
// let currentExp = document.querySelector("#currentExp");
// let requiredExpText = document.querySelector("#requiredExp");
// let levelBar = document.querySelector(".level-bar_fill");
// const currentLevel = document.querySelector("#currentLevel");
// let level = 1;
// function updateKillCount() {
//     // Update score
//     killCount++;
//     displayKills.textContent = killCount;

//     // Increase EXPERIENCE.
//     exp += 20;
//     currentExp.textContent = exp;

//     // When required exp per level is met, increase level
//     if(exp == requiredExp) {
//         exp = 0;
//         requiredExp = requiredExp * 2;
//         currentExp.textContent = exp;
//         requiredExpText.textContent = requiredExp + "XP";
//         levelUp(); 
//     }
//     // Fill the bar to display xp progress
//     let levelExp = (exp / requiredExp) * 100;
//     levelBar.style.width = `${levelExp}%`;
// }

// // Player levels up
// let speedIncreased = 5;
// function levelUp() {
//     // Increase the level and update the text
//     level++;
//     currentLevel.textContent = level;

//     shieldDestroyed = false;

//     // Increase player's ship speed each time player levels up
//     speedIncreased++;
//     player.speed = speedIncreased;
//     player.missileSpeed += 1;

//     // Restore health and shield to the ship
//     if(player.hp <= 60) {
//         player.hp = player.hp + 40;
//     }
//     if(player.shield <= 80) {
//         player.shield = player.shield + 20;
//     }

//     healthText.textContent = player.hp + "%";
//     shieldText.textContent = player.shield + "%";
// }
// const shieldText = document.querySelector("#shieldText");
// const healthText = document.querySelector("#healthText");

// // SHIP HEALTH:
// function restoreShipHP() {
//     if(player.hp == 100) {
//         player.hp = player.hp;
//     } else{
//         // Restore ships HP and display a notification.
//         player.hp = player.hp + 20;
//         healthText.textContent = player.hp+"%";
//         notificationText.innerHTML = `<i class="material-icons health">local_hospital</i><p>Health renewed!</p>`;
//         displayNotification();
//     }
// }
// function decreaseShipHP() {
//     if(player.hp >= 20 && player.hp <= 100 && shieldDestroyed){
//         player.hp = player.hp - 20;
//         healthText.textContent = player.hp+"%";
//     } else if(player.hp == 0) {
//         endgame();
//         clearInterval(game);
//         clearInterval(enemiesShootingInterval);
//     }
// }

// // SHIP SHIELD
// function restoreShield() {
//     if(player.shield == 100) {
//         shieldDestroyed = false;
//         player.shield = player.shield;
//     } else if(player.shield <= 80){
//         // Enable shield on player's ship
//         shieldDestroyed = false;

//         // Restore shield points and display a notification
//         player.shield = player.shield + 20;
//         shieldText.textContent = player.shield+"%";
//         notificationText.innerHTML = `<i class="material-icons shield">security</i><p>Shield restored!</p>`;
//         displayNotification();
//     }
// }
// function decreaseShield() {
//     // Decrease shield
//     console.log(player.shield)
//     if(player.shield >= 20 && player.shield <= 100) {
//         player.shield = player.shield - 20;
//         shieldText.textContent = player.shield+"%";
//     } else if(player.shield < 20) {
//         // If shield is at 0 (at 20% shield gets deducted 20, so it goes straight to 0), mark it as destroyed
//         shieldDestroyed = true;
//     }
// }
// document.addEventListener("keyup", clearShipCommands);
// document.addEventListener("keyup", shoot);




