import * as THREE from 'three'
import Application from "../../Application.js";
import Cube from "./Cube";
import CubeHero from "./CubeHero";

export default class TestObjects {
    constructor() {
        this.application = new Application()
        this.x = 0


        this.cubeHero = new CubeHero(
            {x: -2, y: 0.5, z: 0},
            0xff0000,
            1
        )
        this.fallingBlock = new Cube(
            {x: 0, y: 10, z: 0},
            {x: 1, y: 1, z: 1},
            0xff00ff,
            1,
            'fallingCube')

        this.application.scene.add(this.cubeHero.mesh, this.fallingBlock.mesh)
    }

    update() {
        this.cubeHero.mesh.position.setX(this.application.animations.heroPos.x)
        this.cubeHero.mesh.position.setZ(this.application.animations.heroPos.z)
    }
}