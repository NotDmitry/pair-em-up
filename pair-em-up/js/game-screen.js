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

  title.classList.add('game-screen__title');
  title.append(document.createTextNode(mode));

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
  gameScreen.append(header, main);
  return gameScreen;
}