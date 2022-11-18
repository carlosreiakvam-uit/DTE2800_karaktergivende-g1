import * as THREE from "three";

export default class Audio {

    constructor() {
        this.listener = new THREE.AudioListener()
        this.point = new THREE.Audio(this.listener)
        this.fallScream = new THREE.Audio(this.listener)
        this.load(this.point, this.fallScream) // fikk ikke til å kalle på this.point fra metoden lol
    }

    load(point, fallScream) {
        const audioLoader = new THREE.AudioLoader()

        audioLoader.load('audio/hero/point.ogg', function (buffer) {
            point.setBuffer(buffer);
            point.setVolume(0.5);
        });

        audioLoader.load('/audio/hero/fallScream.ogg', function (buffer) {
            fallScream.setBuffer(buffer)
            fallScream.setVolume(0.9)
            //fallScream.play()
        })

    }
}
