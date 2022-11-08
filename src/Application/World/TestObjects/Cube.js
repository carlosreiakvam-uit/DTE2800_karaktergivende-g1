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
        const height = 1
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true
        this.mesh.scale.set(s.x, s.y, s.z)
        this.mesh.position.set(t.x, t.y, t.z)
    }

    update() {
    }
}