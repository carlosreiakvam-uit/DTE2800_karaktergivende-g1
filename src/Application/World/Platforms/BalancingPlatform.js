import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/constants.js";
import Box from "../Shapes/Box.js"
import Sphere from "../Shapes/Sphere.js"
import * as arrowHelper from "../../Utils/ArrowHelper.js"

export default class BalancingPlatform {
    constructor(startPos = {x: 0, y: 0, z: 0}, scale = {x: 1, y: 1, z: 1}, color = 0xff00ff, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = 1
        this.x = startPos.x

        let platform = new Box(
            startPos,
            scale,
            1,
            this.application.resources.items.dirtTexture,
            this.application.resources.items.dirtNormal,
            'platform')

        let anchor = new Sphere(
            {x: startPos.x, y: startPos.y - scale.y, z: startPos.z},
            {x: scale.x / 12, y: scale.x / 12, z: scale.x / 12}, color, 0, 'anchor')

        anchor.rigidBody.setFriction(0)

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