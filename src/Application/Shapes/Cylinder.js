// import * as THREE from 'three'
// import Application from "../Application.js";
// import Animations from "../Animations.js";
// import CusomMaterial from "../Utils/CustomMaterial";
//
// export default class Cylinder {
//     constructor({
//                     position,
//                     scale = {x: 1, y: 1, z: 1},
//                     radius = 1,
//                     mass = 1,
//                     material,
//                     name
//                 }) {
//         this.application = new Application()
//         this.physics = this.application.physics
//         this.mass = mass
//
//         this.radius = radius
//
//         material === undefined ? this.material = new CusomMaterial().material : this.material = material
//         this.setGeometry()
//         this.setMesh(position, scale, name)
//         this.setPhysics(position)
//     }
//
//
//     setGeometry() {
//         this.geometry = new THREE.CylinderGeometry(1, 1, 1, 32, 32)
//     }
//
//     setMesh(position, scale, name) {
//         this.mesh = new THREE.Mesh(this.geometry, this.material)
//         this.mesh.name = name
//         this.mesh.scale.set(scale.x, scale.y, scale.z)
//         this.mesh.position.set(position.x, position.y, position.z)
//         this.mesh.castShadow = true
//         this.mesh.receiveShadow = true;
//     }
//
//     setPhysics(position) {
//         let shape = new Ammo.btCylinderShape(new Ammo.btVector3(this.radius, this.radius / 2, this.radius));
//         this.rigidBody = this.physics.createRigidBody(shape, this.mesh, 0.7, 0.0, position, this.mass);
//
//         this.mesh.userData.physicsBody = this.rigidBody;
//         this.physics.world.addRigidBody(this.rigidBody, this.physics.COL_GROUP_BOX, this.physics.COL_GROUP_BOX | this.physics.COL_GROUP_PLANE);
//
//         this.physics.rigidBodies.push(this.mesh);
//         this.rigidBody.threeMesh = this.mesh;
//     }
//
//     update() {
//     }
//
// }