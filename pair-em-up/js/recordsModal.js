export function getRecordsModal() {
  const modal = document.createElement('dialog');
  modal.classList.add('modal');

  const inner = document.createElement('div');
  inner.classList.add('modal__inner');

  const row = document.createElement('div');
  inner.classList.add('modal__row');

  const title = document.createElement('h3');
  title.classList.add('modal__title');
  title.textContent = 'Records';

  const result = document.createElement('p');
  result.textContent = 'Win / Lose';

  const mode = document.createElement('p');
  mode.textContent = 'Mode';

  const score = document.createElement('p');
  score.textContent = 'Score';

  const moves = document.createElement('p');
  moves.textContent = 'Moves';

  const time = document.createElement('p');
  time.textContent = 'Time';

  row.append(result, mode, score, moves, time);
  modal.append(inner);

  modal.addEventListener('click', (e) => {
    if (e.target.contains(modal)) modal.close();
  })

  return {
    modal,
    open: () => {
      if (localStorage.getItem('records')) {
        const records = JSON.parse(localStorage.getItem('records'));
        const rows = records.map((record) => {
          const recordRow = row.cloneNode(false);

          const resultCopy = result.cloneNode(false);
          result.textContent = record.result;

          const modeCopy = mode.cloneNode(false);
          mode.textContent = record.mode;

          const scoreCopy = score.cloneNode(false);
          score.textContent = record.score;

          const movesCopy = moves.cloneNode(false);
          moves.textContent = record.moves;

          const timeCopy = time.cloneNode(false);
          time.textContent = record.time;

          recordRow.append(resultCopy, modeCopy, scoreCopy, movesCopy, timeCopy);
          return recordRow;
        });
        inner.replaceChildren(row, ...rows);
      } else {
        inner.replaceChildren(row);
      }
      modal.showModal();
    },
    close: () => modal.close(),
  }
}