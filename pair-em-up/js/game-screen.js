import {Game} from './Game.js';
import {Utils} from './Utils.js';

export function getGameScreen(mode, returnCallback, restartCallback, settingsModal, resultModal, isLoaded) {
  const gameScreen = document.createElement('div');
  gameScreen.classList.add('game-screen');

  const header = document.createElement('header');
  header.classList.add('game-screen__header');

  const roundBtn = document.createElement('button');
  roundBtn.classList.add('button', 'button_round');

  const roundBtnIcon = document.createElement('img');
  roundBtnIcon.classList.add('button__icon');

  const title = document.createElement('h1');
  title.classList.add('game-screen__title');

  const main = document.createElement('main');
  main.classList.add('game-screen__main');

  const hints = document.createElement('div');
  hints.classList.add('game-screen__hints');

  const loadSaveBtn = document.createElement('button');
  loadSaveBtn.classList.add('button', 'button_hint');
  loadSaveBtn.textContent = 'Continue';

  const addCells = document.createElement('button');
  addCells.classList.add('button', 'button_hint');

  const shuffleCells = document.createElement('button');
  shuffleCells.classList.add('button', 'button_hint');

  const eraseCell = document.createElement('button');
  eraseCell.classList.add('button', 'button_hint');

  const revert = document.createElement('button');
  revert.classList.add('button', 'button_hint');

  const hintMoves = document.createElement('p');
  hintMoves.classList.add('game-screen__hint');

  const score = document.createElement('p');
  score.classList.add('game-screen__score');

  const moves = document.createElement('p');
  moves.classList.add('game-screen__score');

  const timer = document.createElement('p');
  timer.classList.add('game-screen__score');
  timer.textContent = 'Time: 00:00';

  const field = document.createElement('div');
  field.classList.add('game-screen__field');

  // Return button
  const backBtn = roundBtn.cloneNode(true);
  const backBtnIcon = roundBtnIcon.cloneNode(true);
  backBtnIcon.src = './assets/svg/return.svg';
  backBtnIcon.alt = 'Return icon';
  backBtn.append(backBtnIcon);
  backBtn.addEventListener('click', () => {
    saveGame();
    returnCallback();
  })

  // Save button
  const saveBtn = roundBtn.cloneNode(true);
  const saveBtnIcon = roundBtnIcon.cloneNode(true);
  saveBtnIcon.src = './assets/svg/save.svg';
  saveBtnIcon.alt = 'Save icon';
  saveBtn.append(saveBtnIcon);

  // Restart button
  const restartBtn = roundBtn.cloneNode(true);
  const restartBtnIcon = roundBtnIcon.cloneNode(true);
  restartBtnIcon.src = './assets/svg/restart.svg';
  restartBtnIcon.alt = 'Restart icon';
  restartBtn.append(restartBtnIcon);
  restartBtn.addEventListener('click', () => {
    restartCallback(mode);
  });

  // Results button
  const resultsBtn = roundBtn.cloneNode(true);
  const resultsBtnIcon = roundBtnIcon.cloneNode(true);
  resultsBtnIcon.src = './assets/svg/award.svg';
  resultsBtnIcon.alt = 'Show results icon';
  resultsBtn.append(resultsBtnIcon);
  resultsBtn.addEventListener('click', () => {
    resultModal.open();
  });

  // Settings button
  const settingsBtn = roundBtn.cloneNode(true);
  const settingsBtnIcon = roundBtnIcon.cloneNode(true);
  settingsBtnIcon.src = './assets/svg/settings.svg';
  settingsBtnIcon.alt = 'Settings icon';
  settingsBtn.append(settingsBtnIcon);
  settingsBtn.addEventListener('click', () => {
    settingsModal.open();
  })

  header.append(backBtn, saveBtn, loadSaveBtn, title, settingsBtn, restartBtn);
  hints.append(addCells, shuffleCells, eraseCell, revert, hintMoves);
  main.append(hints, timer, score, moves, field);
  gameScreen.append(header, main);

  // Game logic Controller and View
  if (!localStorage.getItem('savedGame')) {
    loadSaveBtn.disabled = true;
  }

  const game = new Game(mode);
  let selectedCell = null;
  let lock = false;
  let timerID = null;
  let timerSeconds = 0;
  revert.disabled = true;

  if (isLoaded) {
    loadGame();
  } else {
    game.createField();
    renderCaptions();
    renderField();
  }

  timerID = setInterval(() => {
    timerSeconds += 1;
    timer.textContent = `Time: ${Utils.getFormattedTime(timerSeconds)}`;
  }, 1000);

  field.addEventListener('click', async (e) => {
    const cellBtn = e.target;
    if (!e.target.classList.contains('game-screen__cell')) return;

    if (lock) return;

    if (selectedCell === null) {
      selectedCell = cellBtn;
      cellBtn.classList.add('game-screen__cell_selected');
      return;
    }

    if (selectedCell === cellBtn) {
      selectedCell = null;
      cellBtn.classList.remove('game-screen__cell_selected');
      return;
    }

    lock = true;

    const firstIndices = [Number(selectedCell.dataset.i), Number(selectedCell.dataset.j)];
    const secondIndices = [Number(cellBtn.dataset.i), Number(cellBtn.dataset.j)];

    if (game.isValidCellPair(firstIndices, secondIndices)) {
      const points = game.getPoints(firstIndices, secondIndices);
      if (points !== 0) {
        game.createBackup();
        revert.disabled = false;
        game.moves += 1;
        game.score += points;
        game.deleteValueByIndices(firstIndices);
        game.deleteValueByIndices(secondIndices);
        renderCaptions();
        renderField();
        checkWinCondition();
        return;
      }

      selectedCell.classList.add('game-screen__cell_invalid');
      cellBtn.classList.add('game-screen__cell_invalid');
      selectedCell.disabled = true;
      cellBtn.disabled = true;
      await Utils.sleep(300);
      selectedCell.disabled = false;
      cellBtn.disabled = false;
      selectedCell.classList.remove('game-screen__cell_invalid');
      cellBtn.classList.remove('game-screen__cell_invalid');

      selectedCell.classList.remove('game-screen__cell_selected');
      selectedCell = null;
    }

    lock = false;
  });

  addCells.addEventListener('click', () => {
    if (game.addRowsUses > 0) {
      game.createBackup();
      revert.disabled = false;
      game.appendField();
      game.addRowsUses -= 1;
      game.moves += 1;
      renderCaptions();
      renderField();
      checkWinCondition();
    }
  });

  shuffleCells.addEventListener('click', () => {
    if (game.shuffleUses > 0) {
      game.createBackup();
      revert.disabled = false;
      game.shuffleField();
      game.shuffleUses -= 1;
      game.moves += 1;
      renderCaptions();
      renderField();
      checkWinCondition();
    }
  })

  eraseCell.addEventListener('click', () => {
    if (game.eraserUses > 0 && selectedCell !== null) {
      game.createBackup();
      revert.disabled = false;
      const [i, j] = [Number(selectedCell.dataset.i), Number(selectedCell.dataset.j)];
      game.deleteValueByIndices([i, j]);
      game.eraserUses -= 1;
      game.moves += 1;
      renderCaptions();
      renderField();
      checkWinCondition();
    }
  })

  revert.addEventListener('click', () => {
    game.restoreBackup();
    revert.disabled = true;
    renderCaptions();
    renderField();
  })

  saveBtn.addEventListener('click', () => {
    saveGame();
    loadSaveBtn.disabled = false;
  })

  loadSaveBtn.addEventListener('click', () => {
    loadGame();
  })

  window.addEventListener('beforeunload', () => {
    saveGame();
  })

  return gameScreen;

  function renderCaptions() {
    title.textContent = `${game.mode}`;
    score.textContent = `Score: ${game.score} / Target: 100`;
    moves.textContent = `Moves: ${game.moves}`;
    addCells.textContent = `Add Rows (uses: ${game.addRowsUses})`;
    shuffleCells.textContent = `Shuffle (uses: ${game.shuffleUses})`;
    eraseCell.textContent = `Erase cell (uses: ${game.eraserUses})`;
    revert.textContent = `Revert last move`;
    const moveCount = game.getValidMovesCount();
    hintMoves.textContent = `Available moves: ${moveCount > 5 ? '5+' : moveCount}`;
  }

  function renderField() {
    selectedCell = null;
    lock = false;

    const cell = document.createElement('button');
    cell.classList.add('game-screen__cell');
    const fieldButtons = game.field.map((row, i) => {
      return row.map((value, j) => {
        const fieldBtn = cell.cloneNode(true);
        fieldBtn.dataset.i = String(i);
        fieldBtn.dataset.j = String(j);

        if (value !== null) {
          fieldBtn.textContent = `${value}`;
        } else {
          fieldBtn.disabled = true;
        }

        return fieldBtn;
      });
    });

    field.replaceChildren(...fieldButtons.flat());
  }

  function checkWinCondition() {
    const result = game.getGameEndResult();
    if (result) {
      clearInterval(timerID);
      saveBtn.disabled = true;
      loadSaveBtn.disabled = true;
      field.style.display = 'none';
      addCells.disabled = true;
      shuffleCells.disabled = true;
      eraseCell.disabled = true;
      revert.disabled = true;
      hintMoves.style.display = 'none';

      header.append(resultsBtn);
      resultModal.setMessages(
        result,
        'Nice attempt!',
        game.score,
        game.moves,
        Utils.getFormattedTime(timerSeconds)
      );
      resultModal.open();

      let records = localStorage.getItem('records');
      const newRecord = {
        result,
        mode: game.mode,
        score: game.score,
        moves: game.moves,
        time: timerSeconds,
      }
      if (records) {
        records = JSON.parse(records);
        if (records.length === 5) {
          records = records.slice(1);
        }
        records.push(newRecord);
      } else {
        records = [];
        records.push(newRecord);
      }
      localStorage.setItem('records', JSON.stringify(records));
    }
  }

  function saveGame() {
    const result = game.getGameEndResult();
    if (result) return;

    const saveData = {
      field: game.field,
      score: game.score,
      mode: game.mode,
      moves: game.moves,
      backup: revert.disabled ? {} : game.backup,
      addRowsUses: game.addRowsUses,
      shuffleUses: game.shuffleUses,
      eraserUses: game.eraserUses,
      timerSeconds
    }
    localStorage.setItem('savedGame', JSON.stringify(saveData));
  }

  function loadGame() {
    let savedGame = localStorage.getItem('savedGame');

    if (savedGame) {
      savedGame = JSON.parse(savedGame);
      game.field = savedGame.field;
      game.score = savedGame.score;
      game.mode = savedGame.mode;
      game.moves = savedGame.moves;
      game.backup = savedGame.backup;
      game.addRowsUses = savedGame.addRowsUses;
      game.shuffleUses = savedGame.shuffleUses;
      game.eraserUses = savedGame.eraserUses;

      timerSeconds = savedGame.timerSeconds;
      timer.textContent = `Time: ${Utils.getFormattedTime(timerSeconds)}`;

      revert.disabled = !Boolean(game.backup.field);
      renderCaptions();
      renderField();
    }
  }
}