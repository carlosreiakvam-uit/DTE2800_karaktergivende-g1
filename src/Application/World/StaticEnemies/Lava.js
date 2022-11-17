import * as THREE from 'three'
import Application from "../../Application.js";
import Time from "../../Utils/Time";

export default class Lava {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.time = new Time();
        this.lavaMesh = undefined
        this.setup()
    }

    update() {
        this.lavaMesh.material.uniforms.uTime.value = this.time.clock.getElapsedTime();
    }

    setup() {
        const lavaTexture = application.resources.items.lava1
        lavaTexture.wrapS = THREE.RepeatWrapping;
        lavaTexture.wrapT = THREE.RepeatWrapping;
        const noiseTexture = application.resources.items.cloud
        noiseTexture.wrapS = THREE.RepeatWrapping;
        noiseTexture.wrapT = THREE.RepeatWrapping;

        const colorDebugObject = {}
        colorDebugObject.depthColor = '#186691';
        colorDebugObject.surfaceColor = '#9bd8ff';

        //Definerer ekstra uniform-variabler:
        let uniforms = {
            baseTexture: { type: "t", value: lavaTexture },
            baseSpeed: { type: "f", value: 0.02 },
            noiseTexture: { type: "t", value: noiseTexture },
            noiseScale: { type: "f", value: 0.1 },
            alpha: { type: "f", value: 1.0 },

            uBigWavesElevation: { value: 0.01 },
            uBigWavesFrequency: { value: new THREE.Vector2(16, 15) },
            uTime: { value: 0 },
            uBigWavesSpeed: { value: 0.2 },
            uDepthColor: { value: new THREE.Color(colorDebugObject.depthColor) },
            uSurfaceColor: { value: new THREE.Color(colorDebugObject.surfaceColor) },
            uColorOffset: { value: 0.08 },
            uColorMultiplier: { value: 5 },

            uSmallWavesElevation: { value: 0.15 },
            uSmallWavesFrequency: { value: 3 },
            uSmallWavesSpeed: { value: 0.2 },
            uSmallIterations: { value: 4 },
        };

        let fireMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent
        });
        fireMaterial.side = THREE.DoubleSide;
        fireMaterial.transparent = true;

        let geometry = new THREE.PlaneGeometry(10, 10, 512, 512)

        geometry.rotateX(-Math.PI/2);
        this.lavaMesh = new THREE.Mesh(geometry, fireMaterial);
        this.lavaMesh.name = "myLava";
        this.lavaMesh.position.y = 0.2
        this.lavaMesh.position.x = 10
        this.lavaMesh.position.z = 5

        application.scene.add(this.lavaMesh);
    }
}