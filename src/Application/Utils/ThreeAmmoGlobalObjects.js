import * as THREE from "three";
import Application from "../Application";

export default class ThreeAmmoGlobalObjects {
    constructor() {

        this.application = new Application()
        let resItems = this.application.resources.items

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1, 128, 128)
        this.cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32)
        this.dirtMaterial = this.createDirtMaterial(resItems)
        this.spacePlatformMaterial = this.createSpacePlatformMaterial(resItems)
    }

    createDirtMaterial(resItems) {
        this.textures = {}
        this.textures.color = resItems.dirtTexture
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = resItems.dirtNormal
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping

        let material = new THREE.MeshStandardMaterial({
            map: this.textures.color
        })
        material.normalMap = this.textures.normal

        return material
    }

    createSpacePlatformMaterial(resItems) {
        this.textures = {}
        this.textures.color = resItems.spacePlatformTexture
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        //
        // this.textures.normal = resItems.dirtNormal
        // this.textures.normal.repeat.set(1.5, 1.5)
        // this.textures.normal.wrapS = THREE.RepeatWrapping
        // this.textures.normal.wrapT = THREE.RepeatWrapping

        let material = new THREE.MeshStandardMaterial({
            map: this.textures.color
        })
        material.normalMap = this.textures.normal

        return material

    }
}