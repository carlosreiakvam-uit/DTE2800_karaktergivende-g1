import Application from '../Application.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import TestObjects from "./TestObjects/TestObjects.js";
import Player from "./Player/Player.js";
import Healthbar from "./HUD/HealthBar";
import {addSkyBox} from "./BackGroundSkyBox";

export default class World {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.ready = false;

        // Wait for resources
        this.resources.on('ready', async () => {
            //new Coordinates()
            new Floor(5, 5)
            new Floor(5, 5, {x: 25, y: 0, z: 15})
            new Floor(5, 5, {x: 25, y: 0, z: 15})
            new Floor(20, 20, {x: 15, y: 0, z: 0})
            new Floor(5, 5, {x: 30, y: 0, z: 0})
            await addSkyBox(this.scene)
            this.healthbar = new Healthbar(5, 5, {x: 30, y: 0, z: 0})
            this.testObjects = new TestObjects()
            this.environment = new Environment()
            this.player = new Player()

            this.ready = true;
        })
        console.log(application)
    }

    update() {
        if (this.ready) {

            this.environment.update();
            this.testObjects.update();
            this.player.update();
            this.healthbar.update();
        }
    }
}