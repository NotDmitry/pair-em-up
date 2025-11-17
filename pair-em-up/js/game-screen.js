import {Game} from './Game.js';
import {Utils} from './Utils.js';

export function getGameScreen(mode, returnCallback, restartCallback, settingsModal, resultModal) {
  const gameScreen = document.createElement('div');
  gameScreen.classList.add('game-screen');

  const header = document.createElement('header');
  header.classList.add('game-screen__header');

  const roundBtn = document.createElement('button');
  roundBtn.classList.add('button', 'button_round');

  const roundBtnIcon = document.createElement('img');
  roundBtnIcon.classList.add('button__icon');

  const title = document.createElement('h1');
  title.classList.add('game-screen__title');

  const main = document.createElement('main');
  main.classList.add('game-screen__main');

  const hints = document.createElement('div');
  hints.classList.add('game-screen__hints');

  const addCells = document.createElement('button');
  addCells.classList.add('button', 'button_hint');

  const shuffleCells = document.createElement('button');
  shuffleCells.classList.add('button', 'button_hint');

  const eraseCell = document.createElement('button');
  eraseCell.classList.add('button', 'button_hint');

  const score = document.createElement('p');
  score.classList.add('game-screen__score');

  const field = document.createElement('div');
  field.classList.add('game-screen__field');

  // Return button
  const backBtn = roundBtn.cloneNode(true);
  const backBtnIcon = roundBtnIcon.cloneNode(true);
  backBtnIcon.src = './assets/svg/return.svg';
  backBtnIcon.alt = 'Return icon';
  backBtn.append(backBtnIcon);
  backBtn.addEventListener('click', () => {
    returnCallback();
  })

  // Restart button
  const restartBtn = roundBtn.cloneNode(true);
  const restartBtnIcon = roundBtnIcon.cloneNode(true);
  restartBtnIcon.src = './assets/svg/restart.svg';
  restartBtnIcon.alt = 'Restart icon';
  restartBtn.append(restartBtnIcon);

  // Settings button
  const settingsBtn = roundBtn.cloneNode(true);
  const settingsBtnIcon = roundBtnIcon.cloneNode(true);
  settingsBtnIcon.src = './assets/svg/settings.svg';
  settingsBtnIcon.alt = 'Settings icon';
  settingsBtn.append(settingsBtnIcon);
  settingsBtn.addEventListener('click', () => {
    settingsModal.open();
  })

  header.append(backBtn, title, settingsBtn, restartBtn);
  hints.append(addCells, shuffleCells, eraseCell);
  main.append(hints, score, field);
  gameScreen.append(header, main);

  // Game logic Controller and View
  const game = new Game(mode);
  game.createField();

  title.textContent = `${game.mode}`;
  score.textContent = `Score: ${game.score} / Target: 100`;
  addCells.textContent = `Add Rows (uses: ${game.addRowsUses})`;
  shuffleCells.textContent = `Shuffle (uses: ${game.shuffleUses})`;
  eraseCell.textContent = `Erase cell (uses: ${game.eraserUses})`;

  let selectedCell = null;
  let lock = false;

  function renderField() {
    selectedCell = null;
    lock = false;

    const cell = document.createElement('button');
    cell.classList.add('game-screen__cell', 'game-screen__cell_active');
    const fieldButtons = game.field.map((row, i) => {
      return row.map((value, j) => {
        const fieldBtn = cell.cloneNode(true);
        fieldBtn.dataset.i = String(i);
        fieldBtn.dataset.j = String(j);

        if (value !== null) {
          fieldBtn.textContent = `${value}`;
        } else {
          fieldBtn.disabled = true;
        }

        return fieldBtn;
      });
    });

    field.replaceChildren(...fieldButtons.flat());
  }

  renderField();

  field.addEventListener('click', async (e) => {
    const cellBtn = e.target;
    if (!e.target.classList.contains('game-screen__cell_active')) return;

    if (lock) return;

    if (selectedCell === null) {
      selectedCell = cellBtn;
      cellBtn.classList.add('game-screen__cell_selected');
      return;
    }

    if (selectedCell === cellBtn) {
      selectedCell = null;
      cellBtn.classList.remove('game-screen__cell_selected');
      return;
    }

    lock = true;

    const firstIndices = [Number(selectedCell.dataset.i), Number(selectedCell.dataset.j)];
    const secondIndices = [Number(cellBtn.dataset.i), Number(cellBtn.dataset.j)];

    if (game.isValidCellPair(firstIndices, secondIndices)) {
      const points = game.getPoints(firstIndices, secondIndices);
      if (points !== 0) {
        game.score += points;
        score.textContent = `Score: ${game.score} / Target: 100`;
        game.deleteValueByIndices(firstIndices);
        game.deleteValueByIndices(secondIndices);
        renderField();
        return;
      }

      selectedCell.classList.add('game-screen__cell_invalid');
      cellBtn.classList.add('game-screen__cell_invalid');
      selectedCell.disabled = true;
      cellBtn.disabled = true;
      await Utils.sleep(1000);
      selectedCell.disabled = false;
      cellBtn.disabled = false;
      selectedCell.classList.remove('game-screen__cell_invalid');
      cellBtn.classList.remove('game-screen__cell_invalid');

      selectedCell.classList.remove('game-screen__cell_selected');
      selectedCell = null;
    }

    lock = false;
  });

  addCells.addEventListener('click', () => {
    if (game.addRowsUses > 0) {
      game.appendField();
      game.addRowsUses -= 1;
      addCells.textContent = `Add Rows (uses: ${game.addRowsUses})`;
      renderField();
    }
  });

  shuffleCells.addEventListener('click', () => {
    if (game.shuffleUses > 0) {
      game.shuffleField();
      game.shuffleUses -= 1;
      shuffleCells.textContent = `Shuffle (uses: ${game.shuffleUses})`;
      renderField();
    }
  })

  eraseCell.addEventListener('click', () => {
    if (game.eraserUses > 0 && selectedCell !== null) {
      const [i, j] = [Number(selectedCell.dataset.i), Number(selectedCell.dataset.j)];
      game.deleteValueByIndices([i, j]);
      game.eraserUses -= 1;
      eraseCell.textContent = `Erase cell (uses: ${game.eraserUses})`;
      renderField();
    }
  })

  restartBtn.addEventListener('click', () => {
    restartCallback(mode);
  });

  return gameScreen;
}