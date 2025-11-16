import {Game} from './Game.js';

export function getGameScreen(mode, backBtnCallback) {
  const gameScreen = document.createElement('div');
  const header = document.createElement('header');
  const roundBtn = document.createElement('button');
  const roundBtnIcon = document.createElement('img');
  const title = document.createElement('h1');
  const main = document.createElement('main');
  const field = document.createElement('div');
  const cell = document.createElement('button');

  gameScreen.classList.add('game-screen');
  header.classList.add('game-screen__header');
  roundBtn.classList.add('button', 'button_round');
  roundBtnIcon.classList.add('button__icon');
  main.classList.add('game-screen__main');
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

  // Game logic Controller and View
  const game = new Game(mode);
  game.createField();

  // Field cells
  const viewMatrix = game.field.map((row) => {
    return row.map((value) => {
      const newCell = cell.cloneNode(true);
      if (value !== null) {
        newCell.append(document.createTextNode(`${value}`));
      }
      return newCell;
    });
  });
  const cells = viewMatrix.flat();

  // Title
  title.classList.add('game-screen__title');
  title.append(document.createTextNode(`${game.mode}`));

  field.append(...cells);
  main.append(field);
  header.append(backBtn, title);
  gameScreen.append(header, main);
  return gameScreen;
}