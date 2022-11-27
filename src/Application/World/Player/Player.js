import Application from "../../Application.js";
import * as THREE from 'three'
import * as constant from "../../Utils/Constants.js";


export default class Player {
    constructor(position = {x: 70, y: 0.5, z: 0}) {
        this.application = new Application()
        this.resources = this.application.resources
        this.physics = this.application.physics
        this.startPosition = position
        this.position = this.startPosition
        this.t = undefined
        this.player = this.importModel()

        this.activeAction.play();
        this.setPhysics(position)
        this.healthRegen = 0.02
        this.health = 100
        this.flashLightBattery = 7;
        this.lostHealthForTheFirstTime = true
        this.firstTimePlayerDies = true
        this.firstTimeBatteryDies = true
        this.active = false;
        this.activationTime = 0;

        this.flashLight = this.createFlashLight(position);

        this.group = new THREE.Group();
        this.group.add(this.player);
        this.group.add(this.flashLight)
        this.group.add(this.flashLight.target)

        this.group.name = "hero"
    }


    importModel() {
        let player = this.resources.items.soldier
        player.scene.castShadow = true;
        player.scene.receiveShadow = true

        this.mixer = new THREE.AnimationMixer(player.scene)

        this.animationActions = {
            idle: this.mixer.clipAction(player.animations[0]),
            walking: this.mixer.clipAction(player.animations[1]),
            running: this.mixer.clipAction(player.animations[3])
        }

        player.scene.traverse( function ( object ) {
            if ( object.isMesh ) object.castShadow = true;

        } );
        this.activeAction = this.animationActions.idle
        return player.scene.children[0]
    }

    setPhysics(position) {

        let shape = new Ammo.btCapsuleShape(0.5, 0.8);
        this.ghostObject = new Ammo.btPairCachingGhostObject();

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        console.log(this.position.x)
        transform.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
        transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));

        this.ghostObject.setWorldTransform(transform);
        this.ghostObject.setCollisionShape(shape);
        this.ghostObject.setCollisionFlags(16);
        this.ghostObject.setActivationState(4);
        this.ghostObject.activate(true);
        // let btVecUserData = new Ammo.btVector3( 0, 0, 0 );
        // btVecUserData.myData = {id:'ghost',name:"player"};
        // ghostObject.setUserPointer(btVecUserData)

        this.controller = new Ammo.btKinematicCharacterController(
            this.ghostObject,
            shape,
            0.35,
            1,
        );
        this.controller.setUseGhostSweepTest(true);

        this.controller.setGravity(9.81)

        this.physics.world.addCollisionObject(this.ghostObject, constant.COL_GROUP_PLAYER,
            constant.COL_GROUP_PLANE | constant.COL_GROUP_BOX | constant.COL_GROUP_PLAYER | constant.COL_GROUP_ENEMY | constant.COL_GROUP_BONUS_POINTS);
        this.physics.world.addAction(this.controller)
        this.controller.canJump(true);
        this.controller.setMaxJumpHeight(2);
        this.controller.setJumpSpeed(4);
        this.controller.setFallSpeed(55);
        this.controller.setMaxSlope(35);
    }

    setAction(toAction) {
        if (toAction !== this.activeAction) {
            let lastAction = this.activeAction
            this.activeAction = toAction
            lastAction.fadeOut(0.3)
            this.activeAction.reset()
            this.activeAction.fadeIn(0.3)
            this.activeAction.play()
        }
    }

    update() {
        if(this.active) {
            this.doUpdate();
        }
    }

    doUpdate() {
        let direction = this.application.animations.direction;
        let rotation = this.application.animations.rotation;
        if (direction !== 0 || rotation !== 0) {
            const action = this.application.animations.directionSpeed > 0.6 ? this.animationActions.running : this.animationActions.walking;
            this.setAction(action)
            this.group.rotation.y += rotation * this.application.animations.rotationSpeed;
            this.group.rotation.y %= (2 * Math.PI);
        } else {
            this.setAction(this.animationActions.idle)
        }

        let speed = this.application.animations.directionSpeed;
        this.controller.setWalkDirection(new Ammo.btVector3(
            direction * Math.sin(this.group.rotation.y) * speed,
            0,
            direction * Math.cos(this.group.rotation.y) * speed
        ));
        this.t = this.controller.getGhostObject().getWorldTransform();
        this.group.position.set(this.t.getOrigin().x(), this.t.getOrigin().y() - 0.85, this.t.getOrigin().z());

        this.application.animations.direction = 0;
        this.application.animations.rotation = 0;

        if (this.application.animations.isJumping) {
            this.controller.jump()
        }

        if (this.playerFellOfPlatform()) {
            if (!this.application.audio.fallScream.isPlaying) {
                this.application.audio.fallScream.play()
            }
        }

        if (this.playerFellOfPlatformAndFinallyDied()) {
            this.makePlayerRespawn()
        }

        if (this.health <= 0) {
            this.makePlayerRespawn()
            if (!this.application.audio.fallScream.isPlaying) {
                this.application.audio.fallScream.play()
            }
        }

        if (this.health < 100) {
            this.health += this.healthRegen
            if (this.lostHealthForTheFirstTime) {
                if (this.healthRegen > 0) {
                    // $('#info10').fadeIn(2200).delay(8000).fadeOut(2200);
                } else {
                    // $('#info11').fadeIn(2200).delay(8000).fadeOut(2200);
                }
                this.lostHealthForTheFirstTime = false
            }
        }

        this.mixer.update(this.application.time.delta)
        this.checkFlashLight(this.position)
        this.checkCollisions()

        // Log origin
        // console.log('x:',this.t.getOrigin().x())
        // console.log('y:', this.t.getOrigin().y())
        // console.log('z:', this.t.getOrigin().z())
    }

    makePlayerRespawn() {
        this.t.setOrigin(this.startPosition.x, this.startPosition.y, this.startPosition.z)
        this.health = 100
        if (this.firstTimePlayerDies) {
            this.firstTimePlayerDies = false;
            // $('#info12').fadeIn(2200).delay(8000).fadeOut(2200);
        }
    }

    playerFellOfPlatform() {
        return this.group.position.y < -5;
    }

    playerFellOfPlatformAndFinallyDied() {
        return this.group.position.y < -25;
    }


    checkCollisions() {
        let numContacts = this.ghostObject.getNumOverlappingObjects();
        if (numContacts > 0) {
            for (let index = 0; index < numContacts; index++) {
                const contactObject = this.ghostObject.getOverlappingObject(index);
                if (contactObject != null) {
                    const contactBody = Ammo.castObject(contactObject, Ammo.btRigidBody);
                    if (contactBody != null && contactBody.threeMesh != null && contactBody.isActive()) {
                        // play hit-sound
                        // if (!this.application.audio.point.isPlaying) {
                        //     this.application.audio.point.play();
                        // }

                        // console.log("contact:", contactBody.threeMesh.name)
                        if (typeof contactBody.threeMesh.collisionResponse === 'function')
                            contactBody.threeMesh.collisionResponse(contactBody.threeMesh)
                    }
                }
            }
        }
    }

    createFlashLight(position) {
        const flashLight = new THREE.SpotLight(0xFFFFFF, 7, 20, Math.PI * 0.15, 0.8, 0.5);
        console.log(position.x)
        flashLight.target.position.set(position.x, position.y+0.5, position.z - 3);
        flashLight.position.set(position.x, position.y+1, position.z);
        flashLight.visible = true;

        return flashLight;
    }

    checkFlashLight() {

        if (this.flashLight.visible) {
            this.elapsed = this.application.time.clock.getElapsedTime();
            if ((this.elapsed - this.activationTime) > 20) {
                this.flashLight.intensity -= 0.1;
                if (this.flashLight.intensity < 0.1) {
                    this.flashLightBattery -= 0.75;
                    this.flashLight.intensity = this.flashLightBattery;
                    if (this.flashLightBattery <= 0) {
                        this.flashLight.visible = false;
                        if(this.firstTimeBatteryDies) {
                            this.firstTimeBatteryDies = false
                            $('#info13').fadeIn(2200).delay(8000).fadeOut(2200);
                        }
                    }
                }
            }
        }

        if(this.flashLight.visible === false) {
            this.flashLightBattery += 0.015

            if(this.flashLightBattery >= 7) {
                this.flashLight.visible = true;
                this.flashLight.intensity = 7
                this.activationTime = this.application.time.clock.getElapsedTime()
            }
        }
    }
}