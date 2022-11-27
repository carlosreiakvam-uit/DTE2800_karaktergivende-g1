import * as THREE from 'three'
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";

export async function addLandingPageMenu(application) {

    // const letterTexture = application.resources.items.blackDirtyTexture
    // const letterColor = new MeshStandardMaterial({color: color.red})
    let url3 = "fonts/gamefont.json"

    const fontLoader = new FontLoader()

    let mode, hard, medium, header, start, menu
    let headerName = "header"
    let startName = "start"
    let menuName = "menu"
    let modeName = "mode"
    let modeHardName = "hard"
    let modeMediumName = "medium"

    let headerText = "TRAPPED IN A DREAM"
    let startText = "START"
    let menuText = "MENU"

    let modeText = "MODE"
    let modeHardText = "HARD"
    let modeMediumText = "MEDIUM"

    const zText = -10
    const titleSize = 15
    const subSize = 7

    let headerPosition = {x: -150, y: 70, z: zText}
    let startPosition = {x: 0, y: 40, z: zText}
    let menuPosition = {x: 0, y: 20, z: zText}

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
            addMenuLight()

            application.audio.gameSong.play()

            function addTextElement(size, text, position, name, height = 4) {
                const textGeometry = new TextGeometry(
                    text,
                    {
                        font: loadedFont,
                        size: size,
                        height: height,
                    });

                const textMaterial = new THREE.MeshStandardMaterial({
                    color: 0x666666,
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

            function addMenuLight() {
                let menuLIght = new THREE.AmbientLight('#ffffff', 0.5)
                menuLIght.position.set(0, 0, 10)
                menuLIght.name = 'menuLight'
                application.scene.add(menuLIght);
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
                            let menuLight = this.application.scene.getObjectByName('menuLight')
                            application.scene.remove(menuLight)
                            application.world.addWorldToScene()
                            application.camera.instance.position.set(20, 20, 30)
                            application.camera.lookAtHero = true
                            application.world.player.active = true
                            application.world.player.activationTime = application.time.clock.getElapsedTime();
                            application.scene.remove(header)
                            application.scene.remove(start)
                            application.scene.remove(menu)
                            window.removeEventListener('click', onMouseClick, false)
                            // $('#info').delay(2000).fadeIn(2200).delay(4000).fadeOut(2200);
                            $('#info2').fadeIn(2200).delay(4000).fadeOut(2200);
                            application.audio.engulfed.play()

                            $('#info3').delay(5000).fadeIn(2200).delay(4000).fadeOut(2200);
                            application.audio.locateMinion.play(1000)
                            // $('#info4').delay(14000).fadeIn(2200).delay(4000).fadeOut(2200);
                            // $('#info5').delay(7000).fadeIn(2200).delay(2000).fadeOut(2200);

                        } else if (intersects[0].object.name === menuName) {
                            // application.scene.remove(header)
                            application.scene.remove(start)
                            application.scene.remove(menu)
                            mode = addTextElement(subSize, modeText, modePosition, modeName)
                            hard = addTextElement(subSize, modeHardText, modeHardPosition, modeHardName)
                            medium = addTextElement(subSize, modeMediumText, modeMediumPosition, modeMediumName)
                        } else if (intersects[0].object.name === modeHardName) {
                            application.world.player.healthRegen = 0
                            application.animations.theSunIsShining = false
                            application.animations.ambientVisible = false
                            application.scene.remove(mode)
                            application.scene.remove(hard)
                            application.scene.remove(medium)
                            // header = addTextElement(titleSize, headerText, headerPosition, headerName)
                            start = addTextElement(subSize, startText, startPosition, startName)
                            menu = addTextElement(subSize, menuText, menuPosition, menuName)
                        } else if (intersects[0].object.name === modeMediumName) {
                            application.world.player.healthRegen = 0.02
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

