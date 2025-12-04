export function getResultModal() {
  const modal = document.createElement('dialog');
  modal.classList.add('modal');

  const inner = document.createElement('div');
  inner.classList.add('modal__inner');

  const title = document.createElement('h3');
  title.classList.add('modal__title');
  title.textContent = 'Results';

  const message = document.createElement('p');
  const score = document.createElement('p');
  const moves = document.createElement('p');
  const time = document.createElement('p');

  inner.append(title, message, score, moves, time);
  modal.append(inner);

  modal.addEventListener('click', (e) => {
    if (e.target.contains(modal)) modal.close();
  })

  return {
    modal,
    open: () => modal.showModal(),
    close: () => modal.close(),
    setMessages: (titleText, messageText, scoreText, movesText, timeText) => {
      title.textContent = `You ${titleText}!`;
      message.textContent = messageText;
      score.textContent = `Total Score: ${scoreText}`;
      moves.textContent = `Total Moves: ${movesText}`;
      time.textContent = `Time: ${timeText}`;
    }
  }
}