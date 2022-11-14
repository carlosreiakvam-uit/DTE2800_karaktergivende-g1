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
        this.geometry =new THREE.SphereGeometry(1, 32, 32);
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
        let shape = new Ammo.btSphereShape(1);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        if(this.application.world.player.t !== undefined) {
            let hero = this.application.world.player.t

            let heroPosX = this.application.world.player.t.getOrigin().x();
            let xDifference = heroPosX - this.mesh.position.x;
            let heroPosZ = this.application.world.player.t.getOrigin().z();
            let zDifference = heroPosZ - this.mesh.position.z;

            if((xDifference >= -5 && xDifference < 0
                || xDifference <= 5 && xDifference > 0)
                && (zDifference <= 5 && zDifference > 0
                || zDifference >= -5 && zDifference < 0)
            ) {
                this.isActivated = true
            } else {

            }

            if(this.isActivated && this.application.world.player.notDead) {
                if(xDifference > 0 )  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x:0.015, y: 0, z: 0})
                } else  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: -0.015, y: 0, z: 0})
                }

                if((xDifference > 0 && xDifference < 0.05 || xDifference < 0 && xDifference > -0.05 &&
                    zDifference > 0 && zDifference < 0.05 || zDifference < 0 && zDifference > -0.05)) {
                    this.application.world.player.t.setOrigin({x: 0, y: 0, z: 0})
                    this.isActivated = false
                }

                if( zDifference > 0)  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: 0.015})
                } else  {
                    this.physics.applyImpulse(this.mesh.userData.physicsBody, {x: 0, y: 0, z: -0.015})
                }
            }

        }
    }

}