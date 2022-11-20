import * as THREE from 'three'
import Application from "../../Application.js";
import Box from "./PlatformShapes/Box.js"

export default class BalancingPlatform {
    constructor(startPos = {x: 0, y: 0, z: 0}, color = 0xff00ff, name) {
        this.application = new Application()
        this.globs = this.application.globs
        this.physics = this.application.physics
        this.mass = 1
        this.x = startPos.x

        let platform = new Box(
            {
                position: startPos,
                scale: {x: 8, y: 1, z: 1},
                mass: 1,
                name: 'platform',
                geometry: new THREE.BoxGeometry(1, 1, 1, 128, 128)
            })

        let anchor = new Box(
            {
                position: {x: startPos.x, y: startPos.y - 0.5, z: startPos.z},
                scale: {x: 1, y: 1, z: 1},
                mass: 0,
                name: 'anchor',
                geometry: this.globs.cylinderGeometry
            })


        // const height = platform.mesh.geometry.height
        // let anchor = new Sphere(
        //     {x: startPos.x, y: startPos.y - scale.y, z: startPos.z},
        //     {x: scale.x / 12, y: scale.x / 12, z: scale.x / 12}, color, 0, 'anchor')

        platform.rigidBody.setFriction(0)

        this.addHingeConstraints(platform, anchor)
        // arrowHelper.addArrowToWorldPositiveZ(platform.mesh)

        this.application.scene.add(platform.mesh, anchor.mesh)
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

        const lowerLimit = -Math.PI / 8;
        const upperLimit = Math.PI / 8;
        const softness = 0.2;
        const biasFactor = 0.0;
        const relaxationFactor = 0.2;
        hingeConstraint.setLimit(lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
        // hingeConstraint.enableAngularMotor(true, 0, 0.5);
        this.physics.world.addConstraint(hingeConstraint, false);
    }
}