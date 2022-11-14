import Application from "./Application";

export default class Animations {

    constructor() {
        this.application = new Application()
        this.ambientVisible = true;
        this.ambientIntensity = 0.2;
        this.ambientColor = 0xffffff;
        this.physics = this.application.physics

        this.theSunIsShining = true;
        this.direction = 0;
        this.directionSpeed = 0.05;
        this.rotationSpeed = 0.05;
        this.rotation = 0;
        this.isJumping = false;
        // this.lastPos = 0.1 // temp variable
    }

    update(currentlyPressedKeys, deltaTime) {
        this.updateHero(currentlyPressedKeys) // metode plassert her med forbehold om flere ting som skal oppdateres ved keypress
    }


    updateHero(currentlyPressedKeys) {

        if (currentlyPressedKeys["KeyW"]) {
            this.direction -= 1
        }
        if (currentlyPressedKeys["KeyS"]) {
            this.direction += 1

        }
        if (currentlyPressedKeys["KeyD"]) {
            this.rotation -= 1

        }
        if (currentlyPressedKeys["KeyA"]) {
            this.rotation += 1

        }
        if (currentlyPressedKeys["ShiftLeft"]) {
            this.directionSpeed = 0.1
        } else {
            this.directionSpeed = 0.05
        }

        this.isJumping = !!currentlyPressedKeys["Space"];
    }



}