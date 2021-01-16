import { tryParseFloat } from '../src/utils/numbers';
import { getAllUniqueSubsets } from '../src/utils/helpers';
import { getAverageGain, getAverageLoss } from '../src/utils';

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

  describe('Utils', () => {
    describe('getAverageGain', () => {
      it('Should return average gain of the given array', () => {
        // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:relative_strength_index_rsi
        const dataset = [
          44.34,
          44.09,
          44.15,
          43.61,
          44.33,
          44.83,
          45.1,
          45.42,
          45.84,
          46.08,
          45.89,
          46.03,
          45.61,
          46.28,
          46.28
        ];

        expect(getAverageGain(dataset, 14)?.toFixed(2)).toEqual('0.24');
      });

      it('Should return average loss of the given array', () => {
        // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:relative_strength_index_rsi
        const dataset = [
          44.34, 
          44.09,
          44.15,
          43.61,
          44.33,
          44.83,
          45.1,
          45.42,
          45.84,
          46.08,
          45.89,
          46.03,
          45.61,
          46.28,
          46.28
        ];

        expect(getAverageLoss(dataset, 14)?.toFixed(2)).toEqual('0.10');
      });
    });
  });
});
