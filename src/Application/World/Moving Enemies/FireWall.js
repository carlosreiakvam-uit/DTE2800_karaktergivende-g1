import * as THREE from 'three'
import Application from "../../Application.js";
import Time from "../../Utils/Time";

export default class FireWall {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.time = new Time();
        this.mesh = undefined
        this.setup()
    }

    setup() {
        let textures = {}
        textures.color = application.resources.items.lava1
        textures.color.encoding = THREE.sRGBEncoding
        textures.color.repeat.set(1.5, 1.5)
        textures.color.wrapS = THREE.RepeatWrapping
        textures.color.wrapT = THREE.RepeatWrapping

        textures.normal = application.resources.items.dirtNormal
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
        this.mesh = fireWallMesh

        const position = {x:10, y:5, z:-9}
        fireWallMesh.name="fireWall1";
        fireWallMesh.position.y = position.y;
        fireWallMesh.position.x = position.x;
        fireWallMesh.position.z = position.z;

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
            this.application.world.player.health -= 100
        }
    }

    update() {
        let hero = this.application.world.player.t
        if(hero !== undefined) {
            this.checkHeroAndThisInteraction(hero)
        }
    }

    updatePositions(hero) {
        this.xDifference = this.getXPositionDifference(hero)
        this.zDifference = this.getZPositionDifference(hero)
        this.yDifference = this.getYPositionDifference(hero)
    }

    checkIfHeroAndThisEntityAreClose(range) {
        return (
            this.checkDifferenceWhenNegativeAndPositiveInput(this.xDifference, -5, 5) &&
            this.checkDifferenceWhenNegativeAndPositiveInput(this.zDifference, -1, 1) &&
            this.checkDifferenceWhenNegativeAndPositiveInput(this.yDifference, -5, 5)
        );
    }

    checkDifferenceWhenNegativeAndPositiveInput(difference, biggerThen, lessThen) {
        return (difference >= biggerThen && difference < 0) || (difference <= lessThen && difference > 0);
    }


    getXPositionDifference(hero) {
        let diff = hero.getOrigin().x() - this.mesh.position.x;
        return diff
    }

    getYPositionDifference(hero) {
        let diff = hero.getOrigin().y() - this.mesh.position.y;
        return diff
    }

    getZPositionDifference(hero) {
        let diff = hero.getOrigin().z() - this.mesh.position.z;
        return diff
    }


    checkHeroAndThisInteraction(hero) {
        this.updatePositions(hero)
        // console.log("x  "+ this.xDifference)
        // console.log("z  "+ this.zDifference)
        // console.log("y  "+ this.yDifference)

        if(this.checkIfHeroAndThisEntityAreClose()) {
            this.takeDamageOnHero(hero)
        }
    }
}