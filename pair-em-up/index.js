const settingsButton = document.querySelector(".button_round:last-of-type");
const modal = document.querySelector(".modal");

settingsButton.addEventListener("click", () => {
  modal.showModal();
})

modal.addEventListener("click", (e) => {
  if (e.target.contains(modal)) modal.close();
})