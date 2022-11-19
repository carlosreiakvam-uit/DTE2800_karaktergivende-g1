import Box from "../Shapes/Box.js"
import * as arrowHelper from "../../Utils/ArrowHelper.js"

export default class BoxPlatform extends Box {
    constructor(startPos = {x: 0, y: 0, z: 0}, scale = {x: 1, y: 1, z: 1}, texture, textureNormal, name) {
        super(startPos, scale, 0, texture, textureNormal, name);

        arrowHelper.addArrowToWorldPositiveZ(this.mesh)

        this.application.scene.add(this.mesh)
    }

}