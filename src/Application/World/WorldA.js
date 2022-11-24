import Application from '../Application.js'
import Environment from './Environment.js'
import Player from "./Player/Player.js";
import HealthBar from "./HUD/HealthBar";
import {addLandingPageMenu} from "./Menu/LandingPage";
import {addSkyBox} from "./BackGroundSkyBox";
import Time from "../Utils/Time";
import Lava from "./StaticEnemies/Lava.js";
import BalancingPlatform from "./Platforms/BalancingPlatform";
import Box from "./Platforms/PlatformShapes/Box";
import ThreeAmmoGlobalObjects from "../Utils/ThreeAmmoGlobalObjects";
import Cylinder from "./Platforms/PlatformShapes/Cylinder";
import {RotatingWall} from "./Moving Enemies/RotatingWall.js";
import EventHandler from "./Handlers/EventHandler";

export default class WorldA {
    constructor() {
        this.application = new Application()
        this.physics = this.application.physics
        this.time = new Time();
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.ready = false;

        // Wait for resources
        this.resources.on('ready', async () => {
            await addLandingPageMenu(this.application)
            await addSkyBox(this.scene, this.resources)
            this.globs = new ThreeAmmoGlobalObjects()
            //this.fireWall = new FireWall(this.application)
            this.lava = new Lava({x: 15, y: -4.9, z: 0}, 20, 20)
            this.addPlatforms()
            this.addMovingObstacles()
            this.healthbar = new HealthBar(5, 5, {x: 30, y: 0, z: 0})
            this.eventHandler = new EventHandler();
            this.environment = new Environment()
            this.player = new Player({
                x: 0,
                y: 0.5,
                z: 0
            })

            this.ready = true;
        })
    }

    addPlatforms() {
        new BalancingPlatform({x: -10, y: -0.5, z: 0})

        const a = new Box({
            position: {x: 15, y: -5, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            name: "first",
            material: this.globs.dirtMaterial,
        })

        const b = new Cylinder({
            position: {x: -20, y: -0.1, z: 0},
            scale: {x: 3, y: 0.2, z: 3},
            material: this.globs.dirtMaterial,
            radius: 1
        })

        const d = new Box({
            position: {x: 0, y: -0.2, z: 0},
            scale: {x: 5, y: 0.2, z: 5},
            name: "start",
            material: this.globs.dirtMaterial,
        })

        const f = new Box({
            position: {x: 16, y: -0.2, z: 6},
            scale: {x: 5, y: 0.2, z: 5},
            name: "start3",
            material: this.globs.dirtMaterial,
        })

        const g = new Box({
            position: {x: 24, y: -0.2, z: 3},
            scale: {x: 5, y: 0.2, z: 5},
            name: "start4",
            material: this.globs.dirtMaterial,
        })

        const h = new Box({
            position: {x: -5, y: -0.2, z: 16},
            scale: {x: 10, y: 0.2, z: 10},
            name: "startIntro",
            material: this.globs.dirtMaterial,
        })

        const i = new Box({
            position: {x: -2, y: -0.2, z: 5},
            scale: {x: 1, y: 0.2, z:12},
            name: "startIntroWalker",
            material: this.globs.dirtMaterial,
        })

        //const e = new ComplexPlatform({position: {x: -5, y: 1, z: -6}})
        this.application.scene.add(
            a.mesh,
            b.mesh,
            // e.mesh,
            d.mesh,
            f.mesh,
            g.mesh,
            h.mesh,
            i.mesh
        )
    }

    addMovingObstacles() {
        this.rotatingWall = new RotatingWall({
                position: {x: -20, y: 0, z: 0},
                scale: {x: 5, y: 2, z: 0.5},
                texture: "lava1",
                name: "rotatingWall"
            }
        )
    }

    update() {
        if (this.ready) {
            this.environment.update();
            this.eventHandler.update();
            this.player.update();
            this.healthbar.update();
            this.lava.update();
            this.rotatingWall.update();
            //this.fireWall.update();
        }
    }
}