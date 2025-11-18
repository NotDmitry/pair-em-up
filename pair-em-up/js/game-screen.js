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

  const hintsButtons = document.createElement('div');
  hintsButtons.classList.add('game-screen__hints-buttons');

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

  const stats = document.createElement('div');
  stats.classList.add('game-screen__stats');

  const score = document.createElement('p');
  score.classList.add('game-screen__label');

  const moves = document.createElement('p');
  moves.classList.add('game-screen__label');

  const timer = document.createElement('p');
  timer.classList.add('game-screen__label');
  timer.textContent = 'Time: 00:00';

  const field = document.createElement('div');
  field.classList.add('game-screen__field');

  // Return button
  const backBtn = roundBtn.cloneNode(true);
  const backBtnIcon = roundBtnIcon.cloneNode(true);
  backBtnIcon.src = './assets/svg/return.svg';
  backBtnIcon.alt = 'Return icon';
  backBtn.title = 'Return to main menu';
  backBtn.append(backBtnIcon);
  backBtn.addEventListener('click', () => {
    saveGame();
    clearInterval(timerID);
    returnCallback();
  })

  // Save button
  const saveBtn = roundBtn.cloneNode(true);
  const saveBtnIcon = roundBtnIcon.cloneNode(true);
  saveBtnIcon.src = './assets/svg/save.svg';
  saveBtnIcon.alt = 'Save icon';
  saveBtn.title = 'Save current game';
  saveBtn.append(saveBtnIcon);

  // Load button
  const loadSaveBtn = roundBtn.cloneNode(true);
  const loadSaveBtnIcon = roundBtnIcon.cloneNode(true);
  loadSaveBtnIcon.src = './assets/svg/load.svg';
  loadSaveBtnIcon.alt = 'Load icon';
  loadSaveBtn.title = 'Load last manually or auto saved game';
  loadSaveBtn.append(loadSaveBtnIcon);

  // Restart button
  const restartBtn = roundBtn.cloneNode(true);
  const restartBtnIcon = roundBtnIcon.cloneNode(true);
  restartBtnIcon.src = './assets/svg/restart.svg';
  restartBtnIcon.alt = 'Restart icon';
  restartBtn.title = 'Restart game in current mode';
  restartBtn.append(restartBtnIcon);
  restartBtn.addEventListener('click', () => {
    clearInterval(timerID);
    restartCallback(game.mode);
  });

  // Results button
  const resultsBtn = roundBtn.cloneNode(true);
  const resultsBtnIcon = roundBtnIcon.cloneNode(true);
  resultsBtnIcon.src = './assets/svg/award.svg';
  resultsBtnIcon.alt = 'Show results icon';
  resultsBtn.title = 'Show game results';
  resultsBtn.append(resultsBtnIcon);
  resultsBtn.addEventListener('click', () => {
    resultModal.open();
  });

  // Settings button
  const settingsBtn = roundBtn.cloneNode(true);
  const settingsBtnIcon = roundBtnIcon.cloneNode(true);
  settingsBtnIcon.src = './assets/svg/settings.svg';
  settingsBtnIcon.alt = 'Settings icon';
  settingsBtn.title = 'Show settings';
  settingsBtn.append(settingsBtnIcon);
  settingsBtn.addEventListener('click', () => {
    settingsModal.open();
  })

  header.append(title, backBtn, saveBtn, loadSaveBtn, settingsBtn, restartBtn);
  hintsButtons.append(addCells, shuffleCells, eraseCell, revert);
  hints.append(hintsButtons, hintMoves);
  stats.append(timer, score, moves);
  main.append(hints, stats, field);
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

  const sounds = {
    select: new Audio('./assets/audio/select.wav'),
    success: new Audio('./assets/audio/success.wav'),
    win: new Audio('./assets/audio/win.wav'),
    lose: new Audio('./assets/audio/lose.wav'),
    invalid: new Audio('./assets/audio/invalid.wav'),
    delete: new Audio('./assets/audio/delete.wav'),
    shuffle: new Audio('./assets/audio/shuffle.wav')
  }

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
      playSound(sounds['select']);
      return;
    }

    if (selectedCell === cellBtn) {
      selectedCell = null;
      cellBtn.classList.remove('game-screen__cell_selected');
      playSound(sounds['select']);
      return;
    }

    lock = true;

    const firstIndices = [Number(selectedCell.dataset.i), Number(selectedCell.dataset.j)];
    const secondIndices = [Number(cellBtn.dataset.i), Number(cellBtn.dataset.j)];

    if (game.isValidCellPair(firstIndices, secondIndices)) {
      const points = game.getPoints(firstIndices, secondIndices);
      if (points !== 0) {
        playSound(sounds['success']);
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

      selectedCell.classList.add('game-screen__cell_warn');
      cellBtn.classList.add('game-screen__cell_warn');
      selectedCell.disabled = true;
      cellBtn.disabled = true;
      playSound(sounds['invalid']);
      await Utils.sleep(500);
      selectedCell.disabled = false;
      cellBtn.disabled = false;
      selectedCell.classList.remove('game-screen__cell_warn');
      cellBtn.classList.remove('game-screen__cell_warn');

      selectedCell.classList.remove('game-screen__cell_selected');
      selectedCell = null;
    } else {
      selectedCell.classList.add('game-screen__cell_invalid');
      cellBtn.classList.add('game-screen__cell_invalid');
      selectedCell.disabled = true;
      cellBtn.disabled = true;
      playSound(sounds['invalid']);
      await Utils.sleep(500);
      selectedCell.disabled = false;
      cellBtn.disabled = false;
      selectedCell.classList.remove('game-screen__cell_invalid');
      cellBtn.classList.remove('game-screen__cell_invalid');
    }

    lock = false;
  });

  addCells.addEventListener('click', () => {
    if (game.addRowsUses > 0) {
      playSound(sounds['shuffle']);
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
      playSound(sounds['shuffle']);
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
      playSound(sounds['delete']);
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
    clearInterval(timerID);
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
    let gameField = game.field.map((row) => [...row]);
    if (gameField.length > 50) {
      gameField = gameField.slice(0, 50);
    }
    const fieldButtons = gameField.map((row, i) => {
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

  function getGameEndResult() {
    if (game.score >= 100) {
      return 'Win';
    }

    if (game.field.length > 50) {
      return 'Rows';
    }

    if (
      game.getValidMovesCount() === 0 &&
      game.addRowsUses === 0 &&
      game.shuffleUses === 0 &&
      game.eraserUses === 0
    ) {
      return 'Moves';
    }

    if (
      game.addRowsUses !== 0 ||
      game.shuffleUses !== 0 ||
      game.eraserUses !== 0
    ) {
      if (game.field.flat().every((value) => value === null)) return 'Empty';
    }

    return null;
  }

  function checkWinCondition() {
    const result = getGameEndResult();
    if (result) {
      let outcome;
      let message;

      switch (result) {
        case 'Win': {
          outcome = 'Win';
          message = 'Well done!';
          break;
        }
        case 'Empty': {
          outcome = 'Win';
          message = `Board is cleared but you can do better`;
          break;
        }
        case 'Rows': {
          outcome = 'Lose';
          message = `Row limit exceeded: ${game.field.length} / 50`;
          break;
        }
        case 'Moves': {
          outcome = 'Lose';
          message = 'No available moves left';
          break;
        }
      }

      if (outcome === 'Win') {
        playSound(sounds['win']);
      } else {
        playSound(sounds['lose']);
      }

      clearInterval(timerID);
      saveBtn.disabled = true;
      loadSaveBtn.disabled = true;
      addCells.disabled = true;
      shuffleCells.disabled = true;
      eraseCell.disabled = true;
      revert.disabled = true;
      hintMoves.style.display = 'none';
      lock = true;

      header.append(resultsBtn);
      resultModal.setMessages(
        outcome,
        message,
        game.score,
        game.moves,
        Utils.getFormattedTime(timerSeconds)
      );
      resultModal.open();

      let records = localStorage.getItem('records');
      const newRecord = {
        result: outcome,
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
    const result = getGameEndResult();
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

  function playSound(sound) {
    const isMuted = JSON.parse(localStorage.getItem('isMuted'));
    if (!isMuted) {
      sound.currentTime = 0;
      sound.play();
    }
  }
}