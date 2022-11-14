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
        this.geometry =new THREE.SphereGeometry(0.3, 32, 32);
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
        let shape = new Ammo.btSphereShape(0.3);
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

            if((xDifference >= -1 && xDifference < 0
                    || xDifference <= 1 && xDifference > 0)
                && (zDifference <= 1 && zDifference > 0
                    || zDifference >= -1 && zDifference < 0)
            ) {
                this.isActivated = true
            }

            if(this.rigidBody.threeMesh.position.y < 1) {
                this.application.physics.applyImpulse(this.rigidBody, {x:0, y:0.02, z:0});
            }

            if(this.isActivated) {
                this.application.physics.applyImpulse(this.rigidBody, {x:0, y:0.1, z:0});
            }


        }
    }

}