import {Game} from './Game.js';

export function getGameScreen(mode, backBtnCallback) {
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

  const score = document.createElement('p');
  score.classList.add('game-screen__score');

  const field = document.createElement('div');
  field.classList.add('game-screen__field');

  const cell = document.createElement('button');
  cell.classList.add('game-screen__cell');

  // Return button
  const backBtn = roundBtn.cloneNode(true);
  const backBtnIcon = roundBtnIcon.cloneNode(true);
  backBtnIcon.src = './assets/svg/return.svg';
  backBtnIcon.alt = 'Return icon';
  backBtn.append(backBtnIcon);
  backBtn.addEventListener('click', () => {
    backBtnCallback();
  })

  header.append(backBtn, title);
  hints.append(addCells);
  main.append(hints, score, field);
  gameScreen.append(header, main);

  // Game logic Controller and View
  const game = new Game(mode);
  game.createField();

  title.textContent = `${game.mode}`;
  score.textContent = `Score: ${game.score}`;
  addCells.textContent = `Add Rows (uses: ${game.addRowsUses})`;

  let selectedCell = null;

  function renderField() {
    selectedCell = null;
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

  field.addEventListener('click', (e) => {
    const cellBtn = e.target;
    if (!e.target.classList.contains('game-screen__cell')) return;

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

    const firstIndices = [Number(selectedCell.dataset.i), Number(selectedCell.dataset.j)];
    const secondIndices = [Number(cellBtn.dataset.i), Number(cellBtn.dataset.j)];

    if (game.isValidCellPair(firstIndices, secondIndices)) {
      const points = game.getPoints(firstIndices, secondIndices);
      if (points !== 0) {
        game.score += points;
        score.textContent = `Score: ${game.score}`;
        game.deleteValueByIndices(firstIndices);
        game.deleteValueByIndices(secondIndices);
        renderField();
        return
      }

      selectedCell.classList.remove('game-screen__cell_selected');
      selectedCell = null;
    }
  });

  addCells.addEventListener('click', () => {
    if (game.addRowsUses > 0) {
      game.appendField();
      game.addRowsUses -= 1;
      addCells.textContent = `Add Rows (uses: ${game.addRowsUses})`;
      renderField();
    }
  })

  return gameScreen;
}