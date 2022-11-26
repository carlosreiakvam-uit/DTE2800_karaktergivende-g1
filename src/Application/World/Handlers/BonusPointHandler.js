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
        // this.startPlatformBonusPoints = []
        // this.firstPlatformBonusPoints = []
        // this.secondPlatformBonusPoints = []
        // this.thirdPlatformBonusPoints = []
        this.allBonusPoints = new Map()
    }

    spawnBonusPoints(nPoints, platformName, pos) {
        let points = []
        for (let i = 0; i < nPoints + 1; i++) {
            points.push(new BonusPoint({x: pos.x - i, y: pos.y, z: pos.z}, 1, 0x00FF00, 0.1, platformName))
        }
        this.allBonusPoints.set(platformName, points)
    }

// spawnFirstPlatformBonusPoints() {
//     for (let i = 0; i < 5; i++) {
//         let name = "first"
//         this.firstPlatformBonusPoints[i] = new BonusPoint(
//             {x: 18 - i, y: 1, z: 0},
//             1, 0x00FF00, 0.1,
//             name)
//     }
//     this.application.world.allCollected = false;
// }
//
// spawnSecondPlatformBonusPoints() {
//     for (let i = 0; i < 5; i++) {
//         let name = "second"
//         this.secondPlatformBonusPoints[i] = new BonusPoint(
//             {x: 38 - i, y: 1, z: i},
//             1, 0x00FF00, 0.1,
//             name)
//     }
// }
//
// spawnThirdPlatformBonusPoints() {
//     for (let i = 0; i < 5; i++) {
//         let name = "third"
//         this.thirdPlatformBonusPoints[i] = new BonusPoint(
//             {x: 68 - i, y: 1, z: i},
//             1, 0x00FF00, 0.1,
//             name)
//     }
// }
//
// spawnStartPlatformBonusPoints() {
//     for (let i = 0; i < 4; i++) {
//         let name = "starter"
//         this.startPlatformBonusPoints[i] = new BonusPoint(
//             {x: -3 - i, y: 1, z: 20},
//             1, 0x00FF00, 0.1,
//             name)
//     }
//     $('#info5').fadeOut(2200);
//     $('#info6').fadeIn(2200).delay(8000).fadeOut(2200);
// }

    update() {
        // check if in map
        // console.log('value of',this.allBonusPoints.has('startPlatformPoints')) // OK
        if (this.allBonusPoints.has(C.BONUS_START_PLAT)) {
            this.allBonusPointsTakenOnStartPlatForm = this.arePointsTaken(C.BONUS_START_PLAT)
        }
        if (this.allBonusPoints.has(C.BONUS_PLAT_1)) {
            // console.log("bonus points added on", C.BONUS_PLAT_1) OK
            this.allBonusPointsTakenOnFirstPlatForm = this.arePointsTaken(C.BONUS_PLAT_1)
        }
        if (this.allBonusPoints.has(C.BONUS_PLAT_2)) {
            console.log('points in plat 2')
            this.allBonusPointsTakenOnSecondPlatForm = this.arePointsTaken(C.BONUS_PLAT_2)
        }
        if (this.allBonusPoints.has(C.BONUS_PLAT_3)) {
            this.allBonusPointsTakenOnThirdPlatForm = this.arePointsTaken(C.BONUS_PLAT_3)
            console.log(this.allBonusPointsTakenOnThirdPlatForm)
        }


        // console.log('value of',this.allBonusPoints.get('startPlatformPoints'))
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
            // console.log('ALl POINTS TAKEN ON', key)
            taken = true
        }
        return taken
    }

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
    //             $('#info7').fadeOut(2200);
    //             $('#info8').fadeIn(2200).delay(4000).fadeOut(2200);
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