import * as THREE from 'three'
import Application from "../../Application.js";

export default class Healthbar {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.isActivated = false
        this.position = position
        this.scale = scale
        this.name = name

        this.aggroRange = [-5, 5]
        this.killRange = [-1.3,1.3]
        this.xDifference = undefined
        this.zDifference = undefined
        //
        // this.setMaterial(color)
        // this.setGeometry()
        // this.setMesh(position, scale, name)
        // this.setPhysics(position)
        //this.application.scene.add(this.mesh)
        this.createHealthBar()

    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    setGeometry() {
        this.geometry =new THREE.SphereGeometry(1, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
        this.mesh.collisionResponse = (mesh1) => {
            mesh1.material.color.setHex(Math.random() * 0xffffff);
        };
    }

    setPhysics(position, activationState) {
        let shape = new Ammo.btSphereShape(1);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);
        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);
        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    createHealthBar() {
        const spriteMap1 = this.application.resources.items.healthbar100
        let spriteMaterial1 = new THREE.SpriteMaterial( { map: spriteMap1, color: 0xffffff } );
        this.sprite1 = new THREE.Sprite( spriteMaterial1 );
        this.sprite1.position.set( 0, 3, 0);
        this.sprite1.scale.set(0.75,0.25,0.25);
        this.application.scene.add( this.sprite1 );
        console.log("healthbar created")
    }

    update() {
        let hero = this.application.world.player.t

        if(hero !== undefined) {
             this.setHealthBarPosition(hero);

            if(this.application.world.player.health >= 75 && this.application.world.player.health <= 100) {
                this.application.scene.remove( this.sprite1 );
                const spriteMap1 = this.application.resources.items.healthbar100
                this.updateView(spriteMap1)
            } else if(this.application.world.player.health >= 50 && this.application.world.player.health <= 75) {
                console.log("health 75")
                this.application.scene.remove( this.sprite1 );
                const spriteMap1 = this.application.resources.items.healthbar75
                this.updateView(spriteMap1)
            } else if(this.application.world.player.health >= 25 && this.application.world.player.health <= 49) {
                this.application.scene.remove( this.sprite1 );
                const spriteMap1 = this.application.resources.items.healthbar50
                this.updateView(spriteMap1)
            } else if(this.application.world.player.health <= 24) {
                this.application.scene.remove( this.sprite1 );
                const spriteMap1 = this.application.resources.items.healthbar25
                this.updateView(spriteMap1)
            }
        }


    }

    updateView(spriteMap1) {
        let spriteMaterial1 = new THREE.SpriteMaterial( { map: spriteMap1, color: 0xffffff } );
        this.sprite1 = new THREE.Sprite( spriteMaterial1 );
        let x = this.application.world.player.t.getOrigin().x()
        let y = this.application.world.player.t.getOrigin().y()
        let z = this.application.world.player.t.getOrigin().z()
        this.sprite1.position.set( x, y+1.5, z);
        this.sprite1.scale.set(0.75,0.25,0.25);
        this.application.scene.add( this.sprite1 );
    }

    setHealthBarPosition(hero) {
        let x = hero.getOrigin().x()
        let y = hero.getOrigin().y()
        let z = hero.getOrigin().z()
        this.sprite1.position.set( x, y+1.5, z);


    }
}