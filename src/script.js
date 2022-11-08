import './style.css'
import Application from './Application/Application.js'

Ammo().then(async function (AmmoLib) {
    Ammo = AmmoLib;
    await main();
});

function main() {
    const application = new Application(document.querySelector('canvas.webgl'))
}