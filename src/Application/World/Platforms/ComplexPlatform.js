import * as THREE from 'three'
import Box from "../../Shapes/Box";
import MaterialCustom from "../../Utils/MaterialCustom.js"
import Application from "../../Application";

export default class ComplexPlatform {
    constructor({position, scale, name}) {
        this.application = new Application()
        this.physics = this.application.physics

        const material = new MaterialCustom()

        const b1 = new Box({position: position, scale: scale})
        console.log(b1.mesh)
        // b1.mesh.add(new Box({position: {x: 3, y: 2.5, z: 0}, material: material}))
        this.application.scene.add(b1.mesh)
    }


    update() {
    }

}