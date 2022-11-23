import Application from "../../Application.js";
import * as THREE from 'three'
import {BODYSTATE_KINEMATIC_OBJECT} from "../../Utils/constants.js";
import * as Constant from "../../Utils/constants.js";
import Box from "../Platforms/PlatformShapes/Box";


export default class Player {
    constructor(position = {x: 0, y: 0.5, z: 0}) {
        this.application = new Application()
        this.resources = this.application.resources
        this.physics = this.application.physics
        this.startPosition = position
        this.position = this.startPosition
        this.t = undefined
        this.player = this.importModel()
        this.player.name = "hero"
        this.application.scene.add(this.player)
        this.activeAction.play();
        this.setPhysics(position)
        this.health = 100
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

        this.activeAction = this.animationActions.idle
        return player.scene.children[0]
    }

    setPhysics(position) {

        let shape = new Ammo.btCapsuleShape(0.5, 0.8);
        this.ghostObject = new Ammo.btPairCachingGhostObject();

        let transform = new Ammo.btTransform();
        transform.setIdentity();
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

        this.physics.world.addCollisionObject(this.ghostObject, Constant.COL_GROUP_PLAYER,
            Constant.COL_GROUP_PLANE | Constant.COL_GROUP_BOX);
        this.physics.world.addAction(this.controller)
        this.controller.canJump(true);
        this.controller.setMaxJumpHeight(2);
        this.controller.setJumpSpeed(4);
        this.controller.setFallSpeed(55);
        this.controller.setMaxSlope(45);
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
        this.checkCollisions()
        let direction = this.application.animations.direction;
        let rotation = this.application.animations.rotation;
        if (direction !== 0 || rotation !== 0) {
            const action = this.application.animations.directionSpeed > 0.6 ? this.animationActions.running : this.animationActions.walking;
            this.setAction(action)
            this.player.rotation.z += rotation * this.application.animations.rotationSpeed;
            this.player.rotation.z %= (2 * Math.PI);
        } else {
            this.setAction(this.animationActions.idle)
        }

        let speed = this.application.animations.directionSpeed;
        this.controller.setWalkDirection(new Ammo.btVector3(
            direction * Math.sin(this.player.rotation.z) * speed,
            0,
            direction * Math.cos(this.player.rotation.z) * speed
        ));
        this.t = this.controller.getGhostObject().getWorldTransform();
        this.player.position.set(this.t.getOrigin().x(), this.t.getOrigin().y() -0.85, this.t.getOrigin().z());

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
        }

        this.mixer.update(this.application.time.delta)
    }

    makePlayerRespawn() {
        this.t.setOrigin(this.startPosition.x, this.startPosition.y, this.startPosition.z);
        this.health = 100
    }

    playerFellOfPlatform() {
        return this.player.position.y < -5;
    }

    playerFellOfPlatformAndFinallyDied() {
        return this.player.position.y < -25;
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
                        if (!this.application.audio.point.isPlaying) {
                            this.application.audio.point.play();
                        }


                        console.log("contact:", contactBody.threeMesh.name)
                        if (typeof contactBody.threeMesh.collisionResponse === 'function')
                            contactBody.threeMesh.collisionResponse(contactBody.threeMesh)

                    }
                }
            }
        }
    }
}