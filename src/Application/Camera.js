import * as THREE from 'three'
import Application from './Application.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor() {
        this.application = new Application()
        this.sizes = this.application.sizes
        this.scene = this.application.scene
        this.canvas = this.application.canvas
        this.cameraOffset = new THREE.Vector3(-5.0, 5.0, 0.0);
        this.instance = undefined
        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();
        this.lookAtHero = false

        this.setInstance()
        this.setControls()
        this.instance.add(this.application.audio.listener)
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(60, this.sizes.width / this.sizes.height, 1, 1000)
        //this.instance.position.set(-15, 20, 30)
        // this.instance.position.set(0, 150, 50)
        this.instance.position.set(-66, 130, 323)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {

        const player = this.scene.getObjectByName("hero");
        if (player !== undefined && this.lookAtHero) {
            const idealOffset = this.calculateIdealOffset(player);
            const idealLookAt = this.calculateIdealLookAt(player);
            const t = 1.0 - Math.pow(0.001, this.application.time.delta);
            this.currentPosition.lerp(idealOffset, t);
            this.currentLookAt.lerp(idealLookAt, t);

            this.instance.position.copy(this.currentPosition);
            this.instance.lookAt(this.currentLookAt);
        }
    }

    calculateIdealOffset(target) {
        const idealOffset = new THREE.Vector3(0, 5, 8);
        idealOffset.applyQuaternion(target.quaternion);
        idealOffset.add(target.position);
        return idealOffset;
    }

    calculateIdealLookAt(target) {
        const idealLookAt = new THREE.Vector3(0, 0, 0);
        // idealLookAt.applyQuaternion(target.quaternion);
        idealLookAt.add(target.position);
        return idealLookAt;
    }
}