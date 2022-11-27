import Application from '../Application.js'
import Player from "./Player/Player.js";
import HealthBar from "./HUD/HealthBar";
import {addLandingPageMenu} from "./Menu/LandingPage";
import {addSkyBox} from "./BackGroundSkyBox";
import Time from "../Utils/Time";
import Lava from "./StaticEnemies/Lava.js";
import Box from "./Platforms/PlatformShapes/Box";
import Globs from "../Utils/Globs";
import {RotatingWall} from "./Moving Enemies/RotatingWall.js";
import EventHandler from "./Handlers/EventHandler";
import Environment from "./Environment";

export default class WorldA {
    constructor() {
        this.application = new Application()
        this.physics = this.application.physics
        this.time = new Time();
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.ready = false;
        this.objectMeshes = []

        this.resources.on('ready', async () => {
            await addLandingPageMenu(this.application)
            await addSkyBox(this.scene, this.resources)
            this.globs = new Globs()
            addSkyBox(this.scene, this.resources)
            this.createWorld() // creating world without adding it to scene
        })
    }

    // kalles fra LandingPage.js
    addWorldToScene() {
        console.log('ADDING WORLD TO SCENE')
        for (let i = 0; i < this.objectMeshes.length; i++) {
            this.application.scene.add(this.objectMeshes[i])
        }
    }


    createWorld() {
        console.log("CREATING WORLD")
        this.lava = new Lava({x: 15, y: -4.9, z: 0}, 15, 15)
        this.healthbar = new HealthBar(5, 5, {x: 30, y: 0, z: 0})
        this.eventHandler = new EventHandler();
        this.environment = new Environment()
        this.player = new Player({x: 0, y: 0.5, z: 0})
        this.addMovingObstacles()
        this.addPlatforms()
        this.objectMeshes.push(this.lava.lavaMesh, this.healthbar.sprite1, this.player.group)
        this.ready = true;
    }


    addPlatforms() {

        const a = new Box({
            position: {x: 15, y: -5, z: 0},
            scale: {x: 15, y: 0.2, z: 15},
            name: "first",
            material: this.globs.spacePlatformMaterial,
        })

        const d = new Box({
            position: {x: 0, y: -0.2, z: 0},
            scale: {x: 5, y: 0.2, z: 5},
            name: "start",
            material: this.globs.spacePlatformMaterial,
        })

        const f = new Box({
            position: {x: 16, y: -0.2, z: 6},
            scale: {x: 8, y: 0.2, z: 8},
            name: "start3",
            material: this.globs.spacePlatformMaterial,
        })

        const g = new Box({
            position: {x: 24, y: -0.2, z: 3},
            scale: {x: 5, y: 0.2, z: 5},
            name: "start4",
            material: this.globs.spacePlatformMaterial,
        })

        const h = new Box({
            position: {x: -5, y: -0.2, z: 16},
            scale: {x: 10, y: 0.2, z: 10},
            name: "startIntro",
            material: this.globs.spacePlatformMaterial,
        })

        const i = new Box({
            position: {x: -2, y: -0.2, z: 6.75},
            scale: {x: 1, y: 0.2, z: 8.5},
            name: "startIntroWalker",
            material: this.globs.spacePlatformMaterial,
        })

        this.objectMeshes.push(a.mesh,
            d.mesh,
            f.mesh,
            g.mesh,
            h.mesh,
            i.mesh,
        )
    }

    addMovingObstacles() {
        this.rotatingWall = new RotatingWall({
                position: {x: 16, y: 0.2, z: 6},
                scale: {x: 5, y: 2, z: 0.5},
                texture: "blackDirtyTexture",
                name: "rotatingWall"
            }
        )
        this.objectMeshes.push(this.rotatingWall.mesh)
    }

    update() {
        if (this.ready) {
            this.environment.update();
            this.eventHandler.update();
            this.player.update();
            this.healthbar.update();
            this.lava.update();
            this.rotatingWall.update();
        }
    }
}