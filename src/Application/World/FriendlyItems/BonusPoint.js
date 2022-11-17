import * as THREE from 'three'
import Application from "../../Application.js";
import TWEEN from "@tweenjs/tween.js";

export default class BonusPoint {
    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.isActivated = false
        this.position = position
        this.scale = scale
        this.name = name
        this.notFloatedAway = true
        this.setMaterial(color)
        this.setGeometry()
        this.setMesh(position, scale, name)
        this.setPhysics(position)
    }

    setMaterial(color) {
        this.material = new THREE.MeshStandardMaterial({color: color})
    }

    setGeometry() {
        this.geometry =new THREE.SphereGeometry(0.3, 32, 32);
    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;
        this.application.scene.add(this.mesh)
    }

    setPhysics(position, activationState) {
        let shape = new Ammo.btSphereShape(0.3);
        this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.8, position, this.mass);

        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);

        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
    }

    update() {
        this.doFloatingAnimation()

        let hero = this.application.world.player.t

        if(hero !== undefined) {
            this.doPhysics(hero);
        }
    }

    doPhysics(hero) {
        if(!this.isActivated && this.notFloatedAway) {
            this.isActivated = this.checkIfHeroAndThisEntityAreClose(hero);
            if(this.application.world.player.health < 90) {

            }

        } else {
            this.makeThisFloatAway();
        }

    }

    checkIfHeroAndThisEntityAreClose(hero) {
        let heroPosX = hero.getOrigin().x();
        let xDifference = heroPosX - this.mesh.position.x;
        let heroPosZ = hero.getOrigin().z();
        let zDifference = heroPosZ - this.mesh.position.z;

        return (this.checkDifferenceWhenNegativeAndPositiveInput(xDifference, -1, 1) && this.checkDifferenceWhenNegativeAndPositiveInput(zDifference, -1, 1));
    }

    checkDifferenceWhenNegativeAndPositiveInput(difference, biggerThen, lessThen) {
        return (difference >= biggerThen && difference < 0) || (difference <= lessThen && difference > 0);
    }


    doFloatingAnimation() {
        if(this.rigidBody.threeMesh.position.y < 1) {
            this.application.physics.applyImpulse(this.rigidBody, {x:0, y:0.02, z:0});
        }
    }

    makeThisFloatAway() {
        this.notFloatedAway = false
        this.application.physics.applyImpulse(this.rigidBody, {x:0, y:0.1, z:0});

        //Burde remove from scene når den er langt nok unna
    }
}