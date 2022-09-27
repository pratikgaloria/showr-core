import { Strategy, Indicator, Dataset, Quote, StrategyValue } from '../src';
import { sampleStrategy, sampleBacktest } from './mocks/mock-data';

describe('Strategy', () => {
  describe('constructor', () => {
    it('Should create a valid Strategy object.', () => {
      const strategy = sampleStrategy('new-strategy');

      expect(strategy).toHaveProperty('name');
      expect(strategy.name).toBe('new-strategy');

      expect(strategy).toHaveProperty('indicators');
      expect(strategy.indicators).toHaveLength(1);
    });
  });

  describe('apply', () => {
    const indicator = new Indicator(
      'indicator',
      (ds: Dataset) => ds.valueAt(-1) + 1
    );

    it('Should apply strategy over a given Quote', () => {
      const strategyFn = jest.fn();
      const strategy = new Strategy('strategy', strategyFn, [indicator]);

      const quote = new Quote(1);
      quote.setIndicator('indicator', 2);

      strategy.apply(quote);

      expect(strategyFn).toHaveBeenCalled();
      expect(strategyFn).toHaveBeenCalledWith(quote);
    });

    it('Should be able to set metadata along with the strategy value', () => {
      const strategy = new Strategy('strategy', () => new StrategyValue('entry', { price: 'open' }), [indicator]);

      const quote = new Quote(1);
      quote.setIndicator('indicator', 2);

      const value = strategy.apply(quote);

      expect(value?.position).toBe('entry');
      expect(value?.meta?.price).toBe('open');
    })
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
