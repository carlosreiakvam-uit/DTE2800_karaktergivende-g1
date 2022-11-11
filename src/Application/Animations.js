import Application from "./Application";

export default class Animations {

    constructor() {
        this.application = new Application()
        this.ambientVisible = true;
        this.ambientIntensity = 0.2;
        this.ambientColor = 0xffffff;
        this.physics = this.application.physics

        this.theSunIsShining = true;

    }

    updateHero(currentlyPressedKeys) {
        const hero = application.world.scene.getObjectByName('cubeHero') // initialisere utenfra?

        if (hero) {
            const heroPhysBod = hero.userData.physicsBody
            if (currentlyPressedKeys["KeyW"]) {
                // prøver å finne velocity for hero for å sette max speed
                // forsøk så langt gjør kun at hero stopper etter en viss tid med nedpresset w
                if (heroPhysBod.velZ < heroPhysBod.maxVel) {
                    this.physics.applyImpulse(heroPhysBod, heroPhysBod.moveForce, {x: 0, y: 0, z: -1})
                    heroPhysBod.velZ += 1
                }
            } else if (heroPhysBod.velZ > 0) {
                heroPhysBod.velZ -= 1
            }
            if (currentlyPressedKeys["KeyS"]) {
                this.physics.applyImpulse(heroPhysBod, heroPhysBod.moveForce, {x: 0, y: 0, z: 1})
            }
            if (currentlyPressedKeys["KeyD"]) {
                this.physics.applyImpulse(heroPhysBod, heroPhysBod.moveForce, {x: 1, y: 0, z: 0})
            }
            if (currentlyPressedKeys["KeyA"]) {
                this.physics.applyImpulse(heroPhysBod, heroPhysBod.moveForce, {x: -1, y: 0, z: 0})
            }

            if (currentlyPressedKeys["Space"]) {
                if (heroPhysBod.isJumping === false) {
                    this.physics.applyImpulse(heroPhysBod, heroPhysBod.jumpForce, {x: 0, y: 1, z: 0})
                    heroPhysBod.isJumping = true // er kun true så lenge man holder inne space
                    // tar ikke høyde for at man kan hoppe flere ganger mens man er i lufta
                }
            } else {
                heroPhysBod.isJumping = false
            }
        }

    }

    update(currentlyPressedKeys) {
        const fallingCube = application.world.scene.getObjectByName('fallingCube')

    }


}