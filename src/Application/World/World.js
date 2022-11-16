import Application from '../Application.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import TestObjects from "./TestObjects/TestObjects.js";
import Player from "./Player/Player.js";
import Healthbar from "./HUD/HealthBar";
import {addLandingPageMenu} from "./Menu/LandingPage";
import {addSkyBox} from "./BackGroundSkyBox";
import Cube from "./TestObjects/Cube";

export default class World {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.ready = false;
        this.started = false

        // Wait for resources
        this.resources.on('ready', async () => {
            //new Coordinates()
            await addLandingPageMenu(this.application)
            await addSkyBox(this.scene)

            new Floor(5, 5)
            new Floor(5, 5, {x: 25, y: 0, z: 15})
            new Floor(20, 20, {x: 15, y: 0, z: 0})
            new Floor(5, 5, {x: 25, y: 0, z: 15})
            new Floor(5, 5, {x: 30, y: 0, z: 0})
            this.healthbar = new Healthbar(5, 5, {x: 30, y: 0, z: 0})
            this.testObjects = new TestObjects()
            this.environment = new Environment()
            this.player = new Player()
            this.ready = true;
        })
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