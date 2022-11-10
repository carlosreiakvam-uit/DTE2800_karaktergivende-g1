import * as THREE from 'three'
import Application from "../../Application.js";
import Animations from "../../Animations.js";

export default class CubeHero {
    constructor(position, color, mass) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass

        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(position)
        this.setPhysics(position)

    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1)
    }

    setMesh(position) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = 'cubeHero'
        // this.mesh.scale.set(scale.x, scale.y, scale.z)
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
    }

    setPhysics(position) {
        let width = this.mesh.geometry.parameters.width;
        let height = this.mesh.geometry.parameters.height;
        let depth = this.mesh.geometry.parameters.depth;

        let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);

        // Følgende er avgjørende for å kunne flytte på objektet:
        // 2 = BODYFLAG_KINEMATIC_OBJECT: Betyr kinematic object, masse=0 men kan flyttes!
        this.rigidBody.setCollisionFlags(this.rigidBody.getCollisionFlags() | 2);
        this.rigidBody.setActivationState(4);


        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
    }

}