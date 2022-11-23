import Application from "../../Application.js";
import * as THREE from "three";
import * as Constant from "../../Utils/constants.js";


export class RotatingWall {
    constructor({
                    position = {x: 0, y: 0, z: 0},
                    scale = {x: 1, y: 1, z: 1},
                    texture = undefined,
                    textureNormal = undefined,
                    textureDisplacement = undefined,
                    name = undefined
                } = {}) {
        this.application = new Application()

        this.setMaterial(texture, textureNormal, textureDisplacement);

        this.anchor = this.createAnchor(position, name);
        this.wall = this.createWall(position, scale, name);
        this.createHinge(this.anchor, this.wall);
    }

    createHinge(rigidBodyAnchor, rigidBodyWall) {
        const wallHeight = rigidBodyWall.threeMesh.geometry.parameters.height;
        const wallDepth = rigidBodyWall.threeMesh.geometry.parameters.depth;
        const anchorPivot = new Ammo.btVector3(0, wallHeight / 2, 0);
        const anchorAxis = new Ammo.btVector3(0, 1, 0);
        const armPivot = new Ammo.btVector3(-2.5, 0, 0);
        const armAxis = new Ammo.btVector3(0, 1, 0);


        const hingeConstraint = new Ammo.btHingeConstraint(
            rigidBodyAnchor,
            rigidBodyWall,
            anchorPivot,
            armPivot,
            anchorAxis,
            armAxis,
            false
        );

        const lowerLimit = -Math.PI;
        const upperLimit = Math.PI;
        const softness = 10;
        const biasFactor = 0.3;
        const relaxationFactor = 0;
        hingeConstraint.setLimit(lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
        hingeConstraint.enableAngularMotor(true, 0, 0);
        this.application.physics.world.addConstraint(hingeConstraint, false);
    }

    createWall(position, scale, name) {
        const mass = 10;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(scale.x, scale.y, scale.z), this.material)
        mesh.name = name
        // mesh.scale.set(scale.x, scale.y, scale.z)
        mesh.position.set(position.x, position.y, position.z)
        mesh.castShadow = true
        mesh.receiveShadow = true;

        mesh.collisionResponse = (mesh1) => {
            let hero = this.application.world.player.controller
            if (hero !== undefined) {
                let direction = new THREE.Vector3();
                console.log(this.application.time.delta)
                mesh1.getWorldDirection(direction);
                hero.setVelocityForTimeInterval(
                    new Ammo.btVector3(direction.x * 2, 0, direction.z * 2),
                    this.application.time.delta
                )
            }
        };

        const direction = new THREE.Vector3();
        mesh.getWorldDirection(direction);  // NB! worldDIRECTION! Gir en vektor som peker mot +Z. FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.
        // addArrowHelper(mesh, direction.normalize(), new THREE.Vector3( 0, 0, 0 ), 'worlddirection_arrow', 0xff0000, 5);


        const shape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x / 2, scale.y / 2, scale.z / 2));
        // shape.setMargin(0.05);
        const rigidBody = this.application.physics.createRigidBody(shape, mesh, 0.3, 0.0, position, mass);
        //rigidBody.setDamping(0.1, 0.5);
        rigidBody.setActivationState(4);
        mesh.userData.physicsBody = rigidBody;

        this.application.physics.world.addRigidBody(
            rigidBody,
            Constant.COL_GROUP_BOX,
            Constant.COL_GROUP_PLAYER | Constant.COL_GROUP_BOX | Constant.COL_GROUP_PLANE
        )

        this.application.scene.add(mesh);
        this.application.physics.rigidBodies.push(mesh);
        rigidBody.threeMesh = mesh;

        return rigidBody;
    }

    createAnchor(position, name) {
        const radius = 0.1;
        const mass = 0;

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            new THREE.MeshStandardMaterial({color: 0xb846db, transparent: true, opacity: 0.5}));

        mesh.name = `${name}_anchor`;
        mesh.position.set(position.x, position.y, position.z);

        const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
        shape.setMargin(0.05);
        const rigidBody = this.application.physics.createRigidBody(shape, mesh, 0.4, 0.6, position, mass);
        mesh.userData.physicsBody = rigidBody;
        this.application.physics.world.addRigidBody(
            rigidBody,
            Constant.COL_GROUP_HINGE_SPHERE,
            Constant.COL_GROUP_PLAYER | Constant.COL_GROUP_BOX | Constant.COL_GROUP_PLANE | Constant.COL_GROUP_HINGE_SPHERE);
        this.application.physics.rigidBodies.push(mesh);
        rigidBody.threeMesh = mesh;

        this.application.scene.add(mesh)

        return rigidBody;
    }

    setMaterial(texture, textureNormal, textureDisplacement) {
        let textures = {}
        if (texture !== undefined) {
            textures.map = application.resources.items[texture]
            textures.map.encoding = THREE.sRGBEncoding
            textures.map.repeat.set(1.5, 1.5)
            textures.map.wrapS = THREE.RepeatWrapping
            textures.map.wrapT = THREE.RepeatWrapping
        }

        if (textureNormal !== undefined) {
            textures.normalMap = application.resources.items[textureNormal]
            textures.normalMap.repeat.set(1.5, 1.5)
            textures.normalMap.wrapS = THREE.RepeatWrapping
            textures.normalMap.wrapT = THREE.RepeatWrapping
        }

        if (textureDisplacement !== undefined) {
            texture.displacementMap = application.resources.items[textureDisplacement];
        }

        this.material = new THREE.MeshStandardMaterial(textures);
    }

    rotateWall() {
        if (!this.wall) {
            return;
        }
        let direction = new THREE.Vector3();
        this.wall.threeMesh.getWorldDirection(direction);

        this.wall.activate(true);

        const relativeVector = new Ammo.btVector3(5, 0, 0);
        const impulseVector = new Ammo.btVector3(direction.x * 0.01, 0, direction.z * 0.01);
        this.wall.applyImpulse(impulseVector, relativeVector);
    }

    update() {
        this.rotateWall();
    }
}