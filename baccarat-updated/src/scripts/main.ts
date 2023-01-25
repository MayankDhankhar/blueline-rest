import { App } from './system/app';
import { Game } from './game/game';


document.addEventListener("DOMContentLoaded", () => {
  const application = new App(); 
  const scene = new Game();
  application.stage.addChild(scene);
});







