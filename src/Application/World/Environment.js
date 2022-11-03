import * as THREE from 'three'
import Application from '../Application.js'

export default class Environment {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources

        this.setAmbientLight();
        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 3)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, -1.25)
        this.scene.add(this.sunLight);
    }

    setAmbientLight() {
        this.ambientLight1 = new THREE.AmbientLight(0xffffff, 0.2);
        this.ambientLight1.visible = true;
        this.scene.add(this.ambientLight1);
    }


    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()
    }

    update() {
        this.ambientLight1.visible = this.application.animations.ambientVisible;
        this.ambientLight1.intensity = this.application.animations.ambientIntensity;
        this.ambientLight1.color.set(this.application.animations.ambientColor)
        this.sunLight.visible = this.application.animations.theSunIsShining;
    }
}