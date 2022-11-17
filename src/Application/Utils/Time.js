import EventEmitter from './EventEmitter.js'
import * as THREE from 'three'
import Application from "../Application";

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.application = new Application()
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 0 // var 16
        this.clock = new THREE.Clock();
        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = Date.now()
        // this.delta = currentTime - this.current
        this.delta = this.clock.getDelta()
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }
}