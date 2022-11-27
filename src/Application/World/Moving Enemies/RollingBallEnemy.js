import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/Constants.js";


export default class RollingBallEnemy {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.isActivated = false
        this.startPosition = position
        this.position = position
        this.scale = scale
        this.name = name
        this.color = color

        this.aggroRange = [-7, 7]
        this.xDifference = undefined
        this.zDifference = undefined
        this.yDifference = undefined

        this.setTextures()
        this.setGeometry()
        this.setMesh(this.startPosition, scale, name)
        this.setPhysics(this.startPosition)
        this.application.scene.add(this.mesh)
    }

    reset() {
        // this.application.scene.remove(this.mesh)
        // this.setGeometry()
        // this.setTextures()
        // this.setMesh(this.startPosition, this.scale, this.name)
        // this.setPhysics(this.startPosition)
        // this.application.scene.add(this.mesh)
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(1, 32, 32);
    }

    setTextures() {
        let textures = {}
        textures.map = this.application.resources.items.blackDirtyTexture
        textures.map.encoding = THREE.sRGBEncoding
        textures.map.repeat.set(1.5, 1.5)
        textures.map.wrapS = THREE.RepeatWrapping
        textures.map.wrapT = THREE.RepeatWrapping

        textures.normalMap = this.application.resources.items.blackDirtyTextureNormals
        textures.normalMap.repeat.set(1.5, 1.5)
        textures.normalMap.wrapS = THREE.RepeatWrapping
        textures.normalMap.wrapT = THREE.RepeatWrapping

        this.material = new THREE.MeshStandardMaterial({
            map: textures.map,
            normalMap: textures.normalMap
        });
        this.material.roughness = 0.8;
        this.material.shininess = 0.4;
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
        this.mesh.collisionResponse = (mesh1) => {
            let hero = this.application.world.player.t
            if (hero !== undefined) {
                this.takeDamageOnHero(hero)
                if (!this.application.audio.playerHit.isPlaying) {
                    this.application.audio.playerHit.play();
                }
            }
        };
    }

    setPhysics(position, activationState) {
        let shape = new Ammo.btSphereShape(1);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);
        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, Constant.COL_GROUP_ENEMY, Constant.COL_GROUP_PLANE | Constant.COL_GROUP_PLAYER);
        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        let hero = this.application.world.player.t
        if (hero !== undefined) {
            this.checkHeroAndThisInteraction(hero)
        }
    }

    updatePositions(hero) {
        this.xDifference = this.getXPositionDifference(hero)
        this.zDifference = this.getZPositionDifference(hero)
        this.yDifference = this.getYPositionDifference(hero)
    }

    checkIfHeroAndThisEntityAreClose(range) {
        return (
            this.checkDifferenceWhenNegativeAndPositiveInput(this.xDifference, range[0], range[1]) &&
            this.checkDifferenceWhenNegativeAndPositiveInput(this.zDifference, range[0], range[1]) &&
            this.checkDifferenceWhenNegativeAndPositiveInput(this.yDifference, range[0], range[1])
        );
    }

    checkDifferenceWhenNegativeAndPositiveInput(difference, biggerThen, lessThen) {
        return (difference >= biggerThen && difference < 0) || (difference <= lessThen && difference > 0);
    }

    adjustTrajectoryOfThis() {
        if (this.xDifference > 0) {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0.007, y: 0, z: 0})
        } else {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: -0.007, y: 0, z: 0})
        }

        if (this.zDifference > 0) {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: 0.007})
        } else {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: -0.007})
        }
    }

    deactivateEnemy() {
        this.isActivated = false
    }

    getXPositionDifference(hero) {
        return hero.getOrigin().x() - this.mesh.position.x;
    }

    getYPositionDifference(hero) {
        return hero.getOrigin().y() - this.mesh.position.y;
    }

    getZPositionDifference(hero) {
        return hero.getOrigin().z() - this.mesh.position.z;
    }

    checkHeroAndThisInteraction(hero) {
        this.updatePositions(hero)

        if (!this.isActivated) {
            this.isActivated = this.checkIfHeroAndThisEntityAreClose(this.aggroRange)
        }

        if (this.isActivated) {
            this.adjustTrajectoryOfThis();
        }

    }

    takeDamageOnHero() {
        if (this.application.world.player.health > 0) {
            this.application.world.player.health -= 2
            if (this.application.world.player.health <= 0) {
                this.deactivateEnemy();
                this.reset();
            }
        }
    }

}