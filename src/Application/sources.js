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
        name: 'horizontalWireInDrums',
        type: 'texture',
        path: 'textures/drums/hor_drums.png'
    },
    {
        name: 'wireInDrums',
        type: 'texture',
        path: 'textures/drums/drums.jpg'
    },
    {
        name: 'hook',
        type: 'gltfModel',
        path: 'models/hook.glb'
    },
    {
        name: 'vehicle',
        type: 'gltfModel',
        path: 'models/vehicle.glb'
    },
    {
        name: 'rustColorTexture',
        type: 'texture',
        path: 'textures/rust/color.jpg'
    },
    {
        name: 'headlightGlassTexture',
        type: 'texture',
        path: 'textures/headlightGlass/headlightGlass.jpg'
    },
    {
        name: 'rustNormalTexture',
        type: 'texture',
        path: 'textures/rust/normal.jpg'
    },
    {
        name: 'rustAlphaTexture',
        type: 'texture',
        path: 'textures/rust/alpha.jpg'
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
    }
]