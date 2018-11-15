// Graphics
class Graphics {
    constructor() {
        this.bg = new Image();
        this.ship = new Image();
        // this.enemy = new Image(); // moved to enemies
        this.missile = new Image();
        this.explosion = new Image();
        this.timerImage = new Image();
        this.healthImage = new Image();
        this.shieldImage = new Image();
        // this.enemyMissile = new Image(); // moved to enemies
        this.engineFlames = new Image();

        this.bg.src = `${endPath}/assets/images/background.png`;
        this.ship.src = `${endPath}/assets/images/player.png`;
        // this.enemy.src = `${endPath}/assets/images/enemy.png`; // moved to enemies
        this.missile.src = `${endPath}/assets/images/playerRocket.png`;
        this.explosion.src = `${endPath}/assets/images/3.png`;
        this.healthImage.src = `${endPath}/assets/images/firstAid.png`;
        // this.enemyMissile.src = `${endPath}/assets/images/enemyRocket.png`; // moved to enemies
        this.timerImage.src = `${endPath}/assets/images/timer.png`;
        this.shieldImage.src = `${endPath}/assets/images/shieldImage.png`;
        this.engineFlames.src = `${endPath}/assets/images/engineFlameNormal.png`;
    }
};

const graphics = new Graphics();