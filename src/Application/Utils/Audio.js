import * as THREE from "three";

export default class Audio {

    constructor() {
        this.listener = new THREE.AudioListener()
        this.point = new THREE.Audio(this.listener)
        this.walking = new THREE.Audio(this.listener)
        this.minion = new THREE.Audio(this.listener)
        this.playerHit = new THREE.Audio(this.listener)
        this.fallScream = new THREE.Audio(this.listener)
        this.engulfed = new THREE.Audio(this.listener)
        this.gameSong = new THREE.Audio(this.listener)
        this.endingSong = new THREE.Audio(this.listener)
        this.locateMinion = new THREE.Audio(this.listener)
        this.spawn = new THREE.Audio(this.listener)
        this.hurt = new THREE.Audio(this.listener)
        this.beenHereBefore = new THREE.Audio(this.listener)
        this.audioLoader = new THREE.AudioLoader()
        this.load(this.point, this.fallScream, this.walking, this.minion, this.playerHit, this.engulfed,
            this.locateMinion, this.gameSong, this.endingSong, this.spawn, this.hurt, this.beenHereBefore)
    }

    load(point, fallScream, walking, minion, playerHit, engulfed, voLocateMinion, gameSong, endingSong, spawn, hurt, beenHereBefore) {

        this.audioLoader.load('audio/voiceOver/beenHereBefore.ogg', function (buffer) {
            beenHereBefore.setBuffer(buffer);
            beenHereBefore.setVolume(0.7);
        });

        this.audioLoader.load('audio/hero/hurt.ogg', function (buffer) {
            hurt.setBuffer(buffer);
            hurt.setVolume(0.4);
        });

        this.audioLoader.load('audio/fx/spawn.ogg', function (buffer) {
            spawn.setBuffer(buffer);
            spawn.setVolume(0.6);
        });


        this.audioLoader.load('audio/music/tunetank.com_5800_purple-chair_by_automaticbananas.mp3', function (buffer) {
            endingSong.setBuffer(buffer);
            endingSong.setVolume(0.4);
            endingSong.loop = true
        });


        this.audioLoader.load('audio/music/Myuu-The-Orders-Theme.mp3', function (buffer) {
            gameSong.setBuffer(buffer);
            gameSong.setVolume(0.4);
            gameSong.loop = true
            gameSong.play()
        });

        this.audioLoader.load('audio/voiceOver/engulfed.mp3', function (buffer) {
            engulfed.setBuffer(buffer);
            engulfed.setVolume(0.9);
        });

        this.audioLoader.load('audio/voiceOver/locateMinion.mp3', function (buffer) {
            voLocateMinion.setBuffer(buffer);
            voLocateMinion.setVolume(0.9);
        });


        this.audioLoader.load('audio/hero/point.ogg', function (buffer) {
            point.setBuffer(buffer);
            point.setVolume(0.2);
        });

        this.audioLoader.load('audio/hero/walking.mp4', function (buffer) {
            walking.setBuffer(buffer);
            walking.setVolume(0.2);
        });

        this.audioLoader.load('audio/hero/fallScream.ogg', function (buffer) {
            fallScream.setBuffer(buffer)
            fallScream.setVolume(0.4)
        })

        this.audioLoader.load('audio/hero/minion.mp4', function (buffer) {
            minion.setBuffer(buffer)
            minion.setVolume(0.5)
        })

        this.audioLoader.load('audio/hero/playerHit.mp4', function (buffer) {
            playerHit.setBuffer(buffer)
            playerHit.setVolume(0.5)
        })

    }
}
