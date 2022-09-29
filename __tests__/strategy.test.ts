import { Strategy, Indicator, Dataset, Quote } from '../src';
import { sampleStrategy, sampleBacktest } from './mocks/mock-data';

describe('Strategy', () => {
  describe('constructor', () => {
    it('Should create a valid Strategy object.', () => {
      const strategy = sampleStrategy('new-strategy');

      expect(strategy).toHaveProperty('name');
      expect(strategy.name).toBe('new-strategy');

      expect(strategy).toHaveProperty('options');
      expect(strategy.options.indicators).toHaveLength(1);
    });
  });

  describe('apply', () => {
    const indicator = new Indicator(
      'indicator',
      (ds: Dataset) => ds.valueAt(-1) + 1
    );

    it('Should apply strategy over a given Quote', () => {
      const strategyFn = jest.fn();
      const strategy = new Strategy('strategy', {
        entryWhen: strategyFn,
        exitWhen: () => false,
        indicators: [indicator]
      });

      const quote = new Quote(1);
      quote.setIndicator('indicator', 2);

      strategy.apply(quote);

      expect(strategyFn).toHaveBeenCalled();
      expect(strategyFn).toHaveBeenCalledWith(quote);
    });
  });

  describe('backtest', () => {
    it('Should return a back-tested report over a given dataset for a given configuration.', () => {
      const ds = new Dataset(sampleBacktest.dataset);
      const strategy = sampleBacktest.strategy;

      const backtestReport = strategy.backtest(
        ds,
        {
          config: sampleBacktest.configuration,
          onEntry: (quote) => quote.value * 1,
          onExit: (quote) => quote.value * 1,
        }
      );

      expect(backtestReport.currentCapital).toBe(83);
    });
  });
});
