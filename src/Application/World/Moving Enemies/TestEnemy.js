import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/constants.js";

export default class TestEnemy {
    constructor(startPos, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.x = startPos.x

        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(startPos, scale, name)
        this.setPhysics(startPos)
        console.log("Staert")

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
        this.mesh.scale.set(scale.x, scale.y, scale.z)
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
    }

    setPhysics(position) {
        let width = this.mesh.geometry.parameters.width;
        let height = this.mesh.geometry.parameters.height;
        let depth = this.mesh.geometry.parameters.depth;

        let shape = new Ammo.btSphereShape(1);
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
        if(this.application.world.player.t !== undefined) {
            let heroPosX = this.application.world.player.t.getOrigin().x();
            let xDifference = heroPosX - this.mesh.position.x;


            if(xDifference > 0) {
                this.physics.applyImpulse(this.mesh.userData.physicsBody, 100,{x:1, y: 1, z: 0})

            } else  {
                this.physics.applyImpulse(this.mesh.userData.physicsBody, 100,{x: 1, y: 1, z: 0})
            }

            // let heroPosZ = this.application.world.player.t.getOrigin().z();
            // let zDifference = heroPosZ - this.mesh.position.z;
            //
            // if(zDifference > 0) {
            //     this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: 0})
            // } else  {
            //     this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0.02, y: 0, z: 0})
            // }
        }
    }

    update2()
    {
        if (this.application.world.player.t !== undefined) {
            let heroPosX = this.application.world.player.t.getOrigin().x();
            let xDifference = heroPosX - this.mesh.position.x;
            this.applyImpulse(this.mesh.userData.physicsBody, {x: 0.02, y: 0, z: 0})
            //console.log(xDifference)

            if (xDifference > 0) {
                this.physics.moveRigidBody(this.mesh, {x: 0.02, y: 0, z: 0})

            } else {
                this.physics.moveRigidBody(this.mesh, {x: -0.02, y: 0, z: 0})
            }

            let heroPosZ = this.application.world.player.t.getOrigin().z();
            let zDifference = heroPosZ - this.mesh.position.z;

            if (zDifference > 0) {
                this.physics.moveRigidBody(this.mesh, {x: 0, y: 0, z: 0.02})
            } else {
                this.physics.moveRigidBody(this.mesh, {x: 0, y: 0, z: -0.02})
            }
        }
    }

}