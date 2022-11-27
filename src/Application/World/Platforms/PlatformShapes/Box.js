import * as THREE from 'three'
import Application from "../../../Application.js";
import Globs from "../../../Utils/Globs";
import * as Constant from "../../../Utils/Constants";


export default class Box {
    constructor({
                    position = {x: 0, y: 0, z: 0},
                    scale = {x: 1, y: 1, z: 1},
                    name,
                    mass = 0,
                    material,
                    rotation = undefined,
                }) {

        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.geometry = new Globs().boxGeometry
        this.material = material
        this.rotation = rotation

        this.setMesh(position, scale, name)
        this.setPhysics(position, scale)

    }

    setMesh(position, scale, name) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = name
        this.mesh.scale.set(scale.x, scale.y, scale.z)
        // this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.castShadow = true
        if(this.rotation !== undefined) {
            this.mesh.rotateZ(this.rotation.z)
            this.mesh.rotateY(this.rotation.y)
            this.mesh.rotateX(this.rotation.x)
        }
        this.mesh.receiveShadow = true;
    }


    setPhysics(position) {
        let width = this.mesh.geometry.parameters.width
        let height = this.mesh.geometry.parameters.height
        let depth = this.mesh.geometry.parameters.depth

        this.ammoShape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
        this.rigidBody = this.physics.createRigidBody(this.ammoShape, this.mesh, 0.7, 0.8, position, this.mass);
        this.mesh.userData.physicsBody = this.rigidBody;
        this.physics.rigidBodies.push(this.mesh);
        this.rigidBody.threeMesh = this.mesh;
        this.physics.world.addRigidBody(this.rigidBody, Constant.COL_GROUP_PLANE,
            Constant.COL_GROUP_PLAYER | Constant.COL_GROUP_PLANE | Constant.COL_GROUP_BONUS_POINTS | Constant.COL_GROUP_ENEMY)
    }

}