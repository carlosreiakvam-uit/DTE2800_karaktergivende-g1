import * as THREE from 'three'
import Application from "../../Application.js";
import FloatingBonusPoint from "../FriendlyItems/FloatingBonusPoint.js";
import * as constants from "../../Utils/Constants.js";
import {FinalBonusPoint} from "../FriendlyItems/FinalBonusPoint";

export default class BonusPointHandler {
    constructor() {
        this.application = new Application()
        this.allBonusPointsTakenOnStartPlatForm = false;
        this.allBonusPointsTakenOnFirstPlatForm = false;
        this.allBonusPointsTakenOnSecondPlatForm = false;
        this.allBonusPointsTakenOnThirdPlatForm = false;
        this.finalBonusPointTaken = false;
        this.allBonusPoints = new Map()
    }

    spawnFinalBonusPoint(platformName, position) {
        let points = []
        points.push(new FinalBonusPoint(position, 5, 0.1, platformName, 0.02, 1));
        this.allBonusPoints.set(platformName, points)
    }


    spawnBonusPoints(nPoints, platformName, pos, spread) {
        let points = []
        for (let i = 0; i < nPoints; i++) {
            points.push(new FloatingBonusPoint({
                x: pos.x - (i * spread.x),
                y: pos.y,
                z: pos.z - (i * spread.z)
            }, 1, 0.1, platformName))
        }
        this.allBonusPoints.set(platformName, points)
    }


    update() {
        if (this.allBonusPoints.has(constants.BONUS_START_PLAT)) {
            this.allBonusPointsTakenOnStartPlatForm = this.arePointsTaken(constants.BONUS_START_PLAT)
            this.updateLive(constants.BONUS_START_PLAT)
        }
        if (this.allBonusPoints.has(constants.BONUS_PLAT_1)) {
            this.allBonusPointsTakenOnFirstPlatForm = this.arePointsTaken(constants.BONUS_PLAT_1)
            this.updateLive(constants.BONUS_PLAT_1)
        }
        if (this.allBonusPoints.has(constants.BONUS_PLAT_2)) {
            this.allBonusPointsTakenOnSecondPlatForm = this.arePointsTaken(constants.BONUS_PLAT_2)
            this.updateLive(constants.BONUS_PLAT_2)
        }
        if (this.allBonusPoints.has(constants.BONUS_PLAT_3)) {
            this.allBonusPointsTakenOnThirdPlatForm = this.arePointsTaken(constants.BONUS_PLAT_3)
            this.updateLive(constants.BONUS_PLAT_3)
        }
        if (this.allBonusPoints.has(constants.BONUS_NARVIK)) {
            this.allBonusPointsTakenOnNarvik = this.arePointsTaken(constants.BONUS_NARVIK)
            this.updateLive(constants.BONUS_NARVIK)
        }
        if (this.allBonusPoints.has(constants.BONUS_FINAL)) {
            this.finalBonusPointTaken = this.arePointsTaken(constants.BONUS_FINAL)
            this.updateLive(constants.BONUS_FINAL)

        }

    }

    updateLive(key) {
        let points = this.allBonusPoints.get(key)
        for (let i = 0; i < points.length; i++) {
            points[i].update()
        }
    }

    arePointsTaken(key) {
        let points = this.allBonusPoints.get(key).valueOf()
        return points.every(element => element.taken === true);
    }
}
