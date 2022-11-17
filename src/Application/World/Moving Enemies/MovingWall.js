import * as THREE from 'three'


export function addMovingWall(application) {

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
    const geoSphere = new THREE.BoxGeometry(10, 10, 1);
    const meshSphere = new THREE.Mesh(geoSphere, material);

    const position = {x:10, y:5, z:-9}
    meshSphere.name="mySphere";
    meshSphere.position.y = position.y;
    meshSphere.position.x = position.x;
    meshSphere.position.z = position.z;
    application.scene.add(meshSphere)

    const TWEEN = require('/node_modules/@tweenjs/tween.js');

    let tween1 = new TWEEN.Tween({z: position.z})
        .to({z: -position.z}, 6000)
        .onUpdate( function (position) {
            meshSphere.position.z = position.z;
        }).start()

    let tween2 = new TWEEN.Tween({x: position.x})
        .to({x: position.x+10}, 6000)
        .onUpdate( function (position) {
            meshSphere.position.x = position.x;
        }).start()

    let tween3 = new TWEEN.Tween({z: -position.z})
        .to({z: position.z}, 6000)
        .onUpdate( function (position) {
            meshSphere.position.z = position.z;
        }).start()

    let tween4 = new TWEEN.Tween({x: position.x+10})
        .to({x: position.x}, 6000)
        .onUpdate( function (position) {
            meshSphere.position.x = position.x;
        }).start()

    tween1.chain(tween2)
    tween2.chain(tween1)
    tween2.chain(tween3)
    tween3.chain(tween4)
    tween4.chain(tween1)
}