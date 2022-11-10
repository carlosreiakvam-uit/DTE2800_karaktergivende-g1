export default class Physics {
    constructor() {
        this.tmpTrans = new Ammo.btTransform();

        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache = new Ammo.btDbvtBroadphase(),
            solver = new Ammo.btSequentialImpulseConstraintSolver();

        this.world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this.world.setGravity(new Ammo.btVector3(0, -9.80665, 0));

        this.rigidBodies = []
        this.COL_GROUP_PLANE = 1;
        this.COL_GROUP_BOX = 2;
    }


    updatePhysics(delta) {
        // Step world
        this.world.stepSimulation(delta, 10);

        // Update rigid bodies
        for (let i = 0; i < this.rigidBodies.length; i++) {
            let mesh = this.rigidBodies[i];
            let rigidBody = mesh.userData.physicsBody;
            let motionState = rigidBody.getMotionState();
            if (motionState) {
                console.log(mesh.name)
                motionState.getWorldTransform(this.tmpTrans);
                let p = this.tmpTrans.getOrigin();
                let q = this.tmpTrans.getRotation();
                mesh.position.set(p.x(), p.y(), p.z());
                mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
            console.log(this.world.getDispatcher().getNumManifolds()) // er 0!!!!???!?!?!?!?!?
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

}