import * as THREE from 'three'
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";

export async function addLandingPageMenu(application) {

    const letterTexture = application.resources.items.blackDirtyTexture
    let url3 = "/fonts/helvetiker_regular.typeface.json"

    const fontLoader = new FontLoader()

    let mode, hard, medium, header, start, menu
    let headerName = "header"
    let startName = "start"
    let menuName = "menu"
    let modeName = "mode"
    let modeHardName = "hard"
    let modeMediumName = "medium"

    let headerText = "Trapped In Space"
    let startText = "Start"
    let menuText = "Menu"
    let modeText = "Mode"
    let modeHardText = "Hard"
    let modeMediumText = "Medium"


    fontLoader.load(
        url3,
        (loadedFont) => {
            addMouseEvents();
            header = addTextElement(30, headerText,{x:-200, y:60, z:-100}, headerName)
            start = addTextElement(20, startText,{x:-60, y:20, z:-100}, startName)
            menu = addTextElement(20, menuText,{x:-65, y:-20, z:-100}, menuName)

            function addTextElement(size, text, position, name, height = 10) {
                const textGeometry = new TextGeometry(
                    text,
                    {
                        font: loadedFont,
                        size: size,
                        height: height,
                    });

                const textMaterial = new THREE.MeshStandardMaterial({map: letterTexture, side: THREE.DoubleSide, wireframe: false});
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.x = position.x;
                textMesh.position.y = position.y;
                textMesh.position.z = position.z;

                textMesh.name = name;
                application.scene.add(textMesh);

                return textMesh
            }


            function addMouseEvents() {
                let raycaster = new THREE.Raycaster();
                let mouse = new THREE.Vector2();
                window.addEventListener('mousemove', onMouseMove, false);
                window.addEventListener('click', onMouseClick, false);

                function onMouseMove(event) {
                    event.preventDefault();
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

                    raycaster.setFromCamera(mouse, application.camera.instance)
                    let intersects = raycaster.intersectObjects(application.scene.children, true);

                    if ( intersects.length > 0) {
                        //Fancy hover effect
                    }
                }

                function onMouseClick(event) {
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

                    raycaster.setFromCamera(mouse, application.camera.instance)
                    let intersects = raycaster.intersectObjects(application.scene.children, true);

                    if ( intersects.length > 0 ) {
                        if (intersects[0].object.name === startName) {
                            application.camera.instance.position.set(-15, 20, 30)
                            application.camera.lookAtHero = true
                            application.scene.remove(header)
                            application.scene.remove(start)
                            application.scene.remove(menu)

                        } else if(intersects[0].object.name === menuName) {
                            application.scene.remove(header)
                            application.scene.remove(start)
                            application.scene.remove(menu)
                            mode = addTextElement(30, modeText,{x:-200, y:60, z:-100}, modeName)
                            hard = addTextElement(20, modeHardText,{x:-200, y:20, z:-100}, modeHardName)
                            medium = addTextElement(20, modeMediumText,{x:-200, y:-20, z:-100}, modeMediumName)
                        } else if(intersects[0].object.name === modeHardName|| intersects[0].object.name === modeMediumName) {
                            application.scene.remove(mode)
                            application.scene.remove(hard)
                            application.scene.remove(medium)
                            header = addTextElement(30, headerText,{x:-200, y:60, z:-100}, headerName)
                            start = addTextElement(20, startText,{x:-60, y:20, z:-100}, startName)
                            menu = addTextElement(20, menuText,{x:-65, y:-20, z:-100}, menuName)
                        }
                    }

                }
            }

        }
    );
}

