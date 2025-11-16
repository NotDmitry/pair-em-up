import {getStartScreen} from "./js/start-screen.js";
import {getGameScreen} from "./js/game-screen.js";

const app = document.createElement('div');
app.id = 'app';
document.body.append(app);

showStartScreen();

function showStartScreen() {
  const startScreen = getStartScreen((mode) => {
    showGameScreen(mode);
  });
  app.replaceChildren(startScreen);
}

function showGameScreen(mode) {
  const gameScreen = getGameScreen(mode, () => {
    showStartScreen();
  });
  app.replaceChildren(gameScreen);
}