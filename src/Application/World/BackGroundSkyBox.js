import * as THREE from 'three'

export function addSkyBox(scene, resources) {
    scene.background = resources.items.environmentMapTexture;

    const standardMaterial = new THREE.MeshStandardMaterial();
    standardMaterial.metalness =0.7;
    standardMaterial.roughness=0.03;
    standardMaterial.envMap = resources.items.environmentMapTexture;
}




