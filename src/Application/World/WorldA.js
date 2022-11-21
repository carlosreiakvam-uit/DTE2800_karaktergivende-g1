import Application from '../Application.js'
import Environment from './Environment.js'
import Floor from './Platforms/Floor.js'
import Player from "./Player/Player.js";
import Healthbar from "./HUD/HealthBar";
import {addLandingPageMenu} from "./Menu/LandingPage";
import {addSkyBox} from "./BackGroundSkyBox";
import Time from "../Utils/Time";
import Lava from "./StaticEnemies/Lava.js";
import FireWall from "./Moving Enemies/FireWall.js";
import TestObjects from "./TestObjects/TestObjects";
import BalancingPlatform from "./Platforms/BalancingPlatform";
import BoxPlatform from "./Platforms/BoxPlatform";
import ComplexPlatform from "./Platforms/ComplexPlatform.js";
import Box from "./Platforms/PlatformShapes/Box";
import * as THREE from "three";
import ThreeAmmoGlobalObjects from "../Utils/ThreeAmmoGlobalObjects";
import Cylinder from "./Platforms/PlatformShapes/Cylinder";
import {RotatingWall} from "./Moving Enemies/RotatingWall.js";

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
            await addSkyBox(this.scene)
            this.globs = new ThreeAmmoGlobalObjects()
            this.fireWall = new FireWall(this.application)
            this.lava = new Lava({x: 10, y: 0.1, z: 5})
            this.addPlatforms()
            this.addMovingObstacles()
            this.healthbar = new Healthbar(5, 5, {x: 30, y: 0, z: 0})
            this.testObjects = new TestObjects()
            this.environment = new Environment()
            this.player = new Player()
            this.ready = true;
        })
    }

    addPlatforms() {
        new BalancingPlatform({x: -10, y: -0.5, z: 0})

        const a = new Box({
            position: {x: 15, y: 0, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            material: this.globs.dirtMaterial,
        })

        const b = new Cylinder({
            position: {x: -20, y: -0.1, z: 0},
            scale: {x: 3, y: 0.2, z: 3},
            material: this.globs.dirtMaterial,
            radius: 1
        })

        const c = new Box({
            position: {x: 25, y: 0, z: 12},
            scale: {x: 5, y: 0.2, z: 5},
            material: this.globs.dirtMaterial,
        })


        const d = new Box({
            position: {x: 0, y: -0.2, z: 0},
            scale: {x: 5, y: 0.2, z: 5},
            material: this.globs.dirtMaterial,
        })

        // const e = new ComplexPlatform({position: {x: -5, y: 1, z: -6}})
        this.application.scene.add(a.mesh, b.mesh, c.mesh, d.mesh)
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
            this.testObjects.update();
            this.player.update();
            this.healthbar.update();
            this.lava.update();
            this.fireWall.update();
            this.rotatingWall.update();
        }
    }
}