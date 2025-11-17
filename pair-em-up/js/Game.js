import {Utils} from "./Utils.js";

export class Game {
  constructor(mode) {
    this.MODES = ['Classic', 'Random', 'Chaotic'];
    this.POINTS = [1, 2, 3];
    this.mode = this.MODES.includes(mode) ? mode : this.MODES[0];
    this.INITIAL = [
      ...Array.from({length: 9}, (_, i) => `${i + 1}`),
      ...Array.from({length: 9}, (_, i) => `${i + 11}`),
    ];
    this.START_BOUND = 27;
    this.WIDTH = 9;
    this.field = [];
    this.score = 0;
    this.addRowsUses = 10;
    this.shuffleUses = 5;
    this.eraserUses = 5;
  }

  createClassicField(initial = this.INITIAL) {
    const elements = initial.flatMap((num) => {
      return num.split('')
        .map((digit) => Number(digit));
    });
    this.field = Utils.adjustBoundedMatrix(this.field, elements, this.WIDTH);
  }

  createRandomField() {
    this.createClassicField(Utils.fisherYatesShuffle(this.INITIAL))
  }

  createChaoticField() {
    const elements = [];
    for (let i = 0; i < this.START_BOUND; i++) {
      elements.push(Utils.getRandomIntInclusive(1, this.WIDTH));
    }
    this.field = Utils.adjustBoundedMatrix(this.field, elements, this.WIDTH);
  }

  deleteValueByIndices(...indices) {
    let [i, j] = Array.isArray(indices[0]) ? indices[0] : indices;
    this.field[i][j] = null;
  }

  appendClassicField() {
    const elements = this.getRemainingValues();
    this.field = Utils.adjustBoundedMatrix(this.field, elements, this.WIDTH);
  }

  appendRandomField() {
    const elements = this.getRemainingValues();
    const shuffledElements = Utils.fisherYatesShuffle(elements);
    this.field = Utils.adjustBoundedMatrix(this.field, elements, this.WIDTH);
  }

  appendChaoticField() {
    const elements = [];
    const length = this.getRemainingValues().length;
    for (let i = 0; i < length; i++) {
      elements.push(Utils.getRandomIntInclusive(1, this.WIDTH));
    }
    this.field = Utils.adjustBoundedMatrix(this.field, elements, this.WIDTH);
  }

  getRemainingPositions() {
    const result = [];
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] !== null) result.push([i, j]);
      }
    }
    return result;
  }

  getRemainingValues() {
    return this.getRemainingPositions()
      .map(([i, j]) => this.field[i][j]);
  }

  shuffleField() {
    const values = this.getRemainingValues();
    const positions = this.getRemainingPositions();

    const shuffledValues = Utils.fisherYatesShuffle(values);
    positions.forEach(([i, j], index) => {
      this.field[i][j] = shuffledValues[index];
    });
  }

  createField() {
    switch (this.mode) {
      case 'Classic':
        this.createClassicField();
        break;
      case 'Random':
        this.createRandomField();
        break;
      case 'Chaotic':
        this.createChaoticField();
        break;
    }
  }

  appendField() {
    switch (this.mode) {
      case 'Classic':
        this.appendClassicField();
        break;
      case 'Random':
        this.appendRandomField();
        break;
      case 'Chaotic':
        this.appendChaoticField();
        break;
    }
  }

  getPoints(pair1, pair2) {
    let [i1, j1] = pair1;
    let [i2, j2] = pair2;

    if (this.field[i1][j1] === 5 && this.field[i2][j2] === 5) {
      return this.POINTS[3];
    }

    if (this.field[i1][j1] + this.field[i2][j2] === 10) {
      return this.POINTS[1];
    }

    if (this.field[i1][j1] === this.field[i2][j2]) {
      return this.POINTS[0];
    }

    return 0;
  }

  isValidCellPair(pair1, pair2) {
    let [i1, j1] = pair1;
    let [i2, j2] = pair2;

    const [top, bottom] = [i1, i2].sort((a, b) => a - b);

    const isVerticalPath = () => {
      if (j1 === j2) {
        for (let i = top + 1; i < bottom; i++) {
          if (this.field[i][j1] !== null) return false;
        }
        return true;
      }
      return false;
    }

    const isOverflowPath = () => {
      const flatIndex1 = i1 * this.WIDTH + j1;
      const flatIndex2 = i2 * this.WIDTH + j2;
      const [start, end] = [flatIndex1, flatIndex2].sort((a, b) => a - b);
      const range = this.field.flat()
        .slice(start + 1, end);

      for (let i = 0; i < range.length; i++) {
        if (range[i] !== null) return false;
      }
      return true;
    }

    return isOverflowPath() || isVerticalPath();
  }

}