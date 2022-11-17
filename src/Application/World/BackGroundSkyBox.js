import * as THREE from 'three'
import Application from '../Application.js'

export async function addSkyBox(scene) {

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    // Merk rekkfølgen:
    const environmentMapTexture = await cubeTextureLoader.load([
        '../../../textures/cubemaps/BlueSpace/bkg1_right.png',   //positiv x (høyre)
        '../../../textures/cubemaps/BlueSpace/bkg1_left.png',   //negativ x (venstre)
        '../../../textures/cubemaps/BlueSpace/bkg1_top.png',   //positiv y (opp)
        '../../../textures/cubemaps/BlueSpace/bkg1_bot.png',   //negativ y (ned)
        '../../../textures/cubemaps/BlueSpace/bkg1_front.png',   //positiv z (ut)
        '../../../textures/cubemaps/BlueSpace/bkg1_back.png',   //negativ z (inn)

    ]);
    scene.background = environmentMapTexture;

    const standardMaterial = new THREE.MeshStandardMaterial();
    standardMaterial.metalness =0.7;
    standardMaterial.roughness=0.03;
    standardMaterial.envMap = environmentMapTexture;
}




