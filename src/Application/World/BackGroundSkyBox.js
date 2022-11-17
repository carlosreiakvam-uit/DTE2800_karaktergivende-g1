import * as THREE from 'three'
import Application from '../Application.js'

export async function addSkyBox(scene) {

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    // Merk rekkfølgen:
    const environmentMapTexture = await cubeTextureLoader.load([
        '../../../textures/cubemaps/GardenNook/px.png',   //positiv x (høyre)
        '../../../textures/cubemaps/GardenNook/nx.png',   //negativ x (venstre)
        '../../../textures/cubemaps/GardenNook/py.png',   //positiv y (opp)
        '../../../textures/cubemaps/GardenNook/ny.png',   //negativ y (ned)
        '../../../textures/cubemaps/GardenNook/pz.png',   //positiv z (ut)
        '../../../textures/cubemaps/GardenNook/nz.png',   //negativ z (inn)
    ]);
    scene.background = environmentMapTexture;

    const standardMaterial = new THREE.MeshStandardMaterial();
    standardMaterial.metalness =0.7;
    standardMaterial.roughness=0.03;
    standardMaterial.envMap = environmentMapTexture;
}




