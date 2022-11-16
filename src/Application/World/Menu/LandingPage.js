import * as THREE from 'three'
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";

export async function addLandingPageMenu(application) {

    const letterTexture = application.resources.items.blackDirtyTexture
    let url3 = "/fonts/helvetiker_regular.typeface.json"

    const fontLoader = new FontLoader()

    fontLoader.load(
        url3,
        (loadedFont) => {
            const textGeometry = new TextGeometry(
                'Trapped In Space',
                {
                    font: loadedFont,
                    size: 30,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                });

            const textMaterial = new THREE.MeshStandardMaterial({map: letterTexture, side: THREE.DoubleSide, wireframe: false});
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('click', onMouseClick);

            textMesh.position.x = -200;
            textMesh.position.y = 60;
            textMesh.position.z = -100;

            textMesh.name = "landingPageMenu";
            application.scene.add(textMesh);

            function onMouseMove(event) {
                event.preventDefault();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

                raycaster.setFromCamera(mouse, application.camera.instance)
                let intersects = raycaster.intersectObjects(application.scene.children, true);

                for(let i = 0; i < intersects.length; i++) {5
                    console.log("clicked")
                }
            }

            function onMouseClick(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

                raycaster.setFromCamera(mouse, application.camera.instance)
                let intersects = raycaster.intersectObjects(application.scene.children, true);

                if ( intersects.length > 0 ) {
                    if (intersects[0].object) {
                        application.camera.instance.position.set(-15, 20, 30)
                        console.log( application.camera.instance.position.x)
                        application.camera.lookAtHero = true
                    }
                }
            }

        }
    );


}

