// texture sources

export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
            [
                'textures/environmentMap/px.jpg',
                'textures/environmentMap/nx.jpg',
                'textures/environmentMap/py.jpg',
                'textures/environmentMap/ny.jpg',
                'textures/environmentMap/pz.jpg',
                'textures/environmentMap/nz.jpg'
            ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: "blackDirtyTexture",
        type: "texture",
        path: "textures/blackDirtyMetal/texture.jpg"
    },
    {
        name: "blackDirtyDisplacementTexture",
        type: "texture",
        path: "textures/blackDirtyMetal/displacement_map.jpg"
    },
    {
        name: "soldier",
        type: "gltfModel",
        path: "assets/models/soldier/Soldier.glb"
    },
    {
        name: "healthbar75",
        type: "texture",
        path: "textures//healthbar/healthbar75.png"
    },
    {
        name: "healthbar50",
        type: "texture",
        path: "textures//healthbar/healthbar50.png"
    },
    {
        name: "healthbar25",
        type: "texture",
        path: "textures//healthbar/healthbar25.png"
    },
    {
        name: "healthbar100",
        type: "texture",
        path: "textures//healthbar/healthbar100.png"
    },
]