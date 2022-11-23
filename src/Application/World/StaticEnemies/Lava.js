import * as THREE from 'three'
import Application from "../../Application.js";
import Time from "../../Utils/Time";
import * as Constant from "../../Utils/constants.js";


export default class Lava {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.time = new Time();
        this.lavaMesh = undefined
        this.position = position
        this.setup()
    }

    update() {
        this.lavaMesh.material.uniforms.uTime.value = this.time.clock.getElapsedTime();
        // console.log(this.rigidBody.threeMesh.position.x)
        // console.log(this.rigidBody.threeMesh.position.y)
        // console.log(this.rigidBody.threeMesh.position.z)
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
            baseTexture: {type: "t", value: lavaTexture},
            baseSpeed: {type: "f", value: 0.02},
            noiseTexture: {type: "t", value: noiseTexture},
            noiseScale: {type: "f", value: 0.1},
            alpha: {type: "f", value: 1.0},

            uBigWavesElevation: {value: 0.01},
            uBigWavesFrequency: {value: new THREE.Vector2(16, 15)},
            uTime: {value: 0},
            uBigWavesSpeed: {value: 0.2},
            uDepthColor: {value: new THREE.Color(colorDebugObject.depthColor)},
            uSurfaceColor: {value: new THREE.Color(colorDebugObject.surfaceColor)},
            uColorOffset: {value: 0.08},
            uColorMultiplier: {value: 5},

            uSmallWavesElevation: {value: 0.15},
            uSmallWavesFrequency: {value: 3},
            uSmallWavesSpeed: {value: 0.2},
            uSmallIterations: {value: 4},
        };

        let fireMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent
        });
        fireMaterial.side = THREE.DoubleSide;
        fireMaterial.transparent = true;

        let geometry = new THREE.PlaneGeometry(10, 10, 512, 512)

        geometry.rotateX(-Math.PI / 2);
        this.lavaMesh = new THREE.Mesh(geometry, fireMaterial);

        this.lavaMesh.name = "myLava";
        this.lavaMesh.position.set(this.position.x, this.position.y, this.position.z)
        this.lavaMesh.collisionResponse = (mesh1) => {
            if (this.application.world.player.health !== undefined) {
                this.takeDamageOnHero()
            }


        };

        application.scene.add(this.lavaMesh);

        let width = this.lavaMesh.geometry.parameters.width;
        let height = 0.4;
        let depth = this.lavaMesh.geometry.parameters.height;

        let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
        this.rigidBody = this.application.physics.createRigidBody(shape, this.lavaMesh, 0.7, 0.8, this.position, 1);
        this.lavaMesh.userData.physicsBody = this.rigidBody;
        this.application.physics.world.addRigidBody(
            this.rigidBody, Constant.COL_GROUP_PLANE, Constant.COL_GROUP_PLANE | Constant.COL_GROUP_PLAYER);
        this.application.physics.rigidBodies.push(this.lavaMesh);
        this.rigidBody.threeMesh = this.lavaMesh;
    }

    takeDamageOnHero() {
        if (this.application.world.player.health > 0) {
            this.application.world.player.health -= 1
        }
    }
}