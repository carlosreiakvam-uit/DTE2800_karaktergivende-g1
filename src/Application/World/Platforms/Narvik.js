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
        this.createTerrain();
    }

    createTerrain() {
        const terrainWidth = 1024;
        const terrainHeight = 1024;
        const heightData = this.getHeigtdataFromImage(this.application.resources.items.narvik_displacement, terrainWidth, terrainHeight, 9);

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
            map: this.application.resources.items.narvik_satelite,
            side: THREE.DoubleSide,
            wireframe: false
        });
        terrainMaterial.needsUpdate = true;
        let mesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        mesh.name = 'terrain';
        mesh.receiveShadow = true;

        const rigidBody = this.application.physics.createRigidBody(
            heightFieldData.heightFieldShape, mesh, 0.5, 0.3, this.position, 0);

        this.application.physics.world.addRigidBody(rigidBody, Constant.COL_GROUP_PLANE,
            Constant.COL_GROUP_PLAYER | Constant.COL_GROUP_PLANE)

        this.application.scene.add(mesh);
        rigidBody.threeMesh = mesh;

        mesh.userData.physicsBody = rigidBody;
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

    /**
     *
     * @param image
     * @param width
     * @param height
     * @returns {Float32Array}: Et array med en høydeverdi per piksel.
     */
    getHeigtdataFromImage(image, width, height, divisor = 3) {
        // Lager et temporært canvas-objekt:
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        // Henter ut en 2D-context som gjør at man kan tegne på canvaset:
        let context = canvas.getContext('2d');
        let size = width * height;
        // Lager et Float32Array som kan holde på alle pikslene til canvaset:
        let heightData = new Float32Array(size);
        // Tegner image på  canvaset:
        context.drawImage(image, 0, 0);
        // Nullstiller heightData-arrayet:
        for (let i = 0; i < size; i++) {
            heightData[i] = 0;
        }
        //imageData = et ImageData-objekt. Inneholder pikseldata. Hver piksel består av en RGBA-verdi (=4x8 byte).
        let imageData = context.getImageData(0, 0, width, height);
        let pixelDataUint8 = imageData.data;	//pixelDataUint8 = et Uint8ClampedArray - array. 4 byte per piksel. Ligger etter hverandre.
        let j = 0;
        //Gjennomløper pixelDataUint8, piksel for piksel (i += 4). Setter heightData for hver piksel lik summen av fargekomponentene / 3:
        for (let i = 0, n = pixelDataUint8.length; i < n; i += 4) {
            let sumColorValues = pixelDataUint8[i] + pixelDataUint8[i + 1] + pixelDataUint8[i + 2];
            heightData[j++] = sumColorValues / divisor;
        }
        return heightData;
    }
}