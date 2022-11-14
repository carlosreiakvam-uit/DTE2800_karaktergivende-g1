import * as THREE from 'three'
import Application from "../../Application.js";
import RollingBallEnemy from "../Moving Enemies/RollingBallEnemy";

export default class TestObjects {
    constructor() {
        this.application = new Application()


        // this.cubeHero = new CubeHero(
        //     {x: -2, y: 0.5, z: 0},
        //     0xff0000
        // )
        // this.fallingBlock = new Cube(
        //     {x: 0, y: 10, z: 0},
        //     {x: 1, y: 1, z: 1},
        //     0xff00ff,
        //     1,
        //     'fallingCube')

        // this.staticEnemy1 = new StaticEnemy1(
        //     {x: -2, y: 0.5, z: 0},
        //     {x: 4, y: 0.5, z: 1},
        //     0xffff00,
        //     1,
        //     'staticEnemy1'
        // )

        this.movingEnemy1 = new RollingBallEnemy(
            {x: 20, y: 10, z: 3},
            1,0xffff00,0.1,
            "movingEnemy1"
        )

        // this.application.scene.add(this.movingEnemy.mesh)
        // this.application.scene.add(
        //     //this.cubeHero.mesh,
        //     //this.fallingBlock.mesh,
        //     //this.staticEnemy1.mesh,
        // )
    }

    update() {
        //this.staticEnemy1.update()
        this.movingEnemy1.update();
    }
}