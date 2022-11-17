import * as THREE from 'three'
import Application from "../../Application.js";

export default class RollingBallEnemy {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.isActivated = false
        this.position = position
        this.scale = scale
        this.name = name
        this.color = color

        this.aggroRange = [-5, 5]
        this.killRange = [-1.4,1.4]
        this.xDifference = undefined
        this.zDifference = undefined
        this.yDifference = undefined

        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(position, scale, name)
        this.setPhysics(position)
        this.application.scene.add(this.mesh)
    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    reset() {
        this.application.scene.remove(this.mesh)
        this.setMaterial(this.color)
        this.setGeometry()
        this.setMesh(this.position, this.scale, this.name)
        this.setPhysics(this.position)
        this.application.scene.add(this.mesh)
    }

    setGeometry() {
        this.geometry =new THREE.SphereGeometry(1, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
        this.mesh.collisionResponse = (mesh1) => {
            mesh1.material.color.setHex(Math.random() * 0xffffff);
        };
    }

    setPhysics(position, activationState) {
        let shape = new Ammo.btSphereShape(1);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);
        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);
        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        let hero = this.application.world.player.t
        if(hero !== undefined) {
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
        if(this.xDifference > 0 )  {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x:0.015, y: 0, z: 0})
        } else  {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: -0.015, y: 0, z: 0})
        }

        if(this.zDifference > 0)  {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: 0.015})
        } else  {
            this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: -0.015})
        }
    }

    respawnHero() {
        this.application.world.player.t.setOrigin({x: 0, y: 0, z: 0})
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

        if(!this.isActivated) {
            this.isActivated = this.checkIfHeroAndThisEntityAreClose(this.aggroRange)
        }

        if(this.isActivated) {
            this.adjustTrajectoryOfThis();
            if(this.checkIfHeroAndThisEntityAreClose(this.killRange)) {
                console.log(this.xDifference)
                console.log(this.zDifference)
                this.takeDamageOnHero(hero)
            }
        }

    }

    takeDamageOnHero() {
        if(this.application.world.player.health > 0) {
            this.application.world.player.health -= 1
        } else {
            this.respawnHero()
            this.deactivateEnemy();
            this.application.world.player.health = 100
            this.reset();
        }
    }
}