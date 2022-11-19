import * as THREE from 'three'
import Application from "../Application.js";


export function addArrowToWorldPositiveZ(mesh, origin) {

    let direction = mesh.getWorldDirection(new THREE.Vector3())
    const meshDirectionArrow = new THREE.ArrowHelper(direction, origin, 1, 0xff0000);
    // meshDirectionArrow.name = name;
    mesh.add(meshDirectionArrow);


}