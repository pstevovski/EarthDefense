const emptyWarningText = document.querySelector(".emptyWarning-text");
const blocks = document.querySelectorAll(".overheat-bar_block");
const shieldText = document.querySelector("#shieldText");
const healthText = document.querySelector("#healthText");

class Player {
    constructor() {
        this.d; // Direction
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
        this.level = 1;

        // Ship's default commands
        this.left = 37;
        this.right = 39;
        this.up = 38;
        this.down = 40;
        this.shooting = 32;
        this.useBooster = 16;
        this.map = {};

        // Ship's coordinates
        this.shipX = this.x + this.ship.width;
        this.shipY = this.y + (this.ship.height / 2);

    };
    
    // Player movement
    playerMovement (e) {
        e = e || event;
        if(game.gameStarted) {
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
        // this.speed = speedIncreased;
        // ship.src = `${endPath}/assets/images/player.png`;
        // engineFlames.src = `${endPath}/assets/images/engineFlameNormal.png`;
    }

    shoot(e) {
        e = e || event;

        if(game.gameStarted && !this.isOverheated) {
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
        }

        //  Prevent default action if user sets shooting to be on alt, ctrl etc.
        e.preventDefault();
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
        if(this.hp === 100) {
            this.hp = this.hp;
        } else{
            // Restore ships HP and display a notification.
            this.hp = this.hp + 20;
            healthText.textContent = this.hp+"%";
            notificationText.innerHTML = `<i class="material-icons health">local_hospital</i><p>Health renewed!</p>`;
            game.displayNotification();
        }
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
onkeydown = onkeyup = player.playerMovement.bind(player);
document.addEventListener("keydown", player.shoot.bind(player));
document.addEventListener("keyup", player.clearShipCommands.bind(player));

// let graduallyRestoreInterval = setInterval(player.graduallyRestore, 300);




