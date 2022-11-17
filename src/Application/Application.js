import * as THREE from 'three'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'

import sources from './sources.js'
import Animations from "./Animations.js";
import KeyPress from "./Utils/KeyPress.js";
import GUI from "lil-gui";
import Physics from "./World/Physics.js";

let instance = null

export default class Application {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access
        window.application = this

        // Options
        this.canvas = _canvas

        // Setup
        this.physics = new Physics()
        this.sizes = new Sizes()
        this.time = new Time()

        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.tween = require('@tweenjs/tween.js');
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.animations = new Animations()
        this.keypress = new KeyPress()
        this.setupLilGui();

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()

        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.animations.update(this.keypress.currentlyPressedKeys, this.time.delta)
        this.camera.update()
        this.world.update()
        this.physics.updatePhysics(this.time.delta)
        this.renderer.update()
        this.tween.update();
    }

    setupLilGui() {
        this.lilGui = new GUI();

        const sunFolder = this.lilGui.addFolder("Sun light");
        sunFolder.add(this.animations, 'theSunIsShining').name("On/Off");

        const ambientFolder = this.lilGui.addFolder('Ambient Light');
        ambientFolder.add(this.animations, 'ambientVisible').name("On/Off");
        ambientFolder.add(this.animations, 'ambientIntensity').min(0).max(1).step(0.01).name("Intensity");
        ambientFolder.addColor(this.animations, 'ambientColor').name("Color");

        const statEnemies = this.lilGui.addFolder("Static enemies");
        statEnemies.add(this.animations, 'ambientVisible').name("Yellow static enemy");
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