import { Dataset, Quote, Indicator } from '../src';
import { Keys } from '../src/enums/symbols.enum';
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

      expect(dataset.value[0]).toStrictEqual({ close: 1 });
    });

    it('Should create a valid Dataset object for multiple values.', () => {
      const dataset = new Dataset([0, 1, 2], 'open');

      expect(dataset.value).toHaveLength(3);
      expect(dataset.value).toStrictEqual([
        { open: 0 },
        { open: 1 },
        { open: 2 },
      ]);
    });

    it('Should create a valid Dataset object for Quotes.', () => {
      const dataset = new Dataset([new Quote(10), new Quote(20)]);

      expect(dataset.value).toHaveLength(2);
      expect(dataset.value).toStrictEqual([{ close: 10 }, { close: 20 }]);
    });

    it('Should create a valid Array of Quotes.', () => {
      const dataset = new Dataset([1]);

      expect(dataset).toHaveProperty('quotes');
      expect(dataset.quotes).toHaveLength(1);

      expect(dataset.quotes[0]).toBeInstanceOf(Quote);
      expect(dataset.quotes[0].value).toStrictEqual({ close: 1 });
    });
  });

  describe('at', () => {
    const dataset = new Dataset([1, 2, 3]);

    it('Should return first quote if called with 0.', () => {
      expect(dataset.at(0).value).toStrictEqual({ close: 1 });
    });

    it('Should return second quote if called with 1.', () => {
      expect(dataset.at(1).value).toStrictEqual({ close: 2 });
    });

    it('Should return last quote if called with -1.', () => {
      expect(dataset.at(-1).value).toStrictEqual({ close: 3 });
    });

    it('Should return second last quote if called with -2.', () => {
      expect(dataset.at(-2).value).toStrictEqual({ close: 2 });
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
      expect(dataset.quotes[1].value).toStrictEqual({ close: 2 });
    });
  });

  describe('apply', () => {
    it('Should apply indicator to the dataset.', () => {
      const dataset = new Dataset([1]);
      const indicator = new Indicator(
        'multi5',
        sampleIndicatorFn
      );

      dataset.apply(indicator);

      expect(dataset.value).toHaveLength(1);
      expect(dataset.value[0]).toHaveProperty(Keys.indicators);
      expect(dataset.value).toStrictEqual([
        { close: 1, [Keys.indicators]: { multi5: 5 } },
      ]);
    });

    it('Should apply multiple indicators to the dataset.', () => {
      const dataset = new Dataset([5, 10]);
      const add2 = new Indicator(
        'add2',
        ds => ds.value[ds.value.length - 1].close + 2
      );
      const min1 = new Indicator(
        'min1',
        ds => ds.value[ds.value.length - 1].close - 1
      );

      dataset.apply(add2, min1);

      expect(dataset.value).toStrictEqual([
        { close: 5, [Keys.indicators]: { add2: 7, min1: 4 } },
        { close: 10, [Keys.indicators]: { add2: 12, min1: 9 } },
      ]);
    });
  });
});
