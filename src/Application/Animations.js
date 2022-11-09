import Application from "./Application";

export default class Animations {

    constructor() {
        this.application = new Application()
        this.ambientVisible = true;
        this.ambientIntensity = 0.2;
        this.ambientColor = 0xffffff;
        this.physics = this.application.physics
        this.pWorld = this.physics.world

        this.theSunIsShining = true;

        this.heroPos = {
            x: 0,
            z: 0,
            speed: 0.1
        }


    }


    update(currentlyPressedKeys) {
        if (currentlyPressedKeys["KeyW"]) {
            // this.heroPos.z -= this.heroPos.speed
            // let mesh = this.application.world.testObjects.cubeHero.mesh
            // .moveRigidBody(mesh, {x: 0, y: 0, z: 1})

        }
        // if (currentlyPressedKeys["KeyS"]) {
        //     this.heroPos.z += this.heroPos.speed
        // }
        // if (currentlyPressedKeys["KeyD"]) {
        //     this.heroPos.x += this.heroPos.speed
        // }
        // if (currentlyPressedKeys["KeyA"]) {
        //     this.heroPos.x -= this.heroPos.speed
        // }
    }


}