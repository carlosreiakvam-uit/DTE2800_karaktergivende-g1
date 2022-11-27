import * as THREE from 'three'
import Application from "../../Application.js";
import FloatingBonusPoint from "../FriendlyItems/FloatingBonusPoint.js";
import {position} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import * as constants from "../../Utils/Constants.js";

export default class BonusPointHandler {
    constructor() {
        this.application = new Application()
        this.allBonusPointsTakenOnStartPlatForm = false;
        this.allBonusPointsTakenOnFirstPlatForm = false;
        this.allBonusPointsTakenOnSecondPlatForm = false;
        this.allBonusPointsTakenOnThirdPlatForm = false;
        this.allBonusPointsTakenOnNarvik = false;
        this.allBonusPoints = new Map()
        this.genNarvikPointPositions()
    }

    genNarvikPointPositions() {
        this.narvikPointPositions = [
            {x: 102.7, y: -2, z: 6.1,}, // in the sea
            {x: 116.5, y: -1, z: 7.7,}, // UIT
            {x: 150.1, y: 6, z: 9.9,} // top of mountain
        ]
    }

    spawnNarvikPoints(platformName) {
        console.log('spawning narvik points')
        let points = []
        for (let i = 0; i < this.narvikPointPositions.length; i++) {
            let pos = this.narvikPointPositions[i]
            points.push(new FloatingBonusPoint(pos, 1, 0.1, platformName, 0.02, 1))
        }
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
        this.specialCasePlat1(platformName)
    }

    specialCasePlat1(platformName) {
        if (platformName === constants.BONUS_START_PLAT) {
            $('#info5').fadeOut(2200);
            // $('#info6').fadeIn(2200).delay(8000).fadeOut(2200);
        }
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

    checkSpecialCasePlat2(key) {
        if (key === constants.BONUS_PLAT_2) {
        }
    }
}
