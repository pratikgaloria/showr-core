import { tryParseFloat } from '../src/utils/numbers';
import { getAllUniqueSubsets } from '../src/utils/helpers';

describe('Utils', () => {
  describe('Numbers', () => {
    describe('tryParseNumber', () => {
      it('Should return valid value as a number', () => {
        expect(tryParseFloat(0)).toBe(0);
        expect(tryParseFloat(1)).toBe(1);
      });

      it('Should return valid value as a number for a string value.', () => {
        expect(tryParseFloat('1')).toBe(1);
      });

      it('Should return value as it is if it cannot be parsed to a number.', () => {
        const date = new Date();

        expect(tryParseFloat('abc')).toBe('abc');
        expect(tryParseFloat(date)).toBe(date);
      });
    });
  });

  describe('Helpers', () => {
    describe('getAllUniqueSubsets', () => {
      it('Should return all unique subsets of the given array', () => {
        expect(getAllUniqueSubsets([1, 2, 3])).toEqual([
          [1],
          [2],
          [2, 1],
          [3],
          [3, 1],
          [3, 2],
          [3, 2, 1],
        ]);
      });

      it('Should return right number of subsets for the given large array', () => {
        const array = [1, 2, 3, 4, 5];

        expect(getAllUniqueSubsets(array).length).toBe(
          Math.pow(2, array.length) - 1
        );
      });
    });
  });
});
