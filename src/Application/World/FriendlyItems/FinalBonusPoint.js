import FloatingBonusPoint from "./FloatingBonusPoint.js";
import * as THREE from "three";

export class FinalBonusPoint extends FloatingBonusPoint {
    constructor(position, scale, mass, name, floatingForceY = 0.02, upFloatThreshold = 0.5) {
        super(position, scale, mass, name, floatingForceY, upFloatThreshold);
    }

    setTextures() {
        this.material = new THREE.MeshStandardMaterial({
            color: 0x00F604
        });
        this.material.roughness = 0.0;
        this.material.shininess = 1;
    }

}