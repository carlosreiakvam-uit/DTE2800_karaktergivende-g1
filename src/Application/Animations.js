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
        // this.lastPos = 0.1 // temp variable
    }

    update(currentlyPressedKeys, deltaTime) {
        this.updateHero(currentlyPressedKeys, deltaTime) // metode plassert her med forbehold om flere ting som skal oppdateres ved keypress
    }

    getVel(thisPos, lastPos, deltaTime) {
        return Math.abs((lastPos - thisPos) / deltaTime)
    }

    move(object, direction, deltaTime, posNow, lastPos) {
        const physBod = object.userData.physicsBody
        let vel = this.getVel(posNow, lastPos, deltaTime)
        console.log(vel)
        if (vel < physBod.maxVel) {
            this.physics.applyImpulse(physBod, physBod.moveForce, direction)
        }
    }

    updateHero(currentlyPressedKeys, deltaTime) {
        const hero = application.world.scene.getObjectByName('cubeHero') // initialisere utenfra?

        if (hero) {
            const heroPhysBod = hero.userData.physicsBody
            // console.log(hero.position.z)
            if (currentlyPressedKeys["KeyW"]) {
                let posNow = hero.position.z
                this.move(hero, {x: 0, y: 0, z: -1}, deltaTime, posNow, this.lastPosZ)
                this.lastPosZ = posNow
            }
            if (currentlyPressedKeys["KeyS"]) {
                let posNow = hero.position.z
                this.move(hero, {x: 0, y: 0, z: 1}, deltaTime, posNow, this.lastPosZ)
                this.lastPosZ = posNow
            }
            if (currentlyPressedKeys["KeyD"]) {
                let posNow = hero.position.x
                this.move(hero, {x: 1, y: 0, z: 0}, deltaTime, posNow, this.lastPosX)
                this.lastPosX = posNow
            }
            if (currentlyPressedKeys["KeyA"]) {
                let posNow = hero.position.x
                this.move(hero, {x: -1, y: 0, z: 0}, deltaTime, posNow, this.lastPosX)
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