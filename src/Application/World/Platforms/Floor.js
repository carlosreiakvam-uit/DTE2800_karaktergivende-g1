import * as THREE from 'three'
import Application from '../../Application.js'
import * as Constant from "../../Utils/constants.js";


export default class Floor {
    constructor(width, length, position = {x: 0, y: 0, z: 0}) {
        this.application = new Application()
        this.position = position
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.physics = application.physics
        this.width = width;
        this.length = length;

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setAmmo()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.length, 1, 1)
    }

    setTextures() {
        this.textures = textures
        this.textures.color =
            this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.dirtNormal
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
        this.material.displacementMap = this.textures.displacement
        this.material.displacementScale = 3.6
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = 'floor'
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.application.scene.add(this.mesh)
    }

    setAmmo() {
        const mass = 0
        const width = this.mesh.geometry.parameters.width;
        const height = this.mesh.geometry.parameters.height;
        const depth = 0

        // AMMO
        const shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth));
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 1.8, this.position, mass);

        this.mesh.userData.physicsBody = this.rigidBody;

        this.physics.world.addRigidBody(this.rigidBody, Constant.COL_GROUP_PLANE, Constant.COL_GROUP_BOX);

        this.physics.rigidBodies.push(this.mesh)
        this.rigidBody.threeMesh = this.mesh
    }
}