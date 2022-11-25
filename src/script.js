import './style.css'
import Application from './Application/Application.js'
import ammo from '../static/lib/ammo/ammo.js'

ammo().then(async function (sandkake) {
    Ammo = sandkake;
    await main();
});

function main() {
    new Application(document.querySelector('canvas.webgl'))
}