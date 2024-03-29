import Application from "./Application";

export default class Animations {

    constructor() {
        this.application = new Application()
        this.ambientVisible = false;
        this.ambientIntensity = 0.02;
        this.ambientColor = 0xffffff;
        this.physics = this.application.physics

        this.theSunIsShining = true;
        this.direction = 0;
        this.directionSpeed = 0.05;
        this.rotationSpeed = 0.05;
        this.rotation = 0;
        this.showInGameMenu = false
        this.escapeReadyForNext = false
        this.isJumping = false;
        this.ct = 0
    }

    update(currentlyPressedKeys, deltaTime) {
        this.updateHero(currentlyPressedKeys) // metode plassert her med forbehold om flere ting som skal oppdateres ved keypress
        this.inGameMenuHandler(currentlyPressedKeys)
    }

    toggle() {
        this.showInGameMenu ? console.log('on') : console.log('off')
        this.showInGameMenu = !this.showInGameMenu;
    }

    inGameMenuHandler(currentlyPressedKeys) {
        let x = document.getElementById("inGameMenu");
        if (currentlyPressedKeys["Escape"]) {
            x.style.display = "block";
        } else if (!currentlyPressedKeys["Escape"]) {
            x.style.display = "none";
        }
    }

    updateHero(currentlyPressedKeys) {

        if (currentlyPressedKeys["KeyW"]) {
            this.direction -= 1
            this.playMovingSound()

        }
        if (currentlyPressedKeys["KeyS"]) {
            this.direction += 1
            this.playMovingSound()
        }
        if (currentlyPressedKeys["KeyD"]) {
            this.rotation -= 1
            this.playMovingSound()
        }
        if (currentlyPressedKeys["KeyA"]) {
            this.rotation += 1
            this.playMovingSound()

        }
        if (currentlyPressedKeys["ShiftLeft"]) {
            this.directionSpeed = 0.1
            this.isRunning = true
        } else {
            this.directionSpeed = 0.05
            this.isRunning = false
        }

        this.isJumping = !!currentlyPressedKeys["Space"];
    }

    playMovingSound() {
        if (!this.isJumping) {
            if (this.isRunning) {
                if (!this.application.audio.walking.isPlaying) {
                    this.application.audio.walking.play();
                }
            } else {
                if (!this.application.audio.walking.isPlaying) {
                    this.application.audio.walking.play();
                }
            }
        }
    }

}