import { Dataset, Quote, Indicator } from '../';

describe('Quote', () => {
  describe('constructor', () => {
    it('Should create a valid Quote object for a given primitive value.', () => {
      const quote = new Quote(1);

      expect(quote).toHaveProperty('value');
      expect(quote.value).toHaveProperty('close');
      expect(quote.value.close).toBe(1);
    });

    it('Should create a valid Quote object for a given value and a key.', () => {
      const quote = new Quote(1.345, 'open');

      expect(quote.value).toStrictEqual({ open: 1.345 });
    });

    it('Should create a valid Quote object for a given object.', () => {
      const date = new Date();
      const quote = new Quote({
        date,
        open: 1.345,
        high: 5.44,
        low: 3.999,
        close: 5.0,
      });

      expect(quote.value).toStrictEqual({
        date,
        open: 1.345,
        high: 5.44,
        low: 3.999,
        close: 5,
      });
    });

    it('Should throw an error if a given value is not valid.', () => {
      expect(() => new Quote([1])).toThrow();
      expect(() => new Quote(null)).toThrow();
      expect(() => new Quote(undefined)).toThrow();
      expect(() => new Quote(() => {})).toThrow();
    });

    it('Should not throw an error if given value is 0.', () => {
      expect(() => new Quote('')).not.toThrow();
      expect(() => new Quote(0)).not.toThrow();
    });
  });

  describe('extend', () => {
    it('Should extend with a valid object value.', () => {
      const quote = new Quote(1);

      expect(quote.extend({ open: 2 }).value).toStrictEqual({
        open: 2,
        close: 1,
      });
    });

    it('Should not extend with an array.', () => {
      const quote = new Quote(1);

      expect(quote.extend([2]).value).toStrictEqual({
        close: 1,
      });
    });
  });

  describe('getIndicator', () => {
    it('Should return an indicator value if exists.', () => {
      const ds = new Dataset([1, 2]);
      const multi5 = new Indicator(
        'multi5',
        ds => ds.value[ds.value.length - 1].close * 5
      );

      ds.apply(multi5);
      ds.quotes.forEach(async q => {
        await expect(q.getIndicator('multi5')).toBeTruthy();
      });
    });

    it("Should return undefined if indicator does't exists", () => {
      const ds = new Dataset([1, 2]);

      ds.quotes.forEach(async q => {
        await expect(q.getIndicator('multi5')).toBeUndefined();
      });
    });
  });
});
