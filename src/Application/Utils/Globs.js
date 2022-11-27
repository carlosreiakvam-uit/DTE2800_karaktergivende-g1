import * as THREE from "three";
import Application from "../Application";

export default class Globs {
    constructor() {

        this.application = new Application()
        let resItems = this.application.resources.items

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1, 128, 128)
        this.cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32)
        this.dirtMaterial = this.createDirtMaterial(resItems)
        this.spacePlatformMaterial = this.createSpacePlatformMaterial(resItems)
        // this.rndNarvikPointPositions = this.generateRndNarvikPointPositions()
    }

    generateRndNarvikPointPositions() {
        let positions = []
        for (let i = 0; i < 10; i++) {

            let x = 86 + Math.random() * (170 - 86)
            let y = 15
            let z = -20 + Math.random() * (40 - (-20))
            positions.push({x: x, y: y, z: z})
        }
        return positions
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