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

        this.hero = {
            x: 0,
            z: 0,
            moveForce: 1,
            jumpForce: 5,
            isJumping: false
        }


    }

    updateHero(currentlyPressedKeys) {
        const heroObject = application.world.scene.getObjectByName('cubeHero') // finn en måte å initialisere på forhånd?

        if (currentlyPressedKeys["KeyW"]) {
            this.physics.applyImpulse(heroObject.userData.physicsBody, this.hero.moveForce, {x: 0, y: 0, z: -1})
            // console.log('ape',heroObject.userData.physicsBody.getLinearVelocity())
        }
        if (currentlyPressedKeys["KeyS"]) {
            this.physics.applyImpulse(heroObject.userData.physicsBody, this.hero.moveForce, {x: 0, y: 0, z: 1})
        }
        if (currentlyPressedKeys["KeyD"]) {
            this.physics.applyImpulse(heroObject.userData.physicsBody, this.hero.moveForce, {x: 1, y: 0, z: 0})
        }
        if (currentlyPressedKeys["KeyA"]) {
            this.physics.applyImpulse(heroObject.userData.physicsBody, this.hero.moveForce, {x: -1, y: 0, z: 0})
        }

        if (currentlyPressedKeys["Space"]) {
            if (this.hero.isJumping === false) {
                this.physics.applyImpulse(heroObject.userData.physicsBody, this.hero.jumpForce, {x: 0, y: 1, z: 0})
                this.hero.isJumping = true
            }
        } else {
            this.hero.isJumping = false
        }

    }

    update(currentlyPressedKeys) {
        const fallingCube = application.world.scene.getObjectByName('fallingCube')

    }


}