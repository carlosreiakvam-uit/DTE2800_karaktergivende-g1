import * as THREE from 'three'
import Application from "../../Application.js";
import RollingBallEnemy from "../Moving Enemies/RollingBallEnemy";
import BonusPoint from "../FriendlyItems/BonusPoint";

export default class BonusPointHandler {
    constructor() {
        this.application = new Application()
        this.allBonusPointsTakenOnFirstPlatForm = false;
        this.allBonusPointsTakenOnSecondPlatForm = false;
        this.allBonusPointsTakenOnStartPlatForm = false;
        this.allBonusPointsTakenOnThirdPlatForm = false;
        this.startPlatformBonusPoints = []
        this.firstPlatformBonusPoints = []
        this.secondPlatformBonusPoints = []
        this.thirdPlatformBonusPoints = []
    }

    spawnFirstPlatformBonusPoints() {
        for(let i = 0; i< 5; i++) {
            let name = "first"
            this.firstPlatformBonusPoints[i] = new BonusPoint(
                {x: 18-i, y: 1, z: 0},
                1,0x00FF00,0.1,
                name)
        }
        this.application.world.allCollected = false;
    }

    spawnSecondPlatformBonusPoints() {
        for(let i = 0; i< 5; i++) {
            let name = "second"
            this.secondPlatformBonusPoints[i] = new BonusPoint(
                {x: 38-i, y: 1, z: i},
                1,0x00FF00,0.1,
                name)
        }
    }

    spawnThirdPlatformBonusPoints() {
        for(let i = 0; i< 5; i++) {
            let name = "third"
            this.thirdPlatformBonusPoints[i] = new BonusPoint(
                {x: 68-i, y: 1, z: i},
                1,0x00FF00,0.1,
                name)
        }
    }

    spawnStartPlatformBonusPoints() {
        for(let i = 0; i< 4; i++) {
            let name = "starter"
            this.startPlatformBonusPoints[i] = new BonusPoint(
                {x: -3 -i, y: 1, z: 20},
                1,0x00FF00,0.1,
                name)
        }
        $('#info5').fadeOut(2200);
        $('#info6').fadeIn(2200).delay(8000).fadeOut(2200);
        $('#info7').delay(8000).fadeIn(2200);

    }

    update() {
        if(this.startPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.startPlatformBonusPoints, 0)
        if(this.firstPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.firstPlatformBonusPoints, 1)
        if(this.secondPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.secondPlatformBonusPoints, 2)
        if(this.thirdPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.thirdPlatformBonusPoints, 3)
    }

    checkBonusPointsInPlatform(platform, decider) {
        for(let i = 0; i < platform.length; i++) {
            platform[i].update();
        }

        for(let i = 0; i < platform.length; i++) {
            let taken = platform[i].taken;
            if(!taken) break;
            if(decider === 0 && !this.allBonusPointsTakenOnStartPlatForm) {
                this.allBonusPointsTakenOnStartPlatForm = true
                $('#info7').fadeOut(2200);
                $('#info8').fadeIn(2200).delay(4000).fadeOut(2200);
            }

            if(decider === 1 && !this.allBonusPointsTakenOnFirstPlatForm) {
                this.allBonusPointsTakenOnFirstPlatForm = true
            }

            if(decider === 2 && !this.allBonusPointsTakenOnSecondPlatForm) {
                this.allBonusPointsTakenOnSecondPlatForm = true
            }

            if(decider === 3 && !this.allBonusPointsTakenOnThirdPlatForm) {
                this.allBonusPointsTakenOnThirdPlatForm = true
            }

            platform = [];
        }
    }
}