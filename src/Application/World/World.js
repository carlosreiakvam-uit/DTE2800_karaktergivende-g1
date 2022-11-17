import Application from '../Application.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import TestObjects from "./TestObjects/TestObjects.js";
import Player from "./Player/Player.js";
import Healthbar from "./HUD/HealthBar";
import {addLandingPageMenu} from "./Menu/LandingPage";
import {addSkyBox} from "./BackGroundSkyBox";
import Time from "../Utils/Time";
import FireWall from "./Moving Enemies/FireWall.js";
import Lava from "./StaticEnemies/Lava.js";

export default class World {
    constructor() {
        this.application = new Application()
        this.time = new Time();
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.ready = false;

        // Wait for resources
        this.resources.on('ready', async () => {
            //new Coordinates()
            await addLandingPageMenu(this.application)
            await addSkyBox(this.scene)
            new FireWall(this.application)
            this.lava = new Lava(this.application)

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
            this.lava.update();
        }
    }
}