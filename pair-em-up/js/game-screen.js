import {Game} from './Game.js';

export function getGameScreen(mode, backBtnCallback) {
  const gameScreen = document.createElement('div');
  const header = document.createElement('header');
  const roundBtn = document.createElement('button');
  const roundBtnIcon = document.createElement('img');
  const title = document.createElement('h1');
  const main = document.createElement('main');
  const score = document.createElement('p');
  const field = document.createElement('div');
  const cell = document.createElement('button');

  gameScreen.classList.add('game-screen');
  title.classList.add('game-screen__title');
  header.classList.add('game-screen__header');
  roundBtn.classList.add('button', 'button_round');
  roundBtnIcon.classList.add('button__icon');
  main.classList.add('game-screen__main');
  score.classList.add('game-screen__score');
  field.classList.add('game-screen__field');
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

  main.append(score, field);
  header.append(backBtn, title);
  gameScreen.append(header, main);

  // Game logic Controller and View
  const game = new Game(mode);
  title.append(document.createTextNode(`${game.mode}`));
  score.textContent = `Score: ${game.score}`;
  let selectedCell = null;
  game.createField();
  const viewMatrix = getRenderedCells(game.field);


  return gameScreen;

  function getRenderedCells(gameField) {
    const cells = gameField.map((row, i) => {
      return row.map((value, j) => {
        const cellBtn = cell.cloneNode(true);
        cellBtn.dataset.i = String(i);
        cellBtn.dataset.j = String(j);
        if (value !== null) {
          cellBtn.append(document.createTextNode(`${value}`));
        }

        cellBtn.addEventListener('click', () => {
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
            }

            selectedCell.classList.remove('game-screen__cell_selected');
            cellBtn.classList.remove('game-screen__cell_selected');
            selectedCell = null;
          }
        });

        return cellBtn;
      });
    });
    field.replaceChildren(...cells.flat());
    return cells;
  }
}