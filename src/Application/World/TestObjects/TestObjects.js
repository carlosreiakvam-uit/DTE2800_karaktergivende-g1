import * as THREE from 'three'
import Application from "../../Application.js";
import RollingBallEnemy from "../Moving Enemies/RollingBallEnemy";
import BonusPoint from "../FriendlyItems/BonusPoint";

export default class TestObjects {
    constructor() {
        this.application = new Application()
        this.allBonusPoints = []

        for(let i = -5; i< 3; i++) {
            let name = "bonus"+i
            this.allBonusPoints[i] = new BonusPoint(
                {x: 18-i, y: 1, z: i},
                1,0x00FF00,0.1,
                name)
        }


        this.movingEnemy1 = new RollingBallEnemy(
            {x: 20, y: 10, z: 3},
            0.5,0xffff00,0.1,
            "movingEnemy1"
        )
    }

    update() {
        //this.staticEnemy1.update()
        this.movingEnemy1.update();
        for(let i = -5; i < 3; i++) {
            this.allBonusPoints[i].update();
        }
    }
}