import * as THREE from "three";
import Application from "../Application";

let instance = null

export default class ThreeAmmoGlobalObjects {
    constructor() {
        if (instance) {
            return instance
        }
        instance = this

        this.application = new Application()

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1, 128, 128)
        this.cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32)
        this.dirtMaterial = this.createDirtMaterial()
    }

    createDirtMaterial() {

        let texture = this.application.resources.items.dirtTexture
        texture.encoding = THREE.sRGBEncoding
        texture.repeat.set(1.5, 1.5)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping

        let normal = this.application.resources.items.dirtNormal
        normal.repeat.set(1.5, 1.5)
        normal.wrapS = THREE.RepeatWrapping
        normal.wrapT = THREE.RepeatWrapping

        let material = new THREE.MeshStandardMaterial({
            map: texture,
        })
        material.normalMap = normal

        return material

    }
}