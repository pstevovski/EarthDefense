const fullPath = window.location.pathname;
const splitPath = fullPath.split('/');
if (splitPath[splitPath.length - 1] == 'index.html') {
	splitPath.pop();
}
const endPath = splitPath.length > 2 ? splitPath.join('/') : '';
const displayChange = document.querySelectorAll(".displayChange");
const soundControl = document.querySelectorAll(".soundControl");
const mainMenuButtons = document.querySelectorAll(".main-menu_buttons");

// Sound effects
class Sfx {
    constructor() {
        this.music = new Audio();
        this.goVoice = new Audio();
        this.alarmSound = new Audio();
        // this.enemyShooting = new Audio(); moved to enemies
        this.playerShooting = new Audio();
        this.explosionSound = new Audio();
        this.restorationSound = new Audio();
        
        this.playerShooting.src = `${endPath}/assets/audio/weapon_player.wav`;
        this.explosionSound.src = `${endPath}/assets/audio/explosion_enemy.wav`;
        // this.enemyShooting.src = `${endPath}/assets/audio/laser1.ogg`; // moved to enemies
        this.music.src = `${endPath}/assets/audio/music_background.wav`;
        this.restorationSound.src = `${endPath}/assets/audio/powerUp11.ogg`;
        this.alarmSound.src = `${endPath}/assets/audio/alarm.wav`;
        this.goVoice.src =`${endPath}/assets/audio/go.ogg`;
        
        this.sfxVolume = 0.3;
        this.musicVolume = 0.4;
        this.music.loop = true;
        this.soundOff = false;
        this.controllingVolume = false;

        this.playerShooting.volume = this.sfxVolume;
        this.explosionSound.volume = this.sfxVolume;
        this.enemyShooting.volume = this.sfxVolume;
        this.music.volume = this.musicVolume;
        this.restorationSound.volume = this.sfxVolume;
        this.alarmSound.volume = this.sfxVolume;
        this.goVoice.volume = 0.1;

        // Menu sounds
        this.menuMove = new Audio();
        this.menuSelected = new Audio();
        this.menuMove.src = `${endPath}/assets/audio/menu hover.wav`
        this.menuSelected.src = `${endPath}/assets/audio/menu select.wav`;

    }

    // Toggle all music / sound on and off
    toggleMusic() {
        this.soundOff = !this.soundOff;
        if(this.soundOff) {
            // this.src = `${endPath}/assets/images/soundOff.png`;
            this.music.volume = 0;
            this.playerShooting.volume = 0;
            this.explosionSound.volume = 0;
            this.enemyShooting.volume = 0;
            this.restorationSound.volume = 0;
            this.alarm.volume = 0;
        } else {
            // this.src = `${endPath}/assets/images/soundOn.png`;
            this.playerShooting.volume = sfx;
            this.explosionSound.volume = sfx;
            this.enemyShooting.volume = sfx;
            this.music.volume = musicVolume;
            this.restorationSound.volume = sfx;
            this.volume = sfx;
        }
    }

    // Play restoration sound effect when player picks up health, shield or timer.
    restorationEffect() {
        this.restorationSound.currentTime = 0;
        this.restorationSound.play();
    }

    // Control the volume
    controlVolume() {
        console.log(this);
        if(this.controllingVolume) {
        displayChange.forEach(change => {
                if(this.name === change.id) {
                    change.textContent = this.value +"%";
                }
                // If input name is SFX, edit SFX volume. If input name is bgMusic, edit music volume.
                if(this.name === "sfx") {
                    sfx.sfxVolume = this.value / 100;
                    sfx.playerShooting.volume = sfx.sfxVolume;
                    sfx.explosionSound.volume = sfx.sfxVolume;
                    sfx.enemyShooting.volume = sfx.sfxVolume;
                    sfx.restorationSound.volume = sfx.sfxVolume;
                    sfx.alarm.volume = sfx;
                } else if(this.name === "bgMusic") {
                    sfx.musicVolume = this.value / 100;
                    sfx.music.volume = sfx.musicVolume;
                }
            })
        }
    }
}
const sfx = new Sfx();

// Hover on menues
mainMenuButtons.forEach(button => button.addEventListener("mouseover", ()=>{
    sfx.menuMove.currentTime = 0;
    sfx.menuMove.play();
}))

// Select menues
mainMenuButtons.forEach(button => button.addEventListener("click", ()=>{
    sfx.menuSelected.currentTime = 0;
    sfx.menuSelected.play();
}))

const volumeControls = document.querySelectorAll(`.settings-menu input[type="range"]`);
volumeControls.forEach(control => control.addEventListener("mousedown", ()=>{
    sfx.controllingVolume = true;
}))
volumeControls.forEach(control => control.addEventListener("mouseup", ()=>{
    sfx.controllingVolume = false;
}))
volumeControls.forEach(control => control.addEventListener("change", sfx.controlVolume));
volumeControls.forEach(control => control.addEventListener("mousemove", sfx.controlVolume));

////////////////////////////////////////////
// let soundOff = false;




