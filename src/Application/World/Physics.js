import Application from "../Application";
import * as THREE from 'three'

export default class Physics {
    constructor() {
        this.tmpTrans = new Ammo.btTransform();

        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache = new Ammo.btDbvtBroadphase(),
            solver = new Ammo.btSequentialImpulseConstraintSolver();

        this.world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this.world.setGravity(new Ammo.btVector3(0, -9.80665, 0));
        this.world.getBroadphase().getOverlappingPairCache().setInternalGhostPairCallback(new Ammo.btGhostPairCallback())
        this.rigidBodies = []
    }

    updatePhysics(delta) {
        this.world.stepSimulation(delta, 10);

        for (let i = 0; i < this.rigidBodies.length; i++) {
            let mesh = this.rigidBodies[i];
            if (mesh.userData === undefined) {
                console.log("test")
            }
            let rigidBody = mesh.userData.physicsBody;
            let motionState = rigidBody.getMotionState();
            if (motionState) {
                motionState.getWorldTransform(this.tmpTrans);
                let p = this.tmpTrans.getOrigin();
                let q = this.tmpTrans.getRotation();
                mesh.position.set(p.x(), p.y(), p.z());
                mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }

    createRigidBody(shape, threeMesh, restitution = 0.7, friction = 0.8, position, mass = 1) {

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

        let quaternion = threeMesh.quaternion;
        transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

        let scale = threeMesh.scale;
        shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

        let motionState = new Ammo.btDefaultMotionState(transform);
        let localInertia = new Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        let rigidBody = new Ammo.btRigidBody(rbInfo);
        rigidBody.setRestitution(restitution);
        rigidBody.setFriction(friction);

        return rigidBody;
    }

    applyCentralForce(rigidBody, direction = {x: 0, y: 1, z: 0}) {
        if (!rigidBody)
            return;
        rigidBody.activate(true);
        let forceVector = new Ammo.btVector3(direction.x, direction.y, direction.z);
        rigidBody.activate(true);
        rigidBody.applyCentralForce(forceVector);
    }

    moveRigidBody(movableMesh, direction) {
        let transform = new Ammo.btTransform();
        let motionState = movableMesh.userData.physicsBody.getMotionState();
        motionState.getWorldTransform(transform);
        let position = transform.getOrigin();
        transform.setOrigin(new Ammo.btVector3(position.x() + direction.x, position.y() + direction.y, position.z() + direction.z));
        motionState.setWorldTransform(transform);
    }

    applyCentralImpulse(rigidBody, force = 1, direction = {x: 0, y: 0, z: 0}) {
        if (!rigidBody)
            return;
        rigidBody.activate(true);
        let impulseVector = new Ammo.btVector3(direction.x * force, direction.y * force, direction.z * force);
        rigidBody.applyCentralImpulse(impulseVector);
    }

    applyImpulse(rigidBody, direction = {x: 0, y: 1, z: 0}) {
        if (!rigidBody)
            return;
        rigidBody.activate(true);
        let relativeVector = new Ammo.btVector3(0, 1, 0);
        let impulseVector = new Ammo.btVector3(direction.x, direction.y, direction.z);
        rigidBody.activate(true);
        rigidBody.applyImpulse(impulseVector, relativeVector);
    }
}