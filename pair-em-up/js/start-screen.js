export function getStartScreen(btnCallback, settingsModal, continueCallback, recordsModal) {
  const startScreen = document.createElement("div");
  const title = document.createElement("h1");
  const modes = document.createElement("div");
  const continueBtn = document.createElement("button");
  const modeBtn = document.createElement("button");
  const controls = document.createElement("div");
  const roundBtn = document.createElement("button");
  const roundBtnIcon = document.createElement("img");
  const link = document.createElement("a");
  const linkIcon = document.createElement("img");

  startScreen.classList.add('start-screen');
  controls.classList.add('start-screen__controls');
  roundBtn.classList.add('button', 'button_round');
  roundBtnIcon.classList.add('button__icon');

  title.classList.add('start-screen__title');
  title.append(document.createTextNode('Pair \'em UP'));

  // Create button section
  modes.classList.add('start-screen__modes');

  continueBtn.classList.add('start-screen__button');
  continueBtn.append(document.createTextNode('Continue'));
  if (!localStorage.getItem('savedGame')) {
    continueBtn.classList.add('start-screen__button_disabled');
    continueBtn.disabled = true;
  }
  continueBtn.addEventListener("click", () => {
    continueCallback();
  });

  modeBtn.classList.add('start-screen__button');
  const modeButtons = ['Classic', 'Random', 'Chaotic'].map((mode) => {
    const btnCopy = modeBtn.cloneNode(true);
    btnCopy.append(document.createTextNode(mode));
    btnCopy.addEventListener('click', () => {
      btnCallback(mode);
    })
    return btnCopy;
  })
  modes.append(continueBtn, ...modeButtons);

  // Settings button
  const settingsBtn = roundBtn.cloneNode(true);
  const settingsBtnIcon = roundBtnIcon.cloneNode(true);
  settingsBtnIcon.src = './assets/svg/settings.svg';
  settingsBtnIcon.alt = 'Settings icon';
  settingsBtn.append(settingsBtnIcon);
  settingsBtn.addEventListener('click', () => {
    settingsModal.open();
  })

  // Records button
  const recordBtn = roundBtn.cloneNode(true);
  const recordBtnIcon = roundBtnIcon.cloneNode(true);
  recordBtnIcon.src = './assets/svg/trophy.svg';
  recordBtnIcon.alt = 'Trophy icon';
  recordBtn.append(recordBtnIcon);
  recordBtn.addEventListener('click', () => {
    recordsModal.open();
  })

  // GitHub link
  link.classList.add('social-link');
  link.href = 'https://github.com/NotDmitry';
  link.target = '_blank';
  linkIcon.classList.add('social-link__icon');
  linkIcon.src = './assets/svg/github.svg';
  linkIcon.alt = 'GitHub icon';
  link.append(linkIcon);
  link.append(document.createTextNode('NotDmitry'));

  controls.append(recordBtn, link, settingsBtn);
  startScreen.append(title, modes, controls);

  return startScreen;
}