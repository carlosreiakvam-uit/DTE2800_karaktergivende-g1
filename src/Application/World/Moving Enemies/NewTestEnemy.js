import * as THREE from 'three'
import Application from "../../Application.js";
import Animations from "../../Animations.js";

export default class NewTestEnemy {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.isActivated = false

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
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
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
        if(this.application.world.player.t !== undefined) {
            let heroPosX = this.application.world.player.t.getOrigin().x();
            let xDifference = heroPosX - this.mesh.position.x;
            let heroPosZ = this.application.world.player.t.getOrigin().z();
            let zDifference = heroPosZ - this.mesh.position.z;

            if(xDifference >= -5 && xDifference < 0 && zDifference >= -5 && zDifference < 0) {
                this.isActivated = true
            }

            if(this.isActivated) {
                if(xDifference > 0 )  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x:0.05, y: 0, z: 0})
                } else  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: -0.05, y: 0, z: 0})
                }

                if( zDifference > 0 && this.isActivated)  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: 0.05})
                } else  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: -0.05})
                }
            }

        }
    }

}