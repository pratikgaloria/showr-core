//import '@types/jest';
import { Dataset, Quote, Indicator, Strategy, StrategyValue } from '../src';
import { IndicatorMetadata, StrategyMetadata } from '../src/dataset';
import { sampleIndicatorFn, sampleStrategy } from './mocks/mock-data';

describe('Dataset', () => {
  describe('constructor', () => {
    it('Should be created without values.', () => {
      const dataset = new Dataset();

      expect(dataset.quotes).toStrictEqual([]);
      expect(dataset.indicators).toStrictEqual([]);
      expect(dataset.strategies).toStrictEqual([]);
    });

    it('Should create a valid Dataset object for given values.', () => {
      const dataset = new Dataset([1]);

      expect(dataset).toHaveProperty('quotes');
      expect(dataset.quotes).toBeInstanceOf(Array);
      expect(dataset.quotes).toHaveLength(1);

      expect(dataset.quotes[0].value).toBe(1);
    });

    it('Should create a valid Dataset object for multiple values.', () => {
      const dataset = new Dataset([0, 1, 2]);

      expect(dataset.quotes).toHaveLength(3);
    });

    it('Should create a valid Dataset object for Quotes.', () => {
      const dataset = new Dataset([new Quote(10), new Quote(20)]);

      expect(dataset.quotes).toHaveLength(2);
    });

    it('Should create a valid Array of Quotes.', () => {
      const dataset = new Dataset([1]);

      expect(dataset).toHaveProperty('quotes');
      expect(dataset.quotes).toHaveLength(1);

      expect(dataset.quotes[0]).toBeInstanceOf(Quote);
      expect(dataset.quotes[0].value).toStrictEqual(1);
    });
  });

  describe('setIndicator', () => {
    it('Should add a given indicator metadata to indicators property', () => {
      const dataset = new Dataset([1, 2, 3]);
      const sma2 = new Indicator('sma2', sampleIndicatorFn);
      const indicatorMetadata: IndicatorMetadata<number> = {
        appliedUntilIndex: 1,
        indicator: sma2,
        name: 'sma2'
      };

      dataset.setIndicator(indicatorMetadata);
      expect(dataset.indicators).toStrictEqual([indicatorMetadata]);
    });
  });

  describe('setStrategy', () => {
    it('Should add a given strategy metadata to strategies property', () => {
      const dataset = new Dataset([1, 2, 3]);
      const sma2 = new Indicator('sma2', sampleIndicatorFn);
      const strategyMetadata: StrategyMetadata<number> = {
        appliedUntilIndex: 1,
        strategy: new Strategy('buy-above-sma', () => new StrategyValue('entry'), [sma2]),
        name: 'sma2'
      };

      dataset.setStrategy(strategyMetadata);
      expect(dataset.strategies).toStrictEqual([strategyMetadata]);
    });
  })

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

    it('Should apply an indicator to the new Quote if exists', () => {
      const dataset = new Dataset([1]);
      const sma2 = new Indicator('sma2', sampleIndicatorFn);
      dataset.apply(sma2);

      const quote = new Quote(2);
      dataset.add(quote);

      expect(dataset.quotes[1].getIndicator('sma2')).toBe(10);
    });

    it('Should apply a strategy to the new Quote if exists', () => {
      const dataset = new Dataset([1]);
      dataset.prepare(sampleStrategy('sample-strategy'));
      
      const quote = new Quote(2);
      dataset.add(quote);

      expect(dataset.quotes[1].getStrategy('sample-strategy').position).toBe('entry');
    });
  });

  describe('apply', () => {
    it('Should apply indicator to the dataset.', () => {
      const dataset = new Dataset([1]);
      const indicator = new Indicator('multi5', sampleIndicatorFn);

      dataset.apply(indicator);

      expect(dataset.quotes).toHaveLength(1);
      expect(dataset.at(0).getIndicator('multi5')).toBe(5);
      expect(dataset.indicators).toStrictEqual([{
        name: 'multi5',
        appliedUntilIndex: 0,
        indicator
      }]);
    });

    it('Should apply multiple indicators to the dataset.', () => {
      const dataset = new Dataset([5, 10]);
      const add2 = new Indicator(
        'add2',
        (ds) => ds.quotes[ds.length - 1].value + 2
      );
      const min1 = new Indicator(
        'min1',
        (ds) => ds.quotes[ds.length - 1].value - 1
      );

      dataset.apply(add2, min1);

      expect(dataset.at(0).getIndicator('add2')).toBe(7);
      expect(dataset.at(0).getIndicator('min1')).toBe(4);
      expect(dataset.at(1).getIndicator('add2')).toBe(12);
      expect(dataset.at(1).getIndicator('min1')).toBe(9);

      expect(dataset.indicators).toStrictEqual([
        {
          name: 'add2',
          appliedUntilIndex: 1,
          indicator: add2,
        },
        {
          name: 'min1',
          appliedUntilIndex: 1,
          indicator: min1,
        }
      ]);
    });
  });

  describe('prepare', () => {
    it('Should prepare the dataset by applying a given strategy.', () => {
      const dataset = new Dataset([5, 10]);
      const indicator = new Indicator('sma2', sampleIndicatorFn);
      const strategy = new Strategy('sample-strategy', () => new StrategyValue('entry'), [indicator]);
      dataset.prepare(strategy);

      expect(dataset.quotes[0].getStrategy('sample-strategy').position).toBe('entry');
      expect(dataset.quotes[1].getStrategy('sample-strategy').position).toBe('hold');
      
      expect(dataset.strategies).toStrictEqual([{
        name: 'sample-strategy',
        appliedUntilIndex: 1,
        strategy,
      }]);
      expect(dataset.indicators).toStrictEqual([{
        name: 'sma2',
        appliedUntilIndex: 1,
        indicator,
      }]);
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

      expect(dataset.flatten()).toStrictEqual([1, 2, 3]);
    });
  });

  describe('mutateAt', () => {
    it('Should mutate the first quote if called with 0.', () => {
      const dataset = new Dataset([1, 2, 3]);
      dataset.mutateAt(0, new Quote(0));
      expect(dataset.flatten()).toStrictEqual([0, 2, 3]);
    });

    it('Should mutate the second quote if called with 1.', () => {
      const dataset = new Dataset([1, 2, 3]);
      dataset.mutateAt(1, new Quote(0));
      expect(dataset.flatten()).toStrictEqual([1, 0, 3]);
    });

    it('Should mutate the last quote if called with -1.', () => {
      const dataset = new Dataset([1, 2, 3]);
      dataset.mutateAt(-1, new Quote(0));
      expect(dataset.flatten()).toStrictEqual([1, 2, 0]);
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
