import {getStartScreen} from "./js/start-screen.js";
import {getGameScreen} from "./js/game-screen.js";
import {getSettingsModal} from "./js/settings-modal.js";
import {getResultModal} from "./js/resultModal.js";
import {getRecordsModal} from "./js/recordsModal.js";

const app = document.createElement('div');
app.id = 'app';
document.body.append(app);

const settingsModal = getSettingsModal();
document.body.append(settingsModal.modal);

const resultModal = getResultModal();
document.body.append(resultModal.modal);

const recordsModal = getRecordsModal();
document.body.append(recordsModal.modal);

showStartScreen();

function showStartScreen() {
  const startScreen = getStartScreen(
    (mode) => {
      showGameScreen(mode);
    },
    settingsModal,
    () => {
      const savedGame = JSON.parse(localStorage.getItem('savedGame'));
      if (!savedGame) return;
      showGameScreen(savedGame.mode, true);
    },
    recordsModal
  );
  app.replaceChildren(startScreen);
}

function showGameScreen(mode, isLoaded = false) {
  const gameScreen = getGameScreen(
    mode,
    () => {
      showStartScreen();
    },
    (mode) => {
      showGameScreen(mode);
    },
    settingsModal,
    resultModal,
    isLoaded
  );
  app.replaceChildren(gameScreen);
}