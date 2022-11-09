import * as THREE from 'three'
import Application from "../../Application.js";
import Cube from "./Cube";

export default class TestObjects {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.x = 0


        console.log(this.application.physics.world)
        this.cubeHero = new Cube({x: 0, y: 10, z: 0}, {x: 1.5, y: 1, z: 1}, 0xff0000)
        this.phusicsBlock = new Cube({x: 0, y: 0.5, z: 0}, {x: 1, y: 1, z: 1}, 0xff00ff)
        // console.log(this.application.physics.rigidBodies)
        console.log(this.application.physics.world)
        this.scene.add(this.cubeHero.mesh, this.phusicsBlock.mesh)
    }

    update() {
        // this.cubeHero.mesh.position.setX(this.application.animations.heroPos.x)
        // this.cubeHero.mesh.position.setZ(this.application.animations.heroPos.z)
    }
}