import * as THREE from "three";

export default class Audio {

    constructor() {
        this.listener = new THREE.AudioListener()
        this.point = new THREE.Audio(this.listener)
        this.walking = new THREE.Audio(this.listener)
        this.minion = new THREE.Audio(this.listener)
        this.playerHit = new THREE.Audio(this.listener)
        this.fallScream = new THREE.Audio(this.listener)
        this.load(this.point, this.fallScream, this.walking, this.minion, this.playerHit) // fikk ikke til å kalle på this.point fra metoden lol
    }

    load(point, fallScream, walking, minion, playerHit) {
        const audioLoader = new THREE.AudioLoader()

        audioLoader.load('audio/hero/point.ogg', function (buffer) {
            point.setBuffer(buffer);
            point.setVolume(0.4);
        });

        audioLoader.load('audio/hero/walking.mp4', function (buffer) {
            walking.setBuffer(buffer);
            walking.setVolume(0.2);
        });

        audioLoader.load('audio/hero/fallScream.ogg', function (buffer) {
            fallScream.setBuffer(buffer)
            fallScream.setVolume(0.9)
            //fallScream.play()
        })

        audioLoader.load('audio/hero/minion.mp4', function (buffer) {
            minion.setBuffer(buffer)
            minion.setVolume(0.5)
        })

        audioLoader.load('audio/hero/playerHit.mp4', function (buffer) {
            playerHit.setBuffer(buffer)
            playerHit.setVolume(0.5)
        })

    }
}
