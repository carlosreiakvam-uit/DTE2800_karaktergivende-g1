import Application from "../../Application.js";
import * as THREE from "three";
import * as Constant from "../../Utils/constants.js";

export default class Narvik {
    constructor(width, length, position = {x: 0, y: 0, z: 0}) {
        this.application = new Application()
        this.position = position
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.physics = application.physics
        this.width = width;
        this.length = length;
        this.group = new THREE.Group();
        this.createTerrain();
        this.addLight(position);
    }

    createTerrain() {
        const terrainWidth=1024;
        const terrainHeight=1024;
        const heightData = this.resources.items.narvik_displacement;

        let heightFieldData = this.createHeightFieldShape(heightData, terrainWidth, terrainHeight);

        let scaleX = this.width / (terrainWidth - 1);    //2 * 400 / (128-1) = 6
        let scaleZ = this.length / (terrainHeight - 1);   //2 * 400 / (128-1) = 6
        heightFieldData.heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));
        heightFieldData.heightFieldShape.setMargin(0.05);


        // THREE
        // Størrelse på PlaneGeometry: with = height = 1024
        // Denne inndeles så i 1023 * 1023 småruter.
        let terrainGeometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight, terrainWidth - 1, terrainHeight - 1);
        //MERK! Roterer GEOMETRIEN!
        terrainGeometry.rotateX(-Math.PI / 2);
        let vertices = terrainGeometry.attributes.position.array;
        // Ammo-shapen blir (automatisk) sentrert om origo basert på this.terrainMinHeight og this.terrainMaxHeight.
        // Må derfor korrigere THREE-planets y-verdier i forhold til dette.
        // Flytter dermed three-planet NED, tilsvarende minHeigt + (maxHeight - minHeight)/2.
        let delta = (heightFieldData.terrainMinHeight + ((heightFieldData.terrainMaxHeight - heightFieldData.terrainMinHeight) / 2));
        // Endrer høydeverdiene på geometrien:
        for (let i = 0; i < heightData.length; i++) {
            // 1 + (i*3) siden det er y-verdien som endres:
            vertices[1 + (i * 3)] = heightData[i] - delta;
        }
        // Oppdater normaler:
        terrainGeometry.computeVertexNormals();

        const terrainMaterial = new THREE.MeshStandardMaterial({
            map: this.resources.items.narvik_satelite,
            side: THREE.DoubleSide,
            wireframe: false
        });
        // terrainMaterial.map.rotation = Math.PI;
        // terrainMaterial.map.center = new THREE.Vector2(0.5, 0.5);
        terrainMaterial.needsUpdate = true;
        const mesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        mesh.name = 'terrain';
        mesh.receiveShadow = true;
        mesh.scale.set(0.1,0.1,0.1)

        const rigidBody = this.physics.createRigidBody(
            heightFieldData.heightFieldShape, mesh, 0.5, 0.3, this.position, 0);

        this.physics.world.addRigidBody(rigidBody, Constant.COL_GROUP_PLANE,
            Constant.COL_GROUP_PLAYER | Constant.COL_GROUP_PLANE)


        // this.scene.add(this.mesh);
        this.physics.rigidBodies.push(mesh)

        rigidBody.threeMesh = mesh;
        mesh.userData.physicsBody = rigidBody;

        this.group.add(mesh);
    }

    // FRA: http://kripken.github.io/ammo.js/examples/webgl_demo_terrain/index.html
    // Lager en Ammo.btHeightfieldTerrainShape vha. minnebufret ammoHeightData.
    // ammoHeightData FYLLES vha. heightData OG this.terrainWidth, this.terrainHeight - parametrene.
    // Gjøres vha. brukes Ammo._malloc og Ammo.HEAPF32[].
    createHeightFieldShape(heightData, terrainWidth, terrainHeight) {

        // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
        let heightScale = 1;

        // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
        let upAxis = 1;

        // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
        let hdt = "PHY_FLOAT";

        // Set this to your needs (inverts the triangles)
        let flipQuadEdges = false;

        // Creates height data buffer in Ammo heap
        const ammoHeightData = Ammo._malloc(4 * terrainWidth * terrainHeight);

        // NB! Viktig å finne og sette this.terrainMaxHeight og this.terrainMinHeight:
        let p = 0;
        let p2 = 0;
        let terrainMaxHeight = Number.NEGATIVE_INFINITY;     //NB! setter til en lav (nok) verdi for å være sikker.
        let terrainMinHeight = Number.POSITIVE_INFINITY;      //NB! setter til en høy (nok) verdi for å være sikker.
        // Copy the javascript height data array to the Ammo one.
        for (let j = 0; j < terrainHeight; j++) {
            for (let i = 0; i < terrainWidth; i++) {
                if (heightData[p] < terrainMinHeight)
                    terrainMinHeight = heightData[p];
                if (heightData[p] >= terrainMaxHeight)
                    terrainMaxHeight = heightData[p];
                // write 32-bit float data to memory  (Se: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)
                Ammo.HEAPF32[ammoHeightData + p2 >> 2] = heightData[p];   // >>  Signed right shift. Shifts right by pushing copies of the leftmost bit in from the left, and let the rightmost bits fall off.
                p++;
                // 4 bytes/float
                p2 += 4;
            }
        }
        // Creates the heightfield physics shape
        let heightFieldShape = new Ammo.btHeightfieldTerrainShape(
            terrainWidth,
            terrainHeight,
            ammoHeightData,
            heightScale,
            terrainMinHeight,
            terrainMaxHeight,
            upAxis,
            hdt,
            flipQuadEdges
        );

        return {
            terrainMinHeight: terrainMinHeight,
            terrainMaxHeight: terrainMaxHeight,
            heightFieldShape: heightFieldShape
        };
    }




    addLight(position) {
        const light = new THREE.SpotLight(0xFFFFFF, 10, 70, Math.PI * 0.9, 0.8, 0.1);

        light.target.position.set(position.x, position.y, position.z);
        light.position.set(position.x, position.y+50, position.z);
        light.visible = true;
        //flashLight.castShadow = true;

        this.group.add(light)
        this.group.add(light.target)
    }
}