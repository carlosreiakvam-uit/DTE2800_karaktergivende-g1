import * as THREE from 'three'
import Application from "../../Application.js";
import BonusPoint from "../FriendlyItems/BonusPoint";
import {position} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import * as Constsants from "../../Utils/Constants.js";

export default class BonusPointHandler {
    constructor() {
        this.application = new Application()
        this.allBonusPointsTakenOnFirstPlatForm = false;
        this.allBonusPointsTakenOnSecondPlatForm = false;
        this.allBonusPointsTakenOnStartPlatForm = false;
        this.allBonusPointsTakenOnThirdPlatForm = false;
        this.allBonusPoints = new Map()
    }

    spawnBonusPoints(nPoints, platformName, pos, spread) {
        let points = []
        for (let i = 0; i < nPoints ; i++) {
            points.push(new BonusPoint({
                x: pos.x - (i * spread.x),
                y: pos.y,
                z: pos.z - (i * spread.z)
            }, 1, 0x00FF00, 0.1, platformName))
        }
        this.allBonusPoints.set(platformName, points)

        this.specialCasePlat1(platformName)
    }

    specialCasePlat1(platformName) {
        if (platformName === Constsants.BONUS_START_PLAT) {
            $('#info5').fadeOut(2200);
            $('#info6').fadeIn(2200).delay(8000).fadeOut(2200);
        }
    }


    update() {
        if (this.allBonusPoints.has(Constsants.BONUS_START_PLAT)) {
            this.allBonusPointsTakenOnStartPlatForm = this.arePointsTaken(Constsants.BONUS_START_PLAT)
        }
        if (this.allBonusPoints.has(Constsants.BONUS_PLAT_1)) {
            this.allBonusPointsTakenOnFirstPlatForm = this.arePointsTaken(Constsants.BONUS_PLAT_1)
        }
        if (this.allBonusPoints.has(Constsants.BONUS_PLAT_2)) {
            this.allBonusPointsTakenOnSecondPlatForm = this.arePointsTaken(Constsants.BONUS_PLAT_2)
        }
        if (this.allBonusPoints.has(Constsants.BONUS_PLAT_3)) {
            this.allBonusPointsTakenOnThirdPlatForm = this.arePointsTaken(Constsants.BONUS_PLAT_3)
        }
    }

    arePointsTaken(key) {
        let taken = false
        let points = this.allBonusPoints.get(key).valueOf()
        for (let i = 0; i < points.length ; i++) {
            if (points[i].taken === false) {
                break
            }
            taken = true
        }

        this.specialCasePlat2()
        return taken
    }

    specialCasePlat2(key) {
        if (key === Constsants.BONUS_PLAT_2) {
            $('#info7').fadeOut(2200);
            $('#info8').fadeIn(2200).delay(4000).fadeOut(2200);
        }
    }
}
