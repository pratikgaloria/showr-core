import {
  Dataset, Indicator, Quote, Algorithm,
} from '../src';
import errors from '../src/utils/errors';

describe('Dataset', () => {
  describe('constructor', () => {
    it('Should return a valid Dataset object for a given value.', () => {
      const dataset = new Dataset(1);

      expect(dataset).toBeInstanceOf(Dataset);
      expect(dataset).toHaveProperty('value');

      expect(dataset.value).toBeInstanceOf(Array);

      expect(dataset.value[0]).toBeInstanceOf(Quote);
      expect(dataset.value[0]).toHaveProperty('value');
      expect(dataset.value[0].value).toBe(1);
    });

    it('Should return a valid Dataset object for multiple values.', () => {
      const dataset = new Dataset([0, 1, 2]);

      expect(dataset.value).toEqual([{ value: 0 }, { value: 1 }, { value: 2 }]);
    });

    it('Should throw an error in case of undesired value.', () => {
      expect(() => new Dataset([[1]])).toThrow(errors.invalidQuoteValue);
    });
  });

  describe('apply', () => {
    it('Should apply indicator to dataset values.', () => {
      const indicator = new Indicator('indicator', {}, quote => quote.value + 1);
      const dataset = new Dataset(1);

      expect(dataset.apply(indicator).value).toEqual([{ value: 1, indicator: 2 }]);
    });

    it('Should apply multiple indicators to dataset values.', () => {
      const sum = new Indicator('sum', {}, quote => quote.value + 10);
      const multiply = new Indicator('multiply', {}, quote => quote.value * 10);
      const dataset = new Dataset([1, 2]);

      expect(dataset.apply(sum, multiply).value).toEqual([
        { value: 1, sum: 11, multiply: 10 },
        { value: 2, sum: 12, multiply: 20 },
      ]);
    });

    it('Should throw an error if indicator object is invalid.', () => {
      const indicator = 'indicator';
      const dataset = new Dataset(1);

      expect(() => dataset.apply(indicator).value).toThrow(errors.invalidIndicator);
    });
  });

  describe('backtest', () => {
    it('Should backtest an algorithm for a given dataset.', () => {
      const algorithm = new Algorithm('Algo', num => num.value > 10, num => num.value < 10);
      const dataset = new Dataset(12);

      expect(dataset.backtest(algorithm).value).toEqual([
        {
          value: 12,
          backtest: {
            Algo: 'entry',
          },
        },
      ]);
    });

    it('Should backtest multiple algorithms for a given dataset.', () => {
      const divBy2 = new Algorithm('DivBy2', num => num.value % 2 === 0, num => !(num.value % 2 === 0));
      const moreThan10 = new Algorithm('MoreThan10', num => num.value > 10, num => num.value < 10);

      const dataset = new Dataset([6, 9, 12]);

      expect(dataset.backtest(divBy2, moreThan10).value).toEqual([
        {
          value: 6,
          backtest: {
            DivBy2: 'entry',
            MoreThan10: 'hold',
          },
        }, {
          value: 9,
          backtest: {
            DivBy2: 'exit',
            MoreThan10: 'hold',
          },
        }, {
          value: 12,
          backtest: {
            DivBy2: 'entry',
            MoreThan10: 'entry',
          },
        },
      ]);
    });

    it('Should throw an error if algorithm object is invalid.', () => {
      const algorithm = 'Algo';
      const dataset = new Dataset(1);

      expect(() => dataset.backtest(algorithm).value).toThrow(errors.invalidAlgorithm);
    });
  });
});
