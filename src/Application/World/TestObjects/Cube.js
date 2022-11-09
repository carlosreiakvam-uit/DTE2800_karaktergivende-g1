import * as THREE from 'three'
import Application from "../../Application.js";
import Animations from "../../Animations.js";

export default class Cube {
    constructor(transform, scale, color) {
        this.application = new Application()
        this.physics = this.application.physics
        this.pWorld = this.physics.world
        this.x = transform.x

        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(transform, scale)
        this.setPhysics(transform)

    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
    }

    setMesh(transform, scale) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = "cube"
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true
        this.mesh.scale.set(scale.x, scale.y, scale.z)
        this.mesh.position.set(transform.x, transform.y, transform.z)
    }


    setPhysics(position) {
        const mass = 1
        let width = this.mesh.geometry.parameters.width;
        let height = this.mesh.geometry.parameters.height;
        let depth = this.mesh.geometry.parameters.depth;

        let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
        shape.setMargin(0.05);
        let rigidBody = this.physics.createAmmoRigidBody(shape, this.mesh, 0.7, 0.8, position, mass);

        rigidBody.setActivationState(4);
        this.mesh.userData.physicsBody = rigidBody;
        this.pWorld.addRigidBody(rigidBody, this.physics.colGroupPlane, this.physics.colGroupBox);
        this.physics.rigidBodies.push(rigidBody)
        rigidBody.threeMesh = this.mesh
    }

    update() {
    }

}