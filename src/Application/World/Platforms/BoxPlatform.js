import Box from "./PlatformShapes/Box.js"
import * as arrowHelper from "../../Utils/ArrowHelper.js"

export default class BoxPlatform extends Box {
    constructor(startPos = {x: 0, y: 0, z: 0}, scale = {
        x: 1,
        y: 1,
        z: 1
    }, texture, textureNormal, textureDisplacement, name) {
        super({
            position: startPos,
            scale: scale, mass: 0
        });

        // arrowHelper.addArrowToWorldPositiveZ(this.mesh)

        this.application.scene.add(this.mesh)
    }

}