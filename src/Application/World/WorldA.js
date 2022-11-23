import Application from '../Application.js'
import Environment from './Environment.js'
import Player from "./Player/Player.js";
import Healthbar from "./HUD/HealthBar";
import {addLandingPageMenu} from "./Menu/LandingPage";
import {addSkyBox} from "./BackGroundSkyBox";
import Time from "../Utils/Time";
import Lava from "./StaticEnemies/Lava.js";
import FireWall from "./Moving Enemies/FireWall.js";
import BonusPointHandler from "./TestObjects/BonusPointHandler";
import BalancingPlatform from "./Platforms/BalancingPlatform";
import Box from "./Platforms/PlatformShapes/Box";
import * as THREE from "three";
import ThreeAmmoGlobalObjects from "../Utils/ThreeAmmoGlobalObjects";
import Cylinder from "./Platforms/PlatformShapes/Cylinder";
import Companion from "./FriendlyItems/Companion";
import {position} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import BonusPoint from "./FriendlyItems/BonusPoint";

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
            this.healthbar = new Healthbar(5, 5, {x: 30, y: 0, z: 0})
            this.bonusPointHandler = new BonusPointHandler()
            this.bonusPointHandler.spawnFirstPlatformBonusPoints();
            this.environment = new Environment()
            this.player = new Player()
            this.companion = new Companion(
                {x: 0, y: 3, z: 0},
                1,0xFFFFFF,0.1,
                "Companion")
            this.ready = true;
            this.secondPlatformAdded = false;
            this.thirdPlatformAdded = false;
        })
    }

    addPlatforms() {
        new BalancingPlatform({x: -10, y: -0.5, z: 0})

        const a = new Box({
            position: {x: 15, y: 0, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            name: "first",
            material: this.globs.dirtMaterial,
        })

        const b = new Cylinder({
            position: {x: -20, y: 0, z: 0},
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
            name: "start",
            material: this.globs.dirtMaterial,
        })

        //const e = new ComplexPlatform({position: {x: -5, y: 1, z: -6}})
        this.application.scene.add(
            a.mesh,
            b.mesh,
            c.mesh,
            d.mesh
        )
    }

    update() {
        if (this.ready) {
            this.environment.update();
            this.bonusPointHandler.update();
            this.player.update();
            this.healthbar.update();
            this.lava.update();
            this.fireWall.update();
            this.companion.update();

            if(this.bonusPointHandler.allBonusPointsTakenOnFirstPlatForm && !this.secondPlatformAdded) {
                this.spawnSecondPlatform()
            }

            if(this.bonusPointHandler.allBonusPointsTakenOnSecondPlatForm && !this.thirdPlatformAdded) {
               this.spawnThirdPlatForm();
            }
        }
    }

    spawnSecondPlatform() {
        const a = new Box({
            position: {x: 40, y: 0, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            name: "second",
            material: this.globs.dirtMaterial,
        })

        this.secondPlatformAdded = true
        this.bonusPointHandler.spawnSecondPlatformBonusPoints()
        this.application.scene.add(a.mesh);
    }

    spawnThirdPlatForm() {
        const b = new Box({
            position: {x: 65, y: 0, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            name: "third",
            material: this.globs.dirtMaterial,
        })
        this.thirdPlatformAdded = true
        this.bonusPointHandler.spawnThirdPlatformBonusPoints()
        this.application.scene.add(b.mesh);
    }
}