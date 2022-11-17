import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

export function addNewBonusPoint(application) {
    const TWEEN = require('/node_modules/@tweenjs/tween.js');
    const material = new THREE.MeshStandardMaterial({ color: 0xf80e66});
    material.roughness = 0.4;
    material.shininess = 0.6;
    const geoSphere = new THREE.SphereGeometry(0.5, 64, 64);
    const meshSphere = new THREE.Mesh(geoSphere, material);
    meshSphere.name="mySphere";
    meshSphere.position.y = 10;
    meshSphere.position.x = 10;
    application.scene.add(meshSphere)

    let tweenA = new TWEEN.Tween({x: 10})
        .to({x: 0}, 4000)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate( function (position) {
            meshSphere.position.x = position.x;
        }).start()

    let tweenB = new TWEEN.Tween({x: 0})
        .to({x: 10}, 40000)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate( function (position) {
            meshSphere.position.x = position.x;
        }).start()

    tweenA.chain(tweenB)
    tweenB.chain(tweenA)
}
