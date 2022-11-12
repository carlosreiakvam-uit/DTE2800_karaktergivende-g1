import Application from "./Application";

export default class Animations {

    constructor() {
        this.application = new Application()
        this.ambientVisible = true;
        this.ambientIntensity = 0.2;
        this.ambientColor = 0xffffff;
        this.physics = this.application.physics

        this.theSunIsShining = true;
        this.lastPosZ = 0
        this.lastPosX = 0
    }

    update(currentlyPressedKeys, deltaTime) {
        this.updateHero(currentlyPressedKeys, deltaTime) // metode plassert her med forbehold om flere ting som skal oppdateres ved keypress
    }

    getVel(thisPos, lastPos, deltaTime) {
        return Math.abs((lastPos - thisPos) / deltaTime) // not absolute value in order to also determine direction
    }

    move(physBod, direction, force, velocity) {
        if (velocity < physBod.maxVel) {
            this.physics.applyImpulse(physBod, force, direction)
        }
    }


    updateHero(currentlyPressedKeys, deltaTime) {
        const hero = application.world.scene.getObjectByName('cubeHero') // initialisere utenfra?

        if (hero) {
            const heroPhysBod = hero.userData.physicsBody
            console.log('velZPos', heroPhysBod.velZPos)
            console.log('velZNeg', heroPhysBod.velZNeg)

            // MOVE UP
            if (currentlyPressedKeys["KeyW"]) {
                let posNow = hero.position.z
                heroPhysBod.velZPos = this.getVel(posNow, this.lastPosZ, deltaTime)
                this.move(heroPhysBod, {x: 0, y: 0, z: -1}, heroPhysBod.moveForce, heroPhysBod.velZPos)
                this.lastPosZ = posNow
            } else if (heroPhysBod.velZPos > 0.5) {
                let posNow = hero.position.z
                heroPhysBod.velZPos = this.getVel(hero.position.z, this.lastPosZ, deltaTime)
                this.move(heroPhysBod, {x: 0, y: 0, z: 1}, heroPhysBod.stopForce, heroPhysBod.velZPos)
                this.lastPosZ = posNow
            }

            // MOVE DOWN
            if (currentlyPressedKeys["KeyS"]) {
                let posNow = hero.position.z
                heroPhysBod.velZNeg = this.getVel(posNow, this.lastPosZ, deltaTime)
                this.move(heroPhysBod, {x: 0, y: 0, z: 1}, heroPhysBod.moveForce, heroPhysBod.velZNeg)
                this.lastPosZ = posNow
            } else if (heroPhysBod.velZNeg > 0.5) {
                let posNow = hero.position.z
                heroPhysBod.velZNeg = this.getVel(hero.position.z, this.lastPosZ, deltaTime)
                this.move(heroPhysBod, {x: 0, y: 0, z: -1}, heroPhysBod.stopForce, heroPhysBod.velZNeg)
                this.lastPosZ = posNow
            }

            // MOVE RIGHT
            if (currentlyPressedKeys["KeyD"]) {
                let posNow = hero.position.x
                heroPhysBod.velXPos = this.getVel(posNow, this.lastPosX, deltaTime)
                this.move(heroPhysBod, {x: 1, y: 0, z: 0}, heroPhysBod.moveForce, heroPhysBod.velXPos)
                this.lastPosX = posNow
            } else if (heroPhysBod.velXPos > 0.5) {
                let posNow = hero.position.x
                heroPhysBod.velXPos = this.getVel(hero.position.x, this.lastPosX, deltaTime)
                this.move(heroPhysBod, {x: -1, y: 0, z: 0}, heroPhysBod.stopForce, heroPhysBod.velXPos)
                this.lastPosX = posNow
            }

            // MOVE LEFT
            if (currentlyPressedKeys["KeyA"]) {
                let posNow = hero.position.x
                heroPhysBod.velXNeg = this.getVel(posNow, this.lastPosX, deltaTime)
                this.move(heroPhysBod, {x: -1, y: 0, z: 0}, heroPhysBod.moveForce, heroPhysBod.velXNeg)
                this.lastPosX = posNow
            } else if (heroPhysBod.velXNeg > 0.5) {
                let posNow = hero.position.x
                heroPhysBod.velXNeg = this.getVel(hero.position.x, this.lastPosX, deltaTime)
                this.move(heroPhysBod, {x: 1, y: 0, z: 0}, heroPhysBod.stopForce, heroPhysBod.velXNeg)
                this.lastPosX = posNow
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


}