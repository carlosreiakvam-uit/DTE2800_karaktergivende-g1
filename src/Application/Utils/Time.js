import EventEmitter from './EventEmitter.js'
import * as THREE from 'three'
import Application from "../Application";
import Stats from 'stats.js'

export default class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.application = new Application()
        this.delta = 0 // var 16
        this.clock = new THREE.Clock();
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {

        this.delta = this.clock.getDelta()
        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}