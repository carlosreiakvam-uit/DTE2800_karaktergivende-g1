import * as THREE from 'three'
import Application from "../../Application.js";
import Animations from "../../Animations.js";

export default class SphereEnemy {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass

        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(position, scale, name)
        this.setPhysics(position)

    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    setGeometry() {
        this.geometry =new THREE.SphereGeometry(1, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        // this.mesh.scale.set(scale.x, scale.y, scale.z)
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
    }

    setPhysics(position, activationState) {
        let width = this.mesh.geometry.parameters.width;
        let height = this.mesh.geometry.parameters.height;
        let depth = this.mesh.geometry.parameters.depth;

        let shape = new Ammo.btSphereShape(1);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0, position, this.mass);
        //this.rigidBody.setCollisionFlags(this.rigidBody.getCollisionFlags() | 2);
        //this.rigidBody.setActivationState(4); // 4 = BODYSTATE_DISABLE_DEACTIVATION, dvs. "Never sleep".

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        this.cubeHero = this.application.world.player;
        let xDifference = this.cubeHero.position.x - this.mesh.position.x;
        console.log(this.cubeHero.position.x)
        this.physics.moveRigidBody(this.mesh,
        {x: -0.1, y: 0, z: 0}
        )


    }

}