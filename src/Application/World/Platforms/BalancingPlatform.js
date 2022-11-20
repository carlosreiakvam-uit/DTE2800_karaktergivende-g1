import * as THREE from 'three'
import Application from "../../Application.js";
import Box from "./PlatformShapes/Box.js"
import ThreeAmmoGlobalObjects from "../../Utils/ThreeAmmoGlobalObjects";
import Cylinder from "./PlatformShapes/Cylinder";

export default class BalancingPlatform {
    constructor(startPos = {x: 0, y: 0, z: 0}, name) {
        this.application = new Application()
        this.globs = new ThreeAmmoGlobalObjects()
        this.physics = this.application.physics
        this.mass = 1

        let platform = new Box(
            {
                position: startPos,
                scale: {x: 8, y: 0.2, z: 2},
                mass: 1,
                geometry: this.globs.boxGeometry,
                material: this.globs.dirtMaterial
            })

        let anchor = new Cylinder(
            {
                position: {x: startPos.x, y: startPos.y - 0.5, z: startPos.z},
                scale: {x: 2, y: 1, z: 2},
                mass: 0,
                geometry: this.globs.cylinderGeometry,
                material: this.globs.dirtMaterial
            })

        platform.rigidBody.setFriction(1)
        anchor.rigidBody.setFriction(0)

        this.addHingeConstraints(platform, anchor)

        this.application.scene.add(platform.mesh)
    }

    addHingeConstraints(platform, anchor) {
        const anchorPivot = new Ammo.btVector3(0, 0, -0.5);
        const anchorAxis = new Ammo.btVector3(0, 0, 1);
        const armPivot = new Ammo.btVector3(0, 0, -0.5);
        const armAxis = new Ammo.btVector3(0, 0, 1);
        const hingeConstraint = new Ammo.btHingeConstraint(
            platform.rigidBody,
            anchor.rigidBody,
            anchorPivot,
            armPivot,
            anchorAxis,
            armAxis,
            false
        );

        const lowerLimit = -0.01;
        const upperLimit = 0.01;
        const softness = 0.2;
        const biasFactor = 0.0;
        const relaxationFactor = 0.2;
        hingeConstraint.setLimit(lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
        // hingeConstraint.enableAngularMotor(true, 0, 0.5);
        this.physics.world.addConstraint(hingeConstraint, false);
    }
}