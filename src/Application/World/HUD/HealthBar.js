import * as THREE from 'three'
import Application from "../../Application.js";

export default class HealthBar {

    constructor(position, scale, color, mass, name) {
        this.application = new Application()
        this.physics = this.application.physics
        this.mass = mass
        this.position = position
        this.scale = scale
        this.name = name
        this.lasthealh = undefined
        this.createHealthBar()
    }

    createHealthBar() {
        const spriteMap1 = this.application.resources.items.healthbar100
        let spriteMaterial1 = new THREE.SpriteMaterial( { map: spriteMap1, color: 0xffffff } );
        this.sprite1 = new THREE.Sprite( spriteMaterial1 );
        this.sprite1.position.set( 0, 3, 0);
        this.sprite1.scale.set(0.75,0.25,0.25);
    }

    update() {
        let hero = this.application.world.player.t

        if(hero !== undefined) {
            this.setHealthBarPosition(hero);

            if(this.healthChanged()) {
                if(this.application.world.player.health >= 75 && this.application.world.player.health <= 100) {
                    this.application.scene.remove( this.sprite1 );
                    const spriteMap1 = this.application.resources.items.healthbar100
                    this.updateView(spriteMap1)
                } else if(this.application.world.player.health >= 50 && this.application.world.player.health <= 75) {
                    this.application.scene.remove( this.sprite1 );
                    const spriteMap1 = this.application.resources.items.healthbar75
                    this.updateView(spriteMap1)
                } else if(this.application.world.player.health >= 25 && this.application.world.player.health <= 49) {
                    this.application.scene.remove( this.sprite1 );
                    const spriteMap1 = this.application.resources.items.healthbar50
                    this.updateView(spriteMap1)
                } else if(this.application.world.player.health <= 24) {
                    this.application.scene.remove( this.sprite1 );
                    const spriteMap1 = this.application.resources.items.healthbar25
                    this.updateView(spriteMap1)
                }
            }
        }

        this.updateHealthHasChanged()
    }

    updateView(spriteMap1) {
        let spriteMaterial1 = new THREE.SpriteMaterial( { map: spriteMap1, color: 0xffffff } );
        this.sprite1 = new THREE.Sprite( spriteMaterial1 );
        let x = this.application.world.player.t.getOrigin().x()
        let y = this.application.world.player.t.getOrigin().y()
        let z = this.application.world.player.t.getOrigin().z()
        this.sprite1.position.set( x, y+1.5, z);
        this.sprite1.scale.set(0.75,0.25,0.25);
        this.application.scene.add( this.sprite1 );
    }

    setHealthBarPosition(hero) {
        let x = hero.getOrigin().x()
        let y = hero.getOrigin().y()
        let z = hero.getOrigin().z()
        this.sprite1.position.set( x, y+1.5, z);
    }

    healthChanged() {
        return this.application.world.player.health !== this.lasthealh;
    }

    updateHealthHasChanged() {
        this.lasthealh = this.application.world.player.health
    }
}