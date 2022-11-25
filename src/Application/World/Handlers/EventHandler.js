import Application from "../../Application";
import RollingBallEnemy from "../Moving Enemies/RollingBallEnemy";
import Box from "../Platforms/PlatformShapes/Box";
import BonusPointHandler from "./BonusPointHandler";
import Minion from "../FriendlyItems/Minion";
import {assertPluginList} from "@babel/core/lib/config/validation/option-assertions";

export default class EventHandler {
    constructor() {
        this.application = new Application()
        this.physics = this.application.physics
        this.secondPlatformAdded = false;
        this.thirdPlatformAdded = false;
        this.firstPlatformAdded = false;
        this.healthInfoTextShown = false

        this.bonusPointHandler = new BonusPointHandler()
        this.bonusPointHandler.spawnFirstPlatformBonusPoints();
        this.companion = new Minion(
            {x: -5, y: 1, z: 15},
            1,0xFFFFFF,0.1,
            "Minion")
    }

    update() {
        this.updateSecondPlatform();
        this.updateThirdPlatform();
        this.updateFirstPlatform();
        this.playerStandsOnPlatformCloseToEnemies()
        this.companion.update();
        this.bonusPointHandler.update()
    }

    updateFirstPlatform() {
        if (this.companion.spotLight.intensity > 0 && !this.firstPlatformAdded) {
            this.spawnBonusPoints()
            this.spawnFirstPlatform()
        }
    }
    spawnBonusPoints() {
        this.bonusPointHandler.spawnStartPlatformBonusPoints();
    }

    playerStandsOnPlatformCloseToEnemies() {
        if(this.healthInfoTextShown) return
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
        if (!this.healthInfoTextShown && this.checkIfHeroAndThisEntityAreClose([-5,5])) {
            this.healthInfoTextShown = true
            $('#info9').fadeIn(2200).delay(4000).fadeOut(2200);
        }
    }

    updateSecondPlatform() {
        if(this.movingEnemy1 !== undefined && this.movingEnemy2 !== undefined) {
            this.movingEnemy1.update();
            this.movingEnemy2.update();
        }

        if(this.bonusPointHandler.allBonusPointsTakenOnFirstPlatForm && !this.secondPlatformAdded) {
            this.spawnSecondPlatform()
            this.movingEnemy1 = new RollingBallEnemy(
                {x: 35, y: 5, z: -5},
                0.5,0xffff00,0.1,
                "movingEnemy1"
            )

            this.movingEnemy2 = new RollingBallEnemy(
                {x: 35, y: 5, z: 5},
                0.5,0xffff00,0.1,
                "movingEnemy2"
            )

            this.movingEnemy3 = new RollingBallEnemy(
                {x: 45, y: 5, z: 5},
                0.5,0xffff00,0.1,
                "movingEnemy3"
            )

            this.movingEnemy4 = new RollingBallEnemy(
                {x: 45, y: 5, z: -5},
                0.5,0xffff00,0.1,
                "movingEnemy4"
            )
        }
    }

    updateThirdPlatform() {
        if(this.bonusPointHandler.allBonusPointsTakenOnSecondPlatForm && !this.thirdPlatformAdded) {
            this.spawnThirdPlatForm();
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
        this.bonusPointHandler.spawnSecondPlatformBonusPoints()
        this.application.scene.add(a.mesh);
    }

    spawnThirdPlatForm() {
        const b = new Box({
            position: {x: 65, y: 0, z: 0},
            scale: {x: 20, y: 0.2, z: 20},
            name: "third",
            material: application.world.globs.spacePlatformMaterial,
        })
        this.thirdPlatformAdded = true
        this.bonusPointHandler.spawnThirdPlatformBonusPoints()
        this.application.scene.add(b.mesh);
    }
}