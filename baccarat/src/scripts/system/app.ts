import * as PIXI from 'pixi.js';
import { Game } from '../game/game';

export class App {
    constructor() {
        const app: any = new PIXI.Application({
            autoStart : true,
            autoDensity : true,
            antialias : false,
            resolution : window.devicePixelRatio,
            backgroundColor : 0x000000, 
            backgroundAlpha: 0,
            resizeTo : window
        });
        document.body.appendChild(app.view);

        new Game();
    }
}