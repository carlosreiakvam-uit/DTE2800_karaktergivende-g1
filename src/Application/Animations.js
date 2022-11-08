export default class Animations {


    constructor() {
        this.ambientVisible = true;
        this.ambientIntensity = 0.2;
        this.ambientColor = 0xffffff;

        this.theSunIsShining = true;

        this.heroPos = {
            x: 0,
            z: 0,
            speed: 0.1
        }


    }


    update(currentlyPressedKeys) {
        if (currentlyPressedKeys["KeyW"]) {
            this.heroPos.z -= this.heroPos.speed
        }
        if (currentlyPressedKeys["KeyS"]) {
            this.heroPos.z += this.heroPos.speed
        }
        if (currentlyPressedKeys["KeyD"]) {
            this.heroPos.x += this.heroPos.speed
        }
        if (currentlyPressedKeys["KeyA"]) {
            this.heroPos.x -= this.heroPos.speed
        }
    }


}