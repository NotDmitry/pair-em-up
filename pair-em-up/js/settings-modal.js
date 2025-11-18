export function getSettingsModal() {
  const modal = document.createElement('dialog');
  modal.classList.add('modal');

  const inner = document.createElement('div');
  inner.classList.add('modal__inner');

  const title = document.createElement('h3');
  title.classList.add('modal__title');
  title.textContent = 'Settings';

  // Sound button
  const volumeBtn = document.createElement('button');
  volumeBtn.classList.add('button', 'button_round');
  const volumeBtnIcon = document.createElement('img');
  volumeBtnIcon.classList.add('button__icon');
  volumeBtn.append(volumeBtnIcon);

  inner.append(title, volumeBtn);
  modal.append(inner);
  let isMuted = false;

  modal.addEventListener('click', (e) => {
    if (e.target.contains(modal)) modal.close();
  });

  volumeBtn.addEventListener('click', () => {
    isMuted ? unmute() : mute();
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
  });

  function mute() {
    volumeBtnIcon.src = './assets/svg/volume-mute.svg';
    volumeBtnIcon.alt = 'Volume mute icon';
    volumeBtn.title = 'Unmute';
    isMuted = true;
  }

  function unmute() {
    volumeBtnIcon.src = './assets/svg/volume.svg';
    volumeBtnIcon.alt = 'Volume icon';
    volumeBtn.title = 'Mute';
    isMuted = false;
  }

  return {
    modal,
    open: () => {
      isMuted = JSON.parse(localStorage.getItem('isMuted'));
      isMuted ? mute() : unmute();
      modal.showModal();
    },
    close: () => {
      modal.close();
    },
  }
}