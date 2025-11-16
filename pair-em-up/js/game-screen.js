export function getGameScreen(mode, backBtnCallback) {
  const gameScreen = document.createElement('div');
  const header = document.createElement('header');
  const backBtn = document.createElement('button');
  const title = document.createElement('h1');
  const main = document.createElement('main');
  const field = document.createElement('div');
  const cell = document.createElement('button');

  backBtn.addEventListener('click', () => {
    backBtnCallback();
  })

  title.append(document.createTextNode(mode));


  header.append(backBtn, title);
  gameScreen.append(header, main);
  return gameScreen;
}