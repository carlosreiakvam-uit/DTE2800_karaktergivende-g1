import * as THREE from 'three'
import Application from '../Application.js'

export default class Coordinates {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene

        const axesHelper = new THREE.AxesHelper(5 );
        this.scene.add(axesHelper);

    }

}