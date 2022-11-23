import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/constants.js";


export default class Companion {
    constructor(position, scale, color = 0x00FF00, mass = 0.0, name = "Companion") {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.position = position
        this.scale = scale
        this.name = name
        this.lastYPos = this.position.y + 1
        this.lastXPos = this.position.x + 1
        this.lastZPos = this.position.Z + 1
        this.color = color

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

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(0.1, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;

    }

    setPhysics(position, activationState) {
        let shape = new Ammo.btSphereShape(0.1);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);
        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, Constant.COL_GROUP_PLANE, Constant.COL_GROUP_PLANE | Constant.COL_GROUP_PLAYER);
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

    adjustTrajectoryOfThis(hero) {
        if(this.rigidBody.threeMesh.position.x > hero.getOrigin().x()) {
            this.application.physics.applyImpulse(this.rigidBody, {x: -0.001, y: 0, z: 0});
            if(this.lastXPos < this.rigidBody.threeMesh.position.x) {
                this.application.physics.applyImpulse(this.rigidBody, {x: -0.02, y: 0, z: 0});
            }
        } else {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0.001, y: 0, z: 0});
            if(this.lastXPos > this.rigidBody.threeMesh.position.x) {
                this.application.physics.applyImpulse(this.rigidBody, {x: 0.02, y: 0, z: 0});
            }
        }

        if(this.rigidBody.threeMesh.position.z > hero.getOrigin().z()) {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: -0.001});
            if(this.lastZPos < this.rigidBody.threeMesh.position.z) {
                this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: -0.02});
            }
        } else {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: 0.001});
            if(this.lastZPos > this.rigidBody.threeMesh.position.z) {
                this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: 0.02});
            }
        }
        this.lastXPos = this.rigidBody.threeMesh.position.x
        this.lastZPos = this.rigidBody.threeMesh.position.z
    }

    doFloatingAnimation(hero) {
        if((this.lastYPos > this.rigidBody.threeMesh.position.y) && this.rigidBody.threeMesh.position.y <3) {
            this.application.physics.applyCentralImpulse(this.rigidBody, 0.1,{x: 0, y: 1, z: 0});
        }
        this.lastYPos = this.rigidBody.threeMesh.position.y

    }

    getXPositionDifference(hero) {
        return hero.getOrigin().x() - this.mesh.position.x;
    }

    getYPositionDifference(hero) {
        return hero.getOrigin().y() - this.mesh.position.y + 1;
    }

    getZPositionDifference(hero) {
        return hero.getOrigin().z() - this.mesh.position.z;
    }


    checkHeroAndThisInteraction(hero) {
        this.updatePositions(hero)
        this.doFloatingAnimation(hero)
        this.adjustTrajectoryOfThis(hero);
    }
}