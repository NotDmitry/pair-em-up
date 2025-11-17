import {getStartScreen} from "./js/start-screen.js";
import {getGameScreen} from "./js/game-screen.js";
import {getSettingsModal} from "./js/settings-modal.js";

const app = document.createElement('div');
app.id = 'app';
document.body.append(app);

const settingsModal = getSettingsModal();
document.body.append(settingsModal);

showStartScreen();

function showStartScreen() {
  const startScreen = getStartScreen(
    (mode) => {
      showGameScreen(mode);
    },
    () => {
      settingsModal.showModal();
    }
  );
  app.replaceChildren(startScreen);
}

function showGameScreen(mode) {
  const gameScreen = getGameScreen(
    mode,
    () => {
      showStartScreen();
    },
    (mode) => {
      showGameScreen(mode);
    },
    () => {
      settingsModal.showModal();
    }
  );
  app.replaceChildren(gameScreen);
}