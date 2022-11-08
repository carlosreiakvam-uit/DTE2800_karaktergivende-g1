import * as THREE from 'three'
import Application from "../../Application.js";
import Animations from "../../Animations.js";

export default class Cube {
    constructor(t, s, color) {
        this.application = new Application()
        this.scene = this.application.scene
        this.createCube(t, s, color)
        this.animations = new Animations()

        this.x = t.x

    }


    createCube(t, s, color) {
        const material = new THREE.MeshStandardMaterial({color: color})
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true
        this.mesh.scale.set(s.x, s.y, s.z)
        this.mesh.position.set(t.x, t.y, t.z)


        // Ammo
        let width = this.mesh.geometry.parameters.width;
        let height = this.mesh.geometry.parameters.height;
        let depth = this.mesh.geometry.parameters.depth;

        let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
        // shape.setMargin(0.05);
        // let rigidBody = this.createAmmoRigidBody(shape, this.mesh, 0.7, 0.8, position, 1);

    }

    createAmmoRigidBody(shape, threeMesh, restitution = 0.7, friction = 0.8, position = {x: 0, y: 50, z: 0}, mass = 1) {

        // let transform = new Ammo.btTransform();
        // transform.setIdentity();
        // transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

        // let quaternion = threeMesh.quaternion;
        // transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
        //
        // let scale = threeMesh.scale;
        // shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));
        //
        // let motionState = new Ammo.btDefaultMotionState(transform);
        // let localInertia = new Ammo.btVector3(0, 0, 0);
        // shape.calculateLocalInertia(mass, localInertia);
        //
        // let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        // let rigidBody = new Ammo.btRigidBody(rbInfo);
        // rigidBody.setRestitution(restitution);
        // rigidBody.setFriction(friction);
        //
        // return rigidBody;
    }


    update() {
    }
}