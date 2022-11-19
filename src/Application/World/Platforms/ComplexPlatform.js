import * as THREE from 'three'
import CustomShape from "../../Shapes/CustomShape";
import CustomMaterial from "../../Utils/CustomMaterial.js"
import ThreeAmmoGlobalObjects from "../../Shapes/ThreeAmmoGlobalObjects";

export default class ComplexPlatform {
    constructor({position: inPos, scale = {x: 1, y: 1, z: 1}, name}) {
        this.globshapes = new ThreeAmmoGlobalObjects()

        // const material = new CustomMaterial()
        this.scale = scale


        const p1 = new CustomShape({
            position: inPos,
            material: material.material,
            dims: {width: 0.5, height: 2, depth: 0.5},
            geometry: this.globshapes.boxGeometry

        })
        const p2 = new CustomShape({
            material: material.material,
            geometry: this.globshapes.boxGeometry
        })
        p1.mesh.add(p2.mesh)
        this.mesh = p1.mesh
    }


    update() {
    }

}