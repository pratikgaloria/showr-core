import { toDouble } from '../src/utils';

describe('Utils', () => {
  describe('toDouble', () => {
    it('Should return valid double value for a number', () => {
      expect(toDouble(0)).toBe(0);
      expect(toDouble(1)).toBe(1);
    });

    it('Should return valid double value for a number as a string.', () => {
      expect(toDouble('1')).toBe(1);
    });

    it('Should return valid double value with two default decimals for a number.', () => {
      expect(toDouble(1.345)).toBe(1.34);
    });

    it('Should return NaN if value is not parseable as a double.', () => {
      expect(toDouble('abc')).toBeNaN();
    });
  });
});
