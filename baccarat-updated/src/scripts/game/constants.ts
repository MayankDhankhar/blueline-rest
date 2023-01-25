import { TextStyle } from "pixi.js";
 
export class Constants {

     // Text Styles
     public static readonly RICH_TEXT_STYLE: TextStyle = new TextStyle({
          fontFamily: 'Arial',
          fontSize: 80,
          fontStyle: 'italic',
          fontWeight: 'bold',
          fill: ['#ffffff', '#00ff99'], // gradient
          stroke: '#4a1850',
          strokeThickness: 5,
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 4,
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 6,
          lineJoin: 'round',
      });

      public static readonly SKEW_TEXT_STYLE: TextStyle = new TextStyle({
          fontFamily: 'Arial',
          dropShadow: true,
          dropShadowAlpha: 0.8,
          dropShadowAngle: 2.1,
          dropShadowBlur: 4,
          dropShadowColor: '0x111111',
          dropShadowDistance: 10,
          fill: ['#00ff99'],
          stroke: '#004620',
          fontSize: 60,
          fontWeight: 'lighter',
          lineJoin: 'round',
          strokeThickness: 12,
      });

      public static readonly SPADE: string = `♠️`;
      public static readonly HEART: string = `♥️`;
      public static readonly CLUB: string = `♣️`;
      public static readonly DIAMOND: string = `♦️`;

 }