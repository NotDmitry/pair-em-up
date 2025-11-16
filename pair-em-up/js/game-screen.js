export function getGameScreen(mode, backBtnCallback) {
  const gameScreen = document.createElement('div');
  const header = document.createElement('header');
  const roundBtn = document.createElement('button');
  const roundBtnIcon = document.createElement('img');
  const title = document.createElement('h1');
  const main = document.createElement('main');
  const field = document.createElement('div');
  const cell = document.createElement('button');

  roundBtn.classList.add('button', 'button_round');
  roundBtnIcon.classList.add('button__icon');

  // Return button
  const backBtn = roundBtn.cloneNode(true);
  const backBtnIcon = roundBtnIcon.cloneNode(true);
  backBtnIcon.src = './assets/svg/return.svg';
  backBtnIcon.alt = 'Return icon';
  backBtn.append(backBtnIcon);
  backBtn.addEventListener('click', () => {
    backBtnCallback();
  })

  title.append(document.createTextNode(mode));

  header.append(backBtn, title);
  gameScreen.append(header, main);
  return gameScreen;
}