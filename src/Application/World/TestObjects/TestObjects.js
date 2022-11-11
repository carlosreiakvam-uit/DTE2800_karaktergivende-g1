import * as THREE from 'three'
import Application from "../../Application.js";
import Cube from "./Cube";
import CubeHero from "./CubeHero";
import StaticEnemy1 from "../StaticEnemies/StaticEnemy1";

export default class TestObjects {
    constructor() {
        this.application = new Application()
        this.x = 0


        this.cubeHero = new CubeHero(
            {x: -2, y: 0.5, z: 0},
            0xff0000
        )
        this.fallingBlock = new Cube(
            {x: 0, y: 10, z: 0},
            {x: 1, y: 1, z: 1},
            0xff00ff,
            1,
            'fallingCube')

        this.staticEnemy1 = new StaticEnemy1(
            {x: -4, y: 0.5, z: 0},
            {x: 1, y: 1, z: 1},
            0xffff00,
            0,
            'staticEnemy1'
        )


        this.application.scene.add(this.cubeHero.mesh, this.fallingBlock.mesh, this.staticEnemy1.mesh)
    }

    update() {
    }
}