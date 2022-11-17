import * as THREE from 'three'
import Application from "../../Application.js";

export default class BonusPoint {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.position = position
        this.scale = scale
        this.name = name
        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(position, scale, name)
        this.setPhysics(position)
    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(0.3, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
        this.application.scene.add(this.mesh)
        this.mesh.collisionResponse = (mesh1) => {
            this.makeThisFloatAway(mesh1.userData.physicsBody)
        };
    }

    setPhysics(position, activationState) {
        let shape = new Ammo.btSphereShape(0.3);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        this.doFloatingAnimation()
        if (this.mesh.position.y > 10) {
            this.physics.rigidBodies = this.physics.rigidBodies.filter(x => x !== this.mesh);
            this.application.scene.remove(this.mesh);
        }
    }


    doFloatingAnimation() {
        if (this.rigidBody.threeMesh.position.y < 1) {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0.02, z: 0});
        }
    }

    makeThisFloatAway(rigidBody) {
        this.application.physics.applyImpulse(rigidBody, {x: 0, y: 1, z: 0});
    }
}