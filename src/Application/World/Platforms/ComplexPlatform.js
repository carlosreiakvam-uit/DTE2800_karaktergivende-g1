import * as THREE from 'three'
import Box from "./PlatformShapes/Box";
import Application from "../../Application";

export default class ComplexPlatform {
    constructor({position: inPos, scale = {x: 1, y: 1, z: 1}, name}) {
        this.application = new Application()
        this.globs = this.application.globs

        // const material = new CustomMaterial()
        this.scale = scale


        const p1 = new Box({
            position: inPos,
            material: material.material,
            dims: {width: 0.5, height: 2, depth: 0.5},
            geometry: this.globs.boxGeometry

        })
        const p2 = new Box({
            material: material.material,
            geometry: this.globs.boxGeometry
        })
        p1.mesh.add(p2.mesh)
        this.mesh = p1.mesh
    }


    update() {
    }

}