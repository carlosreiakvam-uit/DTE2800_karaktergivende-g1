import * as THREE from 'three'
import Application from "../Application.js";

export default class Box {
    constructor({
                    position = {x: 0, y: 0, z: 0},
                    scale = {x: 0, y: 0, z: 0},
                    name,
                    mass = 0,
                    geometry,
                    material,
                }) {

        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass

        material === undefined ? this.setMaterial() : this.material = material
        geometry === undefined ? this.setGeometry() : this.geometry = geometry

        this.setMesh(position, scale, name)
        this.setPhysics(position)

    }

    setTextures(texture, textureNormal) {
        this.textures = {}

        if (texture === undefined) {
            this.textures.color = this.application.resources.items.dirtTexture
            this.textures.color.encoding = THREE.sRGBEncoding
            this.textures.color.repeat.set(1.5, 1.5)
            this.textures.color.wrapS = THREE.RepeatWrapping
            this.textures.color.wrapT = THREE.RepeatWrapping
        } else {
            this.textures.color = texture
        }

        if (textureNormal === undefined) {
            this.textures.normal = this.application.resources.items.dirtNormal
            this.textures.normal.repeat.set(1.5, 1.5)
            this.textures.normal.wrapS = THREE.RepeatWrapping
            this.textures.normal.wrapT = THREE.RepeatWrapping
        } else {
            this.textures.normal = textureNormal
        }

    }


    setMaterial() {
        this.setTextures()
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
        })
        this.material.displacementMap = this.textures.displacementMap
        this.material.displacementScale = 0.7
        this.material.normalMap = this.textures.normal
    }


    setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1, 128, 128)
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

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
    }

}