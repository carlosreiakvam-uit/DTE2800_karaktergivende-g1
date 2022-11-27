import * as THREE from 'three'
import Application from "../../Application.js";
import * as Constant from "../../Utils/Constants.js";

export default class Minion {
    constructor(position, scale, color = 0x00FF00, mass = 0.0, name = "Minion") {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.position = position
        this.scale = scale
        this.name = name
        this.lastYPos = this.position.y + 1
        this.lastXPos = this.position.x + 1
        this.lastZPos = this.position.z + 1
        this.color = color
        this.group = new THREE.Group()
        this.firstTimeActivated = true
        this.isActivated = false;
        this.addSpotLight()
        this.setGeometry()
        this.setTextures()
        this.setMesh(position, scale, name)
        this.setPhysics(position)
        this.application.scene.add(this.group)
    }

    setTextures() {
        let textures = {}
        textures.map = this.application.resources.items.spacePlatformTexture
        textures.map.encoding = THREE.sRGBEncoding
        textures.map.repeat.set(1.5, 1.5)
        textures.map.wrapS = THREE.RepeatWrapping
        textures.map.wrapT = THREE.RepeatWrapping

        this.material = new THREE.MeshStandardMaterial({
            map: textures.map,
        });
        this.material.roughness = 0.0;
        this.material.shininess = 1;
    }

    addSpotLight() {
        this.spotLight = new THREE.PointLight(0xFFFFFF, 0, 8);
        this.spotLight.castShadow = true
        this.spotLight.visible = true;
        this.spotLight.position.set(this.position.x, this.position.y , this.position.z);
        this.group.add(this.spotLight)
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(0.1, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
        this.group.add(this.mesh)
        this.mesh.collisionResponse = (_) => {
            if(!this.isActivated) {
                if (!this.application.audio.minion.isPlaying) {
                    this.application.audio.minion.play();
                }
            }
            this.isActivated = true
        };
    }

    setPhysics(position) {
        let shape = new Ammo.btSphereShape(0.1);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);
        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, Constant.COL_GROUP_BONUS_POINTS, Constant.COL_GROUP_PLANE | Constant.COL_GROUP_PLAYER);
        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        if(this.isActivated) {
            if(this.firstTimeActivated) {
                this.firstTimeActivated = false
                this.spotLight.intensity = 5;
                $('#info6').fadeIn(2200).delay(8000).fadeOut(2200);
                this.application.physics.applyCentralImpulse(this.rigidBody, 1,{x: 0, y: 1, z: 0});
                let hero = this.application.world.player.t
                if (hero !== undefined) {
                    this.createSpringConstraint();
                }
            }
            this.moveSpotlight()


        } else {
            this.doFloatingAnimationStart()
        }
    }

    moveSpotlight() {
        this.lastXPos = this.rigidBody.threeMesh.position.x
        this.lastZPos = this.rigidBody.threeMesh.position.z
        this.spotLight.position.set(this.lastXPos, this.lastYPos, this.lastZPos);
    }

    doFloatingAnimationStart() {
        if((this.lastYPos > this.rigidBody.threeMesh.position.y) && this.rigidBody.threeMesh.position.y < 1) {
            this.application.physics.applyCentralImpulse(this.rigidBody, 0.1,{x: 0, y: 1, z: 0});
        }
        this.lastYPos = this.rigidBody.threeMesh.position.y

    }

    createSpringConstraint() {
        const transform1 = new Ammo.btTransform();
        transform1.setIdentity();
        transform1.setOrigin( new Ammo.btVector3( 0, 1, 0 ) );
        const transform2 = new Ammo.btTransform();
        transform2.setIdentity();
        transform2.setOrigin( new Ammo.btVector3( 0, 0, 0 ) );

        const springConstraint = new Ammo.btGeneric6DofSpringConstraint(
            this.application.world.player.controller.getGhostObject(),
            this.rigidBody,
            transform1,
            transform2,
            true
        );

        springConstraint.setLinearLowerLimit(new Ammo.btVector3(0.0, 2.0, 0.0));
        springConstraint.setLinearUpperLimit(new Ammo.btVector3(3.0, 2.5, 3.0));

        springConstraint.setAngularLowerLimit(new Ammo.btVector3(0.0, 0.0, 0.0));
        springConstraint.setAngularUpperLimit(new Ammo.btVector3(0.0, 0.0, 0.0));

        springConstraint.enableSpring(0,  true);   // Translasjon på x-aksen
        springConstraint.enableSpring(1,  false);    // Translasjon på y-aksen
        springConstraint.enableSpring(2,  true);   // Translasjon på z-aksen
        springConstraint.enableSpring(3,  false);   //rotation X
        springConstraint.enableSpring(4,  false);   //rotation Y
        springConstraint.enableSpring(5,  false);   //rotation Z

        springConstraint.setStiffness(0, 3);
        springConstraint.setStiffness(1, 20);
        springConstraint.setStiffness(2, 3);

        springConstraint.setDamping(0,  0.9);
        springConstraint.setDamping(1,  0.9);
        springConstraint.setDamping(2,  0.9);

        this.application.physics.world.addConstraint(springConstraint, false);
    }
}