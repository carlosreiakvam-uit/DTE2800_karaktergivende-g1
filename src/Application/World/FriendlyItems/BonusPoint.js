import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/constants.js";
import {COL_GROUP_BONUS_POINTS} from "../../Utils/constants.js";


export default class BonusPoint {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.position = position
        this.scale = scale
        this.name = name
        this.setGeometry()
        this.setTextures()
        this.setMesh(position, scale, name)
        this.setPhysics(position)
        this.taken = false;
    }


    setTextures() {
        let textures = {}
        textures.map = this.application.resources.items.lightning
        textures.map.encoding = THREE.sRGBEncoding
        textures.map.repeat.set(1.5, 1.5)
        textures.map.wrapS = THREE.RepeatWrapping
        textures.map.wrapT = THREE.RepeatWrapping

        this.material = new THREE.MeshStandardMaterial({
            map: textures.map,
        });
        this.material.roughness = 0.0;
        this.material.shininess = 1;
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(0.2, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
        this.application.scene.add(this.mesh)
        this.mesh.collisionResponse = (mesh1) => {
            if (!this.application.audio.point.isPlaying) {
                this.application.audio.point.play();
            }

            this.makeThisFloatAway(mesh1.userData.physicsBody)
            this.taken = true;
        };
    }

    setPhysics(position, activationState) {
        let shape = new Ammo.btSphereShape(0.3);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, Constant.COL_GROUP_BONUS_POINTS, Constant.COL_GROUP_PLANE | Constant.COL_GROUP_PLAYER);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {

        this.doFloatingAnimation()
        if (this.mesh.position.y > this.position.y + 10) {
            this.physics.rigidBodies = this.physics.rigidBodies.filter(x => x !== this.mesh);
            this.taken = true;
            this.application.scene.remove(this.mesh);
        }

        if (
            this.mesh.position.x > this.position.x + 1 || this.mesh.position.x < this.position.x - 1 ||
            this.mesh.position.z > this.position.z + 1 || this.mesh.position.z < this.position.z - 1 ||
            this.mesh.position.y > this.position.y + 5 || this.mesh.position.y < this.position.y - 5
        ) {
            this.makeThisFloatAway(this.mesh.userData.physicsBody)
        }
    }

    doFloatingAnimation() {
        if (this.rigidBody.threeMesh.position.y < this.position.y - 0.5) {
            this.application.physics.applyImpulse(this.rigidBody, {x: 0, y: 0.02, z: 0});
        }
    }

    makeThisFloatAway(rigidBody) {
        this.application.physics.applyImpulse(rigidBody, {x: 0.1, y: 0.5, z: 0});
    }
}
