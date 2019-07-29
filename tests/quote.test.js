import { Quote } from '../src';
import { symbols } from '../src/utils/symbols';
import errors from '../src/utils/errors';

describe('Quote', () => {
  describe('constructor', () => {
    it('Should return a valid Quote object for a given primitive value.', () => {
      const quote = new Quote(1);

      expect(quote).toBeInstanceOf(Quote);
      expect(quote).toHaveProperty('value');
      expect(quote.value).toBe(1);
    });

    it('Should return a valid Quote object for a given object value.', () => {
      const quote = new Quote({ [symbols.CLOSE]: 10 });

      expect(quote.value).toStrictEqual({ [symbols.CLOSE]: 10 });
    });

    it('Should throw an error if given value is invalid.', () => {
      expect(() => new Quote()).toThrow(errors.invalidQuoteValue);
      expect(() => new Quote(undefined)).toThrow(errors.invalidQuoteValue);
      expect(() => new Quote(null)).toThrow(errors.invalidQuoteValue);
      expect(() => new Quote('')).toThrow(errors.invalidQuoteValue);
    });

    it('Should throw an error if given value is an array.', () => {
      expect(() => new Quote([1])).toThrow(errors.invalidQuoteValue);
    });

    it('Should not throw an error if given value is 0.', () => {
      expect(() => new Quote(0)).not.toThrow();
    });
  });
});
