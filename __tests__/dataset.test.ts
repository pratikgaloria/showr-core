import { Dataset, Quote, Indicator } from '../src';
import { sampleIndicatorFn } from './mocks/mock-data';

describe('Dataset', () => {
  describe('constructor', () => {
    it('Should be created without values.', () => {
      expect(new Dataset().value).toStrictEqual([]);
    });

    it('Should create a valid Dataset object for given values.', () => {
      const dataset = new Dataset([1]);

      expect(dataset).toHaveProperty('value');
      expect(dataset.value).toBeInstanceOf(Array);
      expect(dataset.value).toHaveLength(1);

      expect(dataset.value[0]).toBe(1);
    });

    it('Should create a valid Dataset object for multiple values.', () => {
      const dataset = new Dataset([0, 1, 2]);

      expect(dataset.value).toHaveLength(3);
      expect(dataset.value).toStrictEqual([0, 1, 2]);
    });

    it('Should create a valid Dataset object for Quotes.', () => {
      const dataset = new Dataset([new Quote(10), new Quote(20)]);

      expect(dataset.value).toHaveLength(2);
      expect(dataset.value).toStrictEqual([10, 20]);
    });

    it('Should create a valid Array of Quotes.', () => {
      const dataset = new Dataset([1]);

      expect(dataset).toHaveProperty('quotes');
      expect(dataset.quotes).toHaveLength(1);

      expect(dataset.quotes[0]).toBeInstanceOf(Quote);
      expect(dataset.quotes[0].value).toStrictEqual(1);
    });
  });

  describe('at', () => {
    const dataset = new Dataset([1, 2, 3]);

    it('Should return first quote if called with 0.', () => {
      expect(dataset.at(0).value).toBe(1);
    });

    it('Should return second quote if called with 1.', () => {
      expect(dataset.at(1).value).toBe(2);
    });

    it('Should return last quote if called with -1.', () => {
      expect(dataset.at(-1).value).toBe(3);
    });

    it('Should return second last quote if called with -2.', () => {
      expect(dataset.at(-2).value).toBe(2);
    });

    it('Should return undefined for invalid index.', () => {
      expect(dataset.at(3)).toBeUndefined();
    });
  });

  describe('add', () => {
    it('Should append a new Quote to the dataset', () => {
      const dataset = new Dataset([1]);
      const quote = new Quote(2);

      dataset.add(quote);

      expect(dataset.quotes).toHaveLength(2);
      expect(dataset.quotes[1].value).toBe(2);
    });
  });

  describe('apply', () => {
    it('Should apply indicator to the dataset.', () => {
      const dataset = new Dataset([1]);
      const indicator = new Indicator('multi5', sampleIndicatorFn);

      dataset.apply(indicator);

      expect(dataset.quotes).toHaveLength(1);
      expect(dataset.at(0).getIndicator('multi5')).toBe(5);
    });

    it('Should apply multiple indicators to the dataset.', () => {
      const dataset = new Dataset([5, 10]);
      const add2 = new Indicator(
        'add2',
        (ds) => ds.value[ds.value.length - 1] + 2
      );
      const min1 = new Indicator(
        'min1',
        (ds) => ds.value[ds.value.length - 1] - 1
      );

      dataset.apply(add2, min1);

      expect(dataset.at(0).getIndicator('add2')).toBe(7);
      expect(dataset.at(0).getIndicator('min1')).toBe(4);
      expect(dataset.at(1).getIndicator('add2')).toBe(12);
      expect(dataset.at(1).getIndicator('min1')).toBe(9);
    });
  });

  describe('flatten', () => {
    it('Should flatten the dataset over any attribute.', () => {
      const dataset = new Dataset([
        { close: 10, high: 15 },
        { close: 20, high: 25 },
      ]);

      expect(dataset.flatten('high')).toStrictEqual([15, 25]);
    });

    it('Should return the dataset value if no attribute provided.', () => {
      const dataset = new Dataset([1, 2, 3]);

      expect(dataset.flatten()).toStrictEqual(dataset.value);
    });
  });

  describe('valueAt', () => {
    const dataset = new Dataset([1, 2, 3]);

    it('Should return the value of the first quote if called with 0.', () => {
      expect(dataset.valueAt(0)).toBe(1);
    });

    it('Should return the value of the second quote if called with 1.', () => {
      expect(dataset.valueAt(1)).toBe(2);
    });

    it('Should return the value of the last quote if called with -1.', () => {
      expect(dataset.valueAt(-1)).toBe(3);
    });

    it('Should return the value of the specific attribute of the quote at the given position.', () => {
      const dataset2 = new Dataset([
        { close: 10 },
        { close: 20 },
        { close: 30 },
      ]);
      expect(dataset2.valueAt(1, 'close')).toBe(20);
    });
  });
});
