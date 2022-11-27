// import * as THREE from 'three'
// import Application from "../../../Application.js";
// import * as Constant from "../../../Utils/Constants";
//
//
// export default class Sphere {
//     constructor({
//                     position = {x: 0, y: 0, z: 0},
//                     scale = {x: 1, y: 1, z: 1},
//                     name,
//                     mass = 0,
//                     material,
//                     radius = 1,
//                 }) {
//
//         this.application = new Application()
//         this.physics = this.application.physics
//         this.mass = mass
//         this.radius = radius
//         this.geometry = new Globs.cylinderGeometry
//         this.material = material
//
//         this.setMesh(position, scale, name)
//         this.setPhysics(position, scale)
//
//     }
//
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
//
//     setPhysics(position) {
//         this.ammoShape = new Ammo.btSphereShape(new Ammo.btVector3(this.radius, this.radius / 2, this.radius));
//         this.rigidBody = this.physics.createRigidBody(this.ammoShape, this.mesh, 0.7, 0.8, position, this.mass);
//         this.mesh.userData.physicsBody = this.rigidBody;
//         this.physics.rigidBodies.push(this.mesh);
//         this.rigidBody.threeMesh = this.mesh;
//         this.physics.world.addRigidBody(this.rigidBody, Constant.COL_GROUP_PLANE,
//             Constant.COL_GROUP_PLAYER)
//     }
//
// }