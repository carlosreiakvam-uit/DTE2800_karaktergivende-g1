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
import CustomShape from "../Shapes/CustomShape";
import * as THREE from "three";
import ThreeAmmoGlobalObjects from "../Shapes/ThreeAmmoGlobalObjects";

export default class World_01 {
    constructor() {
        this.application = new Application()
        this.globs = new ThreeAmmoGlobalObjects()
        this.time = new Time();
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.ready = false;


        // Wait for resources
        this.resources.on('ready', async () => {
            //new Coordinates()
            await addLandingPageMenu(this.application)
            await addSkyBox(this.scene)
            this.fireWall = new FireWall(this.application)
            this.lava = new Lava({x: 10, y: 0.2, z: 5})
            this.addPlatforms()
            this.healthbar = new Healthbar(5, 5, {x: 30, y: 0, z: 0})
            this.testObjects = new TestObjects()
            this.environment = new Environment()
            this.player = new Player()
            this.ready = true;
        })
    }

    addPlatforms() {
        // new BalancingPlatform({x: -10, y: -0.5, z: 0})

        const trial = new CustomShape({
            position: {x: 0, y: 0, z: 0},
            scale: {x: 30, y: 0.2, z: 30},
            geometry: this.globs.boxGeometry
        })

        // const a = new CustomShape({
        //     position: {x: -20, y: 2.5, z: 0},
        //     scale: {x: 8, y: 0.2, z: 8},
        //     geometry: this.globs.boxGeometry
        // })
        // const b = new CustomShape({
        //     position: {x: 25, y: -0.2, z: 12},
        //     scale: {x: 5, y: 0.2, z: 2},
        //     geometry: this.globs.cylinderGeometry
        // })
        // const c = new CustomShape({
        //     position: {x: 15, y: -0.2, z: 0},
        //     scale: {x: 20, y: 0.2, z: 20, geometry: this.globs.boxGeometry}
        // })
        // const d = new CustomShape({
        //     position: {x: 0, y: -0.2, z: 0},
        //     scale: {x: 5, y: 0.2, z: 5},
        //     geometry: this.globs.boxGeometry
        // })
        // const e = new ComplexPlatform({position: {x: -5, y: 1, z: -6}})
        // this.application.scene.add(a.mesh, b.mesh, c.mesh, d.mesh)
        this.application.scene.add(trial.mesh)

    }

    update() {
        if (this.ready) {
            this.environment.update();
            this.testObjects.update();
            this.player.update();
            this.healthbar.update();
            this.lava.update();
            this.fireWall.update();
        }
    }
}