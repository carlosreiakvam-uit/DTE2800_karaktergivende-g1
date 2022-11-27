import Application from "../../Application";
import RollingBallEnemy from "../Moving Enemies/RollingBallEnemy";
import Box from "../Platforms/PlatformShapes/Box";
import BonusPointHandler from "./BonusPointHandler";
import Minion from "../FriendlyItems/Minion";
import {assertPluginList} from "@babel/core/lib/config/validation/option-assertions";
import Narvik from "../Platforms/Narvik.js";
import * as Constant from "../../Utils/Constants.js";
import FireWall from "../Moving Enemies/FireWall";


export default class EventHandler {
    constructor() {
        // this.beginningStarted = false
        this.application = new Application()
        this.physics = this.application.physics
        this.secondPlatformAdded = false;
        this.thirdPlatformAdded = false;
        this.firstPlatformAdded = false;
        this.healthInfoTextShown = false;
        this.narvikIsHere = false;
        this.megabridgeSpawned = false;
        this.inGameMenuVisible = false
        this.gameComplete = false;

        this.bonusPointHandler = new BonusPointHandler()

        this.companion = new Minion(
            {x: -5, y: 1, z: 15},
            1, 0xFFFFFF, 0.1,
            "Minion")
    }

    update() {
        // this.updateBeginning()
        this.updateStartPlatform();
        this.updateFirstPlatform()
        this.updateSecondPlatform();
        this.updateThirdPlatform();
        this.updateNarvik();
        this.updateEnd()
        this.playerStandsOnPlatformCloseToEnemies();
        this.companion.update();
        this.bonusPointHandler.update()
    }

    updateStartPlatform() {
        if (this.companion.spotLight.intensity > 0 && !this.firstPlatformAdded) {
            this.spawnFirstPlatform()
            this.bonusPointHandler.spawnBonusPoints(5, Constant.BONUS_START_PLAT, {x: -3, y: 1, z: 20}, {x: 1, z: 0})
        }
    }

    updateFirstPlatform() {
        if (this.bonusPointHandler.allBonusPointsTakenOnStartPlatForm && this.bonusPointHandler.allBonusPoints.has(Constant.BONUS_START_PLAT)) {
            this.bonusPointHandler.allBonusPoints.delete(Constant.BONUS_START_PLAT) // remove check of collected bonus points
            this.bonusPointHandler.spawnBonusPoints(5, Constant.BONUS_PLAT_1, {x: 18, y: 1, z: 9}, {x: 1, z: 0})

        }
    }

    updateSecondPlatform() {
        if (this.movingEnemy1 !== undefined &&
            this.movingEnemy2 !== undefined
        ) {
            this.movingEnemy1.update();
            this.movingEnemy2.update();
        }

        if (this.bonusPointHandler.allBonusPointsTakenOnFirstPlatForm && !this.secondPlatformAdded) {
            this.spawnSecondPlatform()
            this.application.audio.spawn.play()
            this.movingEnemy1 = new RollingBallEnemy(
                {x: 40, y: 5, z: -5},
                0.5, 0xffff00, 0.1,
                "movingEnemy1"
            )

            this.movingEnemy2 = new RollingBallEnemy(
                {x: 45, y: 5, z: 5},
                0.5, 0xffff00, 0.1,
                "movingEnemy2"
            )
        }
    }

    updateThirdPlatform() {

        if (this.fireWall !== undefined && this.fireWall2 !== undefined) {
            this.fireWall.update()
            this.fireWall2.update()
        }

        if (this.bonusPointHandler.allBonusPointsTakenOnSecondPlatForm && !this.thirdPlatformAdded) {
            this.spawnThirdPlatForm();
            this.application.audio.spawn.play()
            this.deactivateEnemies()
            this.bonusPointHandler.allBonusPoints.delete(Constant.BONUS_PLAT_2) // remove check of collected bonus points
            this.fireWall = new FireWall({x: 60, y: 5, z: -9.5})
            this.fireWall2 = new FireWall({x: 60, y: 5, z: -9.5}, true)
        }
    }

    updateNarvik() {
        if (this.bonusPointHandler.allBonusPointsTakenOnThirdPlatForm && !this.narvikIsHere) {
            this.bonusPointHandler.allBonusPoints.delete(Constant.BONUS_PLAT_3) // remove check of collected bonus points
            this.spawnNarvik();
            this.application.audio.spawn.play()

        }
    }

    runEndingCredits() {
        let del = 5000
        let fa = 5000
        $('#credits1').fadeIn(0).delay(del * 2).fadeOut(fa);
        $('#credits2').fadeIn(10000).delay(del).fadeOut(fa);
        $('#credits3').fadeIn(15000).delay(del).fadeOut(fa);
        $('#credits4').fadeIn(20000).delay(del).fadeOut(fa);
        $('#credits5').fadeIn(30000).delay(del).fadeOut(fa);
    }

    updateEnd() {
        if (!this.megabridgeSpawned && this.bonusPointHandler.allBonusPointsTakenOnThirdPlatForm) {
            this.megabridgeSpawned = true;
            this.spawnMegaBridge()
        }
        if (this.megabridgeSpawned) {
            if (this.bonusPointHandler.finalBonusPointTaken && !this.gameComplete) {
                $('#info14').fadeIn(2200).delay(12000).fadeOut(2200);
                this.gameComplete = true;
                this.application.audio.gameSong.stop()
                this.application.audio.endingSong.play()
                const player = this.application.world.player;
                player.active = false;
                player.setAction(player.animationActions.dancing)
                player.controller.setWalkDirection(new Ammo.btVector3(0, 0, 0));

                const camera = this.application.camera;
                camera.lookFrom.z = -camera.lookFrom.z;
                this.gameComplete = true;
                this.runEndingCredits()
            }
        }
    }

    spawnMegaBridge() {
        let length = 100
        const a = new Box({
            position: {
                x: 75 + (length / 2),
                y: 0,
                z: 0
            },
            scale: {x: length, y: 0.2, z: 2},
            name: "megabridge",
            material: application.world.globs.spacePlatformMaterial,
        })

        const endZone = new Box({
            position: {
                x: 85 + length,
                y: 0,
                z: 0
            },
            scale: {x: 20, y: 0.2, z: 20},
            name: "endZone",
            material: application.world.globs.spacePlatformMaterial,
        })

        this.bonusPointHandler.spawnFinalBonusPoint(Constant.BONUS_FINAL, {
            x: 85 + length,
            y: 2,
            z: 0
        })

        this.application.scene.add(a.mesh);
        this.application.scene.add(endZone.mesh);
    }


    playerStandsOnPlatformCloseToEnemies() {
        if (this.healthInfoTextShown) return
        let hero = this.application.world.player.t
        if (hero === undefined) return
        this.checkHeroAndThisInteraction(hero)
    }

    updatePositions(hero) {
        this.xDifference = this.getXPositionDifference(hero)
        this.zDifference = this.getZPositionDifference(hero)
    }

    checkIfHeroAndThisEntityAreClose(range) {
        return (
            this.checkDifferenceWhenNegativeAndPositiveInput(this.xDifference, range[0], range[1]) &&
            this.checkDifferenceWhenNegativeAndPositiveInput(this.zDifference, range[0], range[1])
        );
    }

    checkDifferenceWhenNegativeAndPositiveInput(difference, biggerThen, lessThen) {
        return (difference >= biggerThen && difference < 0) || (difference <= lessThen && difference > 0);
    }

    getXPositionDifference(hero) {
        return hero.getOrigin().x() - 24;
    }

    getZPositionDifference(hero) {
        return hero.getOrigin().z() - 3;
    }

    checkHeroAndThisInteraction(hero) {
        this.updatePositions(hero)
        if (!this.healthInfoTextShown && this.checkIfHeroAndThisEntityAreClose([-5, 5])) {
            this.healthInfoTextShown = true
            $('#info9').fadeIn(2200).delay(4000).fadeOut(2200);
        }
    }


    spawnFirstPlatform() {
        const e = new Box({
            position: {x: 8, y: -0.2, z: 3},
            scale: {x: 5, y: 0.2, z: 5},
            name: "start2",
            material: application.world.globs.spacePlatformMaterial,
        })

        this.firstPlatformAdded = true
        this.application.scene.add(e.mesh);
    }

    spawnSecondPlatform() {
        const a = new Box({
            position: {x: 40, y: 0, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            name: "second",
            material: application.world.globs.spacePlatformMaterial,
        })

        this.secondPlatformAdded = true
        this.bonusPointHandler.spawnBonusPoints(12, Constant.BONUS_PLAT_2, {x: 45, y: 1.5, z: 0}, {x: 1, z: 0})
        this.application.scene.add(a.mesh);
        this.bonusPointHandler.allBonusPoints.delete(Constant.BONUS_PLAT_1) // remove check of collected bonus points
    }

    spawnThirdPlatForm() {
        $('#info7').fadeOut(2200);
        // $('#info8').fadeIn(2200).delay(4000).fadeOut(2200);

        const b = new Box({
            position: {x: 65, y: 0, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            name: "third",
            rotation: {x: 0, y: 0, z: 0},
            material: application.world.globs.spacePlatformMaterial,
        })

        const c = new Box({
            position: {x: 55, y: 2.5, z: 6.2},
            scale: {x: 5, y: 0.2, z: 7.5},
            name: "third",
            rotation: {x: 0, y: 0, z: Math.PI / 2},
            material: application.world.globs.spacePlatformMaterial,
        })

        const d = new Box({
            position: {x: 55, y: 2.5, z: -6.2},
            scale: {x: 5, y: 0.2, z: 7.5},
            name: "third",
            rotation: {x: 0, y: 0, z: Math.PI / 2},
            material: application.world.globs.spacePlatformMaterial,
        })

        const e = new Box({
            position: {x: 60, y: 2.5, z: 10},
            scale: {x: 5, y: 0.2, z: 10},
            name: "third",
            rotation: {x: Math.PI / 2, y: 0, z: Math.PI / 2},
            material: application.world.globs.spacePlatformMaterial,
        })

        const f = new Box({
            position: {x: 70, y: 2.5, z: 10},
            scale: {x: 5, y: 0.2, z: 10},
            name: "third",
            rotation: {x: Math.PI / 2, y: 0, z: Math.PI / 2},
            material: application.world.globs.spacePlatformMaterial,
        })

        const g = new Box({
            position: {x: 60, y: 2.5, z: -10},
            scale: {x: 5, y: 0.2, z: 10},
            name: "third",
            rotation: {x: Math.PI / 2, y: 0, z: Math.PI / 2},
            material: application.world.globs.spacePlatformMaterial,
        })

        const h = new Box({
            position: {x: 70, y: 2.5, z: -10},
            scale: {x: 5, y: 0.2, z: 10},
            name: "third",
            rotation: {x: Math.PI / 2, y: 0, z: Math.PI / 2},
            material: application.world.globs.spacePlatformMaterial,
        })

        this.thirdPlatformAdded = true
        this.bonusPointHandler.spawnBonusPoints(17, Constant.BONUS_PLAT_3, {x: 73, y: 1.5, z: 8}, {x: 1, z: 1})
        this.application.scene.add(
            b.mesh,
            c.mesh,
            d.mesh,
            e.mesh,
            f.mesh,
            g.mesh,
            h.mesh,
        );
    }

    spawnNarvik() {
        this.narvikIsHere = true;
        this.application.scene.add(this.application.resources.narvik.group);

        $('#infoBeenHereBefore').fadeIn(1000).delay(10000).fadeOut(10000);
        setTimeout(function () {
            this.application.audio.beenHereBefore.play()
        }, 2000);


    }

    deactivateEnemies() {
        let eventHandler = this.application.world.eventHandler
        eventHandler.movingEnemy1.deactivateEnemy()
        eventHandler.movingEnemy2.deactivateEnemy()
    }
}