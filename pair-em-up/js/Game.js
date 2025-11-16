import {Utils} from "./Utils.js";

export class Game {
  constructor() {
    this.MODES = ['Classic', 'Random', 'Chaotic'];
    this.INITIAL = [
      ...Array.from({length: 9}, (_, i) => `${i + 1}`),
      ...Array.from({length: 9}, (_, i) => `${i + 11}`),
    ];
    this.START_BOUND = 27;
    this.WIDTH = 9;
    this.field = [];
    this.score = 0;
  }

  createClassicField(initial = this.INITIAL) {
    const elements = initial.flatMap((num) => {
      return num.split('').map((digit) => String(digit));
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
    return this.getRemainingPositions().map(([i, j]) => this.field[i][j]);
  }

  shuffleField() {
    const values = this.getRemainingValues();
    const positions = this.getRemainingPositions();

    const shuffledValues = Utils.fisherYatesShuffle(values);
    positions.forEach(([i, j], index) => {
      this.field[i][j] = shuffledValues[index];
    });
  }

}