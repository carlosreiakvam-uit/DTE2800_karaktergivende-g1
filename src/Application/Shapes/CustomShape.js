import * as THREE from 'three'
import Application from "../Application.js";
import ThreeAmmoGlobalObjects from "./ThreeAmmoGlobalObjects";

export default class CustomShape {
    constructor({
                    position = {x: 0, y: 0, z: 0},
                    scale = {x: 1, y: 1, z: 1},
                    name,
                    mass = 0,
                    geometry,
                    material,
                    radius = 1
                }) {

        this.application = new Application()
        this.physics = this.application.physics
        this.globs = new ThreeAmmoGlobalObjects()
        this.mass = mass
        this.radius = radius
        this.geometry = geometry
        this.material = material

        material === undefined ? this.material = this.globs.dirtMaterial : this.material = material
        // geometry === undefined ? this.material = this.globs.boxGeometry : this.geometry = geometry

        switch (this.geometry.type) {
            case 'BoxGeometry': {
                this.ammoShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x / 2, scale.y / 2, scale.z / 2));
                break;
            }
            case 'CylinderGeometry': {
                this.ammoShape = new Ammo.btCylinderShape(new Ammo.btVector3(this.radius, this.radius / 2, this.radius));
                break;
            }


        }

        this.setMesh(position, scale, name)
        this.setPhysics(position)

    }


    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.scale.set(scale.x, scale.y, scale.z)
        // this.mesh.position.set(position.x, position.y, position.z)
        // this.mesh.position.setY = 10
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
    }


    setPhysics(position) {
        let width = this.mesh.geometry.parameters.width;
        let height = this.mesh.geometry.parameters.height;
        let depth = this.mesh.geometry.parameters.depth;

        this.rigidBody = this.physics.createRigidBody(this.ammoShape, this.mesh, 0.7, 0.8, position, this.mass);

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
    }

}