import EventEmitter from './EventEmitter.js'

export default class KeyPress extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.currentlyPressedKeys = [];

        // Key pressed
        document.addEventListener('keydown', (event) =>
        {
            this.currentlyPressedKeys[event.code] = true;
            this.trigger('keydown')
        }, false)


        // Key released
        document.addEventListener('keyup', (event) =>
        {
            this.currentlyPressedKeys[event.code] = false;
            this.trigger('keyup')
        }, false)

    }
}