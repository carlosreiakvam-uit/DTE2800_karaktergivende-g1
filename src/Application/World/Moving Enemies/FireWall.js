import * as THREE from 'three'
import Application from "../../Application.js";
import Time from "../../Utils/Time";

export default class FireWall {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.time = new Time();
        this.setup()
    }

    update() {
    }

    setup() {
        let textures = {}
        textures.color = application.resources.items.lava1
        textures.color.encoding = THREE.sRGBEncoding
        textures.color.repeat.set(1.5, 1.5)
        textures.color.wrapS = THREE.RepeatWrapping
        textures.color.wrapT = THREE.RepeatWrapping

        textures.normal = application.resources.items.grassNormalTexture
        textures.normal.repeat.set(1.5, 1.5)
        textures.normal.wrapS = THREE.RepeatWrapping
        textures.normal.wrapT = THREE.RepeatWrapping

        const material = new THREE.MeshStandardMaterial({
            map: textures.color,
            normalMap: textures.normal
        });

        material.roughness = 0.4;
        material.shininess = 0.6;
        const geo = new THREE.BoxGeometry(10, 10, 1);
        let fireWallMesh = new THREE.Mesh(geo, material);

        const position = {x:10, y:5, z:-9}
        fireWallMesh.name="fireWall1";
        fireWallMesh.position.y = position.y;
        fireWallMesh.position.x = position.x;
        fireWallMesh.position.z = position.z;
        fireWallMesh.collisionResponse = (mesh1) => {
            console.log("bam")
            let hero = this.application.world.player.t
            if(hero !== undefined) {
                this.takeDamageOnHero(hero)
            }
        };
        application.scene.add(fireWallMesh)

        const TWEEN = require('/node_modules/@tweenjs/tween.js');

        let tween1 = new TWEEN.Tween({z: position.z})
            .to({z: -position.z}, 6000)
            .onUpdate( function (position) {
                fireWallMesh.position.z = position.z;
            }).start()

        let tween2 = new TWEEN.Tween({x: position.x})
            .to({x: position.x+10}, 6000)
            .onUpdate( function (position) {
                fireWallMesh.position.x = position.x;
            }).start()

        let tween3 = new TWEEN.Tween({z: -position.z})
            .to({z: position.z}, 6000)
            .onUpdate( function (position) {
                fireWallMesh.position.z = position.z;
            }).start()

        let tween4 = new TWEEN.Tween({x: position.x+10})
            .to({x: position.x}, 6000)
            .onUpdate( function (position) {
                fireWallMesh.position.x = position.x;
            }).start()

        tween1.chain(tween2)
        tween2.chain(tween1)
        tween2.chain(tween3)
        tween3.chain(tween4)
        tween4.chain(tween1)
    }

    takeDamageOnHero() {
        if(this.application.world.player.health > 0) {
            this.application.world.player.health -= 50
        }
    }
}