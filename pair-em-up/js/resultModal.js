export function getResultModal() {
  const modal = document.createElement('dialog');
  modal.classList.add('modal');

  const inner = document.createElement('div');
  inner.classList.add('modal__inner');

  const title = document.createElement('h3');
  title.classList.add('modal__title');
  title.textContent = 'Results';

  inner.append(title);
  modal.append(inner);

  modal.addEventListener('click', (e) => {
    if (e.target.contains(modal)) modal.close();
  })

  return {
    modal,
    open: () => modal.showModal(),
    close: () => modal.close(),
  }
}