import * as PIXI from 'pixi.js';

export class App {
    private _app: PIXI.Application;

    constructor() {
        const app: any = new PIXI.Application({
            autoStart : true,
            autoDensity : true,
            antialias : false,
            resolution : window.devicePixelRatio,
            backgroundColor : 0x008000, //default 0x000000
            resizeTo : window
        });
        document.body.appendChild(app.view);

        this._app = app;
    }

    get app(): PIXI.Application {
        return this._app;
    }

    get stage(): PIXI.Container<PIXI.DisplayObject> {
        return this._app.stage;
    }
}