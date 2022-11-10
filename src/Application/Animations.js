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
        const hero = application.world.scene.getObjectByName('cubeHero')
        const speed = 0.2
        if (currentlyPressedKeys["KeyW"]) {
            this.physics.moveRigidBody(hero, {x: 0, y: 0, z: -speed})
        }
        if (currentlyPressedKeys["KeyS"]) {
            this.physics.moveRigidBody(hero, {x: 0, y: 0, z: speed})
        }
        if (currentlyPressedKeys["KeyD"]) {
            this.physics.moveRigidBody(hero, {x: speed, y: 0, z: 0})
        }
        if (currentlyPressedKeys["KeyA"]) {
            this.physics.moveRigidBody(hero, {x: -speed, y: 0, z: 0})
        }
    }


}