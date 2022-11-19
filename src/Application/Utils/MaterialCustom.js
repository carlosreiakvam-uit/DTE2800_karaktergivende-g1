import * as THREE from "three";
import Application from "../Application";

export default class MaterialCustom extends THREE.Material {

    constructor(texture = undefined, textureNormal = undefined) {
        super();
        this.application = new Application()
        this.setTextures(texture, textureNormal)
        this.setMaterial()
    }


    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
        })
        this.material.displacementMap = this.textures.displacementMap
        this.material.displacementScale = 0.7
        this.material.normalMap = this.textures.normal
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


}