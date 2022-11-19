import * as THREE from 'three'
import Application from "../Application.js";
import Animations from "../Animations.js";
import Box from "../../Shapes/Box";
import MaterialCustom from "../../Utils/MaterialCustom.js"

export default class ComplexPlatform {
    constructor(position, scale, mass, texture = null, textureNormal = null, textureDisplacement = null, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass

        const material = new MaterialCustom()

        const b1 = new Box({material: material})
        b1.mesh.add(new Box())
    }


    update() {
    }

}