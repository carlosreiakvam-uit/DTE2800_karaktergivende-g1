import * as THREE from 'three'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import WorldA from './World/WorldA.js'
import Resources from './Utils/Resources.js'

import Animations from "./Animations.js";
import KeyPress from "./Utils/KeyPress.js";
import GUI from "lil-gui";
import Physics from "./World/Physics.js";
import Audio from "./Utils/Audio.js"
import Stats from 'stats.js'

let instance = null

export default class Application {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        window.application = this // global access
        this.canvas = _canvas

        // fps stats
        this.stats = new Stats()
        this.stats.showPanel(0, 1, 2); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);

        // setup
        this.audio = new Audio()
        this.physics = new Physics()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources()
        this.tween = require('@tweenjs/tween.js');
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new WorldA()
        this.animations = new Animations()
        this.keypress = new KeyPress()
        this.setupLilGui();

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Run animation loop on tick
        this.time.on('tick', () => {
            this.update()
        })
    }


    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.stats.begin();
        this.animations.update(this.keypress.currentlyPressedKeys, this.time.delta)
        this.camera.update()
        this.world.update()
        this.physics.updatePhysics(this.time.delta)
        this.renderer.update()
        this.tween.update();
        this.stats.end();
    }

    setupLilGui() {
        this.lilGui = new GUI();
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
    }
}