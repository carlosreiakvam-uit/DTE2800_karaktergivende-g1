import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/constants.js";

export default class StaticEnemy1 {
    constructor(startPos, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.x = startPos.x

        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(startPos, scale, name)
        this.setPhysics(startPos)

    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1)
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.scale.set(scale.x, scale.y, scale.z)
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

        // Collision
        this.rigidBody.setCollisionFlags(this.rigidBody.getCollisionFlags() | Constant.BODYSTATE_KINEMATIC_OBJECT);
        // this.rigidBody.setActivationState(Constant.BODYSTATE_DISABLE_DEACTIVATION);

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(
            this.rigidBody,
            this.physics.COL_GROUP_BOX,
            this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        let speed = 0.9
        let distance = 0.1
        this.physics.moveRigidBody(this.mesh, {
            x: Math.cos(this.x * speed) * distance,
            y: 0,
            z: Math.sin(this.x * speed) * distance
        })
        this.x += 0.1
    }

}