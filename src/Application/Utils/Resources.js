import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader.js";
import sources from "../sources.js";
import ThreeAmmoGlobalObjects from "./ThreeAmmoGlobalObjects";
import {ImageLoader} from "three";

export default class Resources extends EventEmitter {
    constructor() {
        super()
        this.sources = sources
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0
        const loadingBarElement = document.querySelector('.loading-bar')
        const loadingDiv = document.querySelector('.loading')

        // Loading manager with strong inspiration from threejs-journey.com
        this.loadingManager = new THREE.LoadingManager(
            () => {
                console.log('LOADING ASSETS COMPLETE')
                loadingDiv.remove()
                this.trigger('ready')
            },
            (itemUrl, itemsLoaded, itemsTotal) => {
                const progressRatio = itemsLoaded / itemsTotal
                loadingBarElement.style.transform = `scaleX(${progressRatio})`
                // console.log(progressRatio)
                // console.log(itemUrl, itemsLoaded, itemsTotal)
            }
        )


        this.setLoaders(sources)
        this.startLoading(sources)
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        this.loaders.fbxLoader = new FBXLoader(this.loadingManager)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        this.loaders.imageLoader = new THREE.ImageLoader(this.loadingManager)
    }

    startLoading() {
        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            } else if (source.type === 'fbxModel') {
                this.loaders.fbxLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            } else if (source.type === 'image') {
                this.loaders.imageLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }

        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++
    }
}