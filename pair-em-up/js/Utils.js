export class Utils {
  static getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static adjustBoundedMatrix(matrix, elements, width) {
    const array = matrix.flat();
    array.push(...elements);
    const result = [];
    for (let i = 0; i < array.length; i += width) {
      result.push(array.slice(i, i + width));
    }
    return result;
  }

  static fisherYatesShuffle(array) {
    const copy = [...array];
    for (let i = array.length - 1; i >= 1; i--) {
      const j = this.getRandomIntInclusive(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

