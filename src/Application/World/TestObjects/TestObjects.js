import * as THREE from 'three'
import Application from "../../Application.js";
import Cube from "./Cube";

export default class TestObjects {
    constructor() {
        this.application = new Application()
        this.x = 0


        this.cubeHero = new Cube(
            {x: -2, y: 0.5, z: 0},
            {x: 1.5, y: 1, z: 1},
            0xff0000,
            0,
            'cubeHero',
            4)
        this.fallingBlock = new Cube(
            {x: 0, y: 10, z: 0},
            {x: 1, y: 1, z: 1},
            0xff00ff,
            1,
            'fallingCube',
            null)

        this.application.scene.add(this.cubeHero.mesh, this.fallingBlock.mesh)
    }

    update() {
        // this.cubeHero.mesh.position.setX(this.application.animations.heroPos.x)
        // this.cubeHero.mesh.position.setZ(this.application.animations.heroPos.z)
    }
}