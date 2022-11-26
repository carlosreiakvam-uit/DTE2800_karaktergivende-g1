export default [
    {
        name: `environmentMapTexture`,
        type: "cubeTexture",
        path: [
            'textures/cubemaps/BlueSpace/bkg1_right.png',   //positiv x (høyre)
            'textures/cubemaps/BlueSpace/bkg1_left.png',   //negativ x (venstre)
            'textures/cubemaps/BlueSpace/bkg1_top.png',   //positiv y (opp)
            'textures/cubemaps/BlueSpace/bkg1_bot.png',   //negativ y (ned)
            'textures/cubemaps/BlueSpace/bkg1_front.png',   //positiv z (ut)
            'textures/cubemaps/BlueSpace/bkg1_back.png',   //negativ z (inn)
        ]
    },
    {
        name: `dirtTexture`,
        type: `texture`,
        path: `textures/dirt/color.jpg`
    },
    {
        name: `dirtNormal`,
        type: `texture`,
        path: `textures/dirt/normal.jpg`
    },
    {
        name: `dirtDisplacement`,
        type: `texture`,
        path: `textures/displacementFromMap/jotunheimen_01.png`
    },
    {
        name: `spacePlatformTexture`,
        type: `texture`,
        path: `textures/platform/spacePlatform.jpg`
    },

    {
        name: `blackDirtyTexture`,
        type: `texture`,
        path: `textures/blackDirtyMetal/texture.jpg`
    },
    {
        name: `lightning`,
        type: `texture`,
        path: `textures/lightning/lightning.jpg`
    },
    {
        name: `blackDirtyTextureNormals`,
        type: `texture`,
        path: `textures/blackDirtyMetal/normals.jpg`
    },
    {
        name: `blackDirtyDisplacementTexture`,
        type: `texture`,
        path: `textures/blackDirtyMetal/displacement_map.jpg`
    },
    {
        name: `soldier`,
        type: `gltfModel`,
        path: `assets/models/soldier/Soldier.glb`
    },
    {
        name: `healthbar75`,
        type: `texture`,
        path: `textures//healthbar/healthbar75.png`
    },
    {
        name: `healthbar50`,
        type: `texture`,
        path: `textures//healthbar/healthbar50.png`
    },
    {
        name: `healthbar25`,
        type: `texture`,
        path: `textures//healthbar/healthbar25.png`
    },
    {
        name: `healthbar100`,
        type: `texture`,
        path: `textures//healthbar/healthbar100.png`
    },
    {
        name: `lava1`,
        type: `texture`,
        path: `textures/traps/lava.jpg`
    },
    {
        name: `cloud`,
        type: `texture`,
        path: `textures/traps/cloud.png`
    },
    {
        name: `narvik_displacement`,
        type: `image`,
        path: `textures/narvik/narvik_displacementmap.png`
    },
    {
        name: `narvik_satelite`,
        type: `texture`,
        path: `textures/narvik/narviksatellite_1024.png`
    }
]