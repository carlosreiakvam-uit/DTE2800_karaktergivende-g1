import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/constants.js";


export default class Minion {
    constructor(position, scale, color = 0x00FF00, mass = 0.0, name = "Minion") {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.position = position
        this.scale = scale
        this.name = name
        this.lastYPos = this.position.y + 1
        this.lastXPos = this.position.x + 1
        this.lastZPos = this.position.z + 1
        this.color = color
        this.group = new THREE.Group()
        this.spotLight = new THREE.SpotLight(0xFFFF00, 5, 8, Math.PI , 0.2, 0.5);
        this.spotLight.target.position.set(this.lastXPos, this.lastYPos, this.lastZPos);
        this.spotLight.position.set(this.position.x, this.position.y , this.position.z);
        this.group.add(this.spotLight)
        this.group.add(this.spotLight.target)

        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(position, scale, name)
        this.setPhysics(position)
        this.application.scene.add(this.group)
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
        this.group.add(this.mesh)
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
            this.spotLight.target.position.set(this.lastXPos, 0, this.lastZPos);
            this.spotLight.position.set(this.lastXPos, this.lastYPos, this.lastZPos);
        }
    }

    adjustTrajectoryOfThis(hero) {
        if(hero.getOrigin().y() < - 5) {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0.05, y: 0.04, z: 0});
        }

        if(this.rigidBody.threeMesh.position.x > hero.getOrigin().x()) {
            this.application.physics.applyImpulse(this.rigidBody, {x: -0.005, y: 0, z: 0});

            if(this.lastXPos < this.rigidBody.threeMesh.position.x) {
                this.application.physics.applyImpulse(this.rigidBody, {x: -0.02, y: 0, z: 0});
            }
        } else {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0.005, y: 0, z: 0});
            if(this.lastXPos > this.rigidBody.threeMesh.position.x) {
                this.application.physics.applyImpulse(this.rigidBody, {x: 0.02, y: 0, z: 0});
            }
        }

        if(this.rigidBody.threeMesh.position.z > hero.getOrigin().z()) {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: -0.005});
            if(this.lastZPos < this.rigidBody.threeMesh.position.z) {
                this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: -0.02});
            }
        } else {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: 0.005});
            if(this.lastZPos > this.rigidBody.threeMesh.position.z) {
                this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0, z: 0.02});
            }
        }
        this.lastXPos = this.rigidBody.threeMesh.position.x
        this.lastZPos = this.rigidBody.threeMesh.position.z
    }

    doFloatingAnimation(hero) {
        if((this.lastYPos > this.rigidBody.threeMesh.position.y) && this.rigidBody.threeMesh.position.y < hero.getOrigin().y() + 4) {
            this.application.physics.applyCentralImpulse(this.rigidBody, 0.1,{x: 0, y: 1, z: 0});
        }
        this.lastYPos = this.rigidBody.threeMesh.position.y

    }

    checkHeroAndThisInteraction(hero) {
        this.doFloatingAnimation(hero)
        this.adjustTrajectoryOfThis(hero);
    }
}