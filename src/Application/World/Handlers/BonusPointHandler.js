import * as THREE from 'three'
import Application from "../../Application.js";
import BonusPoint from "../FriendlyItems/BonusPoint";
import {position} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import * as C from "../../Utils/Constants.js";

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
        for (let i = 0; i < nPoints + 1; i++) {
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
        if (platformName === C.BONUS_START_PLAT) {
            $('#info5').fadeOut(2200);
            $('#info6').fadeIn(2200).delay(8000).fadeOut(2200);
        }


    }

// spawnStartPlatformBonusPoints() {
//     for (let i = 0; i < 4; i++) {
//         let name = "starter"
//         this.startPlatformBonusPoints[i] = new BonusPoint(
//             {x: -3 - i, y: 1, z: 20},
//             1, 0x00FF00, 0.1,
//             name)
//     }
// }

    update() {
        // check if in map
        if (this.allBonusPoints.has(C.BONUS_START_PLAT)) {
            this.allBonusPointsTakenOnStartPlatForm = this.arePointsTaken(C.BONUS_START_PLAT)
        }
        if (this.allBonusPoints.has(C.BONUS_PLAT_1)) {
            this.allBonusPointsTakenOnFirstPlatForm = this.arePointsTaken(C.BONUS_PLAT_1)
        }
        if (this.allBonusPoints.has(C.BONUS_PLAT_2)) {
            this.allBonusPointsTakenOnSecondPlatForm = this.arePointsTaken(C.BONUS_PLAT_2)
        }
        if (this.allBonusPoints.has(C.BONUS_PLAT_3)) {
            this.allBonusPointsTakenOnThirdPlatForm = this.arePointsTaken(C.BONUS_PLAT_3)
        }


        // if (this.allBonusPoints.has('startPlatform').valueOf()
        // if (this.startPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.startPlatformBonusPoints, 0)
        // if (this.firstPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.firstPlatformBonusPoints, 1)
        // if (this.secondPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.secondPlatformBonusPoints, 2)
        // if (this.thirdPlatformBonusPoints.length > 0) this.checkBonusPointsInPlatform(this.thirdPlatformBonusPoints, 3)
    }

    arePointsTaken(key) {
        let taken = false
        let points = this.allBonusPoints.get(key).valueOf()
        for (let i = 0; i < points.length; i++) {
            if (points[i].taken === false) {
                break
            }
            taken = true
        }

        this.specialCasePlat2()
        return taken
    }

    specialCasePlat2(key) {
        if (key === C.BONUS_PLAT_2) {
            $('#info7').fadeOut(2200);
            $('#info8').fadeIn(2200).delay(4000).fadeOut(2200);
        }
    }

    //TODO TRIGGER INFO ON ALL POINTS TAKEN PLAT 2

    // checkBonusPointsInPlatform(platform, decider) {
    //     for (let i = 0; i < platform.length; i++) {
    //         platform[i].update();
    //     }
    //
    //     for (let i = 0; i < platform.length; i++) {
    //         let taken = platform[i].taken;
    //         if (!taken) break;
    //         if (decider === 0 && !this.allBonusPointsTakenOnStartPlatForm) {
    //             this.allBonusPointsTakenOnStartPlatForm = true
    //         }
    //
    //         if (decider === 1 && !this.allBonusPointsTakenOnFirstPlatForm) {
    //             this.allBonusPointsTakenOnFirstPlatForm = true
    //         }
    //
    //         if (decider === 2 && !this.allBonusPointsTakenOnSecondPlatForm) {
    //             this.allBonusPointsTakenOnSecondPlatForm = true
    //         }
    //
    //         if (decider === 3 && !this.allBonusPointsTakenOnThirdPlatForm) {
    //             this.allBonusPointsTakenOnThirdPlatForm = true
    //         }
    //
    //         platform = [];
    //     }
    // }
}