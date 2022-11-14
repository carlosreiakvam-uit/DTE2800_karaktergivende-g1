import Application from "../../Application.js";
import * as THREE from 'three'
import {BODYSTATE_KINEMATIC_OBJECT} from "../../Utils/constants.js";


export default class Player {
    constructor(position = {x: 0, y: 0, z: 0}) {
        this.application = new Application()
        this.resources = this.application.resources
        this.physics = this.application.physics
        this.defaultDirection = {x: 0, y: 0, z: 0}
        this.startPosition = position
        this.position = this.startPosition
        this.t = undefined
        this.player = this.importModel()
        this.application.scene.add(this.player)
        this.activeAction.play();
        this.setPhysics({x: 2, y: 0, z: 0})
        this.notDead = true
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

    setPhysics() {

        let shape = new Ammo.btCapsuleShape(0.5, 0.8);
        let ghostObject = new Ammo.btPairCachingGhostObject();

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
        transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));

        ghostObject.setWorldTransform(transform);
        ghostObject.setCollisionShape(shape);
        ghostObject.setCollisionFlags(BODYSTATE_KINEMATIC_OBJECT);
        ghostObject.setActivationState(4);
        ghostObject.activate(true);
        // let btVecUserData = new Ammo.btVector3( 0, 0, 0 );
        // btVecUserData.myData = {id:'ghost',name:"player"};
        // ghostObject.setUserPointer(btVecUserData)

        this.controller = new Ammo.btKinematicCharacterController(
            ghostObject,
            shape,
            0.35,
            1,
        );
        this.controller.setUseGhostSweepTest(shape);

        this.controller.setGravity(9.81)

        this.physics.world.addCollisionObject(ghostObject, this.physics.COL_GROUP_BOX,
            this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);
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
        let direction = this.application.animations.direction;
        if (direction.x !== 0 || direction.z !== 0) {
            const action = this.application.animations.directionSpeed > 0.6 ? this.animationActions.running : this.animationActions.walking;
            this.setAction(action)
            this.player.rotation.z = Math.atan2(-direction.x, -direction.z)
        } else {
            this.setAction(this.animationActions.idle)
        }

        let speed = this.application.animations.directionSpeed;
        this.controller.setWalkDirection(new Ammo.btVector3(direction.x * speed, direction.y * speed, direction.z * speed));
        this.t = this.controller.getGhostObject().getWorldTransform();
        this.player.position.set(this.t.getOrigin().x(), this.t.getOrigin().y() - 0.85, this.t.getOrigin().z());

        this.application.animations.direction.x = this.defaultDirection.x;
        this.application.animations.direction.z = this.defaultDirection.z;

        if (this.application.animations.isJumping) {
            this.controller.jump()
        }

        if(this.player.position.y < -2) {
            console.log("respawn")
            this.t.setOrigin( this.startPosition.x, this.startPosition.y, this.startPosition.z);
        }

        this.mixer.update(this.application.time.delta)
    }
}