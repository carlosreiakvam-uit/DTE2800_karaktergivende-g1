import * as THREE from 'three'
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
import {color, sub} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {MeshStandardMaterial} from "three";

export async function addLandingPageMenu(application) {

    // const letterTexture = application.resources.items.blackDirtyTexture
    // const letterColor = new MeshStandardMaterial({color: color.red})
    let url3 = "/fonts/gamefont.json"

    const fontLoader = new FontLoader()

    let mode, hard, medium, header, start, menu
    let headerName = "header"
    let startName = "start"
    let menuName = "menu"
    let modeName = "mode"
    let modeHardName = "hard"
    let modeMediumName = "medium"

    let headerText = "TRAPPED IN SPACE"
    let startText = "START"
    let menuText = "MENU"

    let modeText = "MODE"
    let modeHardText = "HARD"
    let modeMediumText = "MEDIUM"

    const zText = -10
    const titleSize = 10
    const subSize = 7

    let headerPosition = {x: -90, y: 70, z: zText}
    let startPosition = {x: 0, y: 50, z: zText}
    let menuPosition = {x: 0, y: 30, z: zText}

    let modePosition = {x: 0, y: 50, z: zText}
    let modeHardPosition = {x: 0, y: 30, z: zText}
    let modeMediumPosition = {x: 0, y: 10, z: zText}


    fontLoader.load(
        url3,
        (loadedFont) => {
            addMouseEvents();
            header = addTextElement(titleSize, headerText, headerPosition, headerName)
            start = addTextElement(subSize, startText, startPosition, startName)
            menu = addTextElement(subSize, menuText, menuPosition, menuName)

            function addTextElement(size, text, position, name, height = 4) {
                const textGeometry = new TextGeometry(
                    text,
                    {
                        font: loadedFont,
                        size: size,
                        height: height,
                    });

                const textMaterial = new THREE.MeshStandardMaterial({
                    color: 0xff0e33,
                    side: THREE.DoubleSide,
                    wireframe: false
                });
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
                    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

                    raycaster.setFromCamera(mouse, application.camera.instance)
                    let intersects = raycaster.intersectObjects(application.scene.children, true);

                    if (intersects.length > 0) {
                        //Fancy hover effect
                    }
                }

                function onMouseClick(event) {
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

                    raycaster.setFromCamera(mouse, application.camera.instance)
                    let intersects = raycaster.intersectObjects(application.scene.children, true);

                    if (intersects.length > 0) {
                        // start game
                        if (intersects[0].object.name === startName) {
                            application.camera.instance.position.set(-15, 20, 30)
                            application.camera.lookAtHero = true
                            application.scene.remove(header)
                            application.scene.remove(start)
                            application.scene.remove(menu)

                        } else if (intersects[0].object.name === menuName) {
                            // application.scene.remove(header)
                            application.scene.remove(start)
                            application.scene.remove(menu)
                            mode = addTextElement(subSize, modeText, modePosition, modeName)
                            hard = addTextElement(subSize, modeHardText, modeHardPosition, modeHardName)
                            medium = addTextElement(subSize, modeMediumText, modeMediumPosition, modeMediumName)
                        } else if (intersects[0].object.name === modeHardName || intersects[0].object.name === modeMediumName) {
                            application.scene.remove(mode)
                            application.scene.remove(hard)
                            application.scene.remove(medium)
                            // header = addTextElement(titleSize, headerText, headerPosition, headerName)
                            start = addTextElement(subSize, startText, startPosition, startName)
                            menu = addTextElement(subSize, menuText, menuPosition, menuName)
                        }
                    }

                }
            }

        }
    );
}

