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
import {RotatingWall} from "./Moving Enemies/RotatingWall.js";
import Minion from "./FriendlyItems/Minion";
import RollingBallEnemy from "./Moving Enemies/RollingBallEnemy";

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
            //this.addMovingObstacles()
            this.healthbar = new Healthbar(5, 5, {x: 30, y: 0, z: 0})
            this.bonusPointHandler = new BonusPointHandler()
            this.bonusPointHandler.spawnFirstPlatformBonusPoints();
            this.environment = new Environment()
            this.player = new Player({
                x: 0,
                y: 0.5,
                z: 0
            })
            this.companion = new Minion(
                {x: -5, y: 1, z: 15},
                1,0xFFFFFF,0.1,
                "Minion")
            this.ready = true;
            this.secondPlatformAdded = false;
            this.thirdPlatformAdded = false;
            this.firstPlatformAdded = false;
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

        // const c = new Box({
        //     position: {x: 25, y: 0, z: 12},
        //     scale: {x: 5, y: 0.2, z: 5},
        //     material: this.globs.dirtMaterial,
        // })

        const d = new Box({
            position: {x: 0, y: -0.2, z: 0},
            scale: {x: 5, y: 0.2, z: 5},
            name: "start",
            material: this.globs.dirtMaterial,
        })

        // const e = new Box({
        //     position: {x: 8, y: -0.2, z: 3},
        //     scale: {x: 5, y: 0.2, z: 5},
        //     name: "start2",
        //     material: this.globs.dirtMaterial,
        // })

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
            this.bonusPointHandler.update();
            this.player.update();
            this.healthbar.update();
            this.lava.update();
            //this.rotatingWall.update();
            //this.fireWall.update();
            this.companion.update();

            this.updateSecondPlatform();
            this.updateThirdPlatform();
            this.updateFirstPlatform();
        }
    }

    updateFirstPlatform() {
        if (this.companion.spotLight.intensity > 0 && !this.firstPlatformAdded) {
            this.spawnBonusPoints()
            this.firstPlatformAdded = true;
        }
    }
    spawnBonusPoints() {
        this.bonusPointHandler.spawnStartPlatformBonusPoints();
    }


    updateSecondPlatform() {
        if(this.movingEnemy1 !== undefined && this.movingEnemy2 !== undefined) {
            this.movingEnemy1.update();
            this.movingEnemy2.update();
        }

        if(this.bonusPointHandler.allBonusPointsTakenOnFirstPlatForm && !this.secondPlatformAdded) {
            this.spawnSecondPlatform()
            this.movingEnemy1 = new RollingBallEnemy(
                {x: 35, y: 10, z: -5},
                0.5,0xffff00,0.1,
                "movingEnemy1"
            )

            this.movingEnemy2 = new RollingBallEnemy(
                {x: 35, y: 10, z: 5},
                0.5,0xffff00,0.1,
                "movingEnemy2"
            )
        }
    }

    updateThirdPlatform() {
        if(this.bonusPointHandler.allBonusPointsTakenOnSecondPlatForm && !this.thirdPlatformAdded) {
            this.spawnThirdPlatForm();
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