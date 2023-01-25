import * as  PIXI from 'pixi.js';

export class Utils {
    public static getClone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    public static pos(x: number, y: number): PIXI.Point {
        return new PIXI.Point(x, y);
    }

    public static createLine(from: PIXI.Point, to: PIXI.Point, width: number, fillColor: number | undefined): PIXI.Graphics {
        const graphics: PIXI.Graphics = new PIXI.Graphics();
        graphics.beginFill();
        graphics.lineStyle(width, fillColor, 1);
        graphics.moveTo(from.x, from.y);
        graphics.lineTo(to.x, to.y);
        graphics.endFill();
        return graphics;
    }

    public static createRect(pos: PIXI.Point, width: number, height: number, fillColor: number): PIXI.Graphics {
        const graphics: PIXI.Graphics = new PIXI.Graphics();
        graphics.beginFill(fillColor);
        graphics.drawRoundedRect(pos.x, pos.y, width, height, 5);
        graphics.endFill();
        return graphics;
    }

    public static getRandomIndexFromArray(length: number): number {
        return Math.floor(Math.random() * length);
    }

    public static randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}