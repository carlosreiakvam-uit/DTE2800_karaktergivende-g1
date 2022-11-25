import * as THREE from "three";

export default class Audio {

    constructor() {
        this.listener = new THREE.AudioListener()
        this.point = new THREE.Audio(this.listener)
        this.walking = new THREE.Audio(this.listener)
        this.running = new THREE.Audio(this.listener)
        this.fallScream = new THREE.Audio(this.listener)
        this.load(this.point, this.fallScream, this.walking, this.running) // fikk ikke til å kalle på this.point fra metoden lol
    }

    load(point, fallScream, walking, running) {
        const audioLoader = new THREE.AudioLoader()

        audioLoader.load('audio/hero/point.ogg', function (buffer) {
            point.setBuffer(buffer);
            point.setVolume(0.4);
        });

        audioLoader.load('audio/hero/walking.mp4', function (buffer) {
            walking.setBuffer(buffer);
            walking.setVolume(0.2);
        });

        audioLoader.load('audio/hero/running.mp4', function (buffer) {
            running.setBuffer(buffer);
            running.setVolume(0.4);
        });

        audioLoader.load('audio/hero/fallScream.ogg', function (buffer) {
            fallScream.setBuffer(buffer)
            fallScream.setVolume(0.9)
            //fallScream.play()
        })

    }
}
