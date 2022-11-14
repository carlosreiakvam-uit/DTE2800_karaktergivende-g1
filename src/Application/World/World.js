import Application from '../Application.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Coordinates from "./coordinates";
import TestObjects from "./TestObjects/TestObjects.js";
import Player from "./Player/Player.js";

export default class World {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.ready = false;

        // Wait for resources
        this.resources.on('ready', () => {
            new Coordinates()
            new Floor(5, 5)
            new Floor(20, 20, {x: 15, y: 0, z: 0})
            this.testObjects = new TestObjects()
            this.environment = new Environment()
            this.player = new Player({x: 10, y: 0, z: 0})

            this.ready = true;
        })
        console.log(application)
    }

    update() {
        if (this.ready) {
            this.environment.update();
            this.testObjects.update();
            this.player.update();
        }
    }
}