import { Strategy, Indicator, Dataset, Quote, BacktestReport } from '../src';
import { SMA } from '../src/indicators';
import { StrategyPoint } from '../src/strategy';
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
    it('Should apply strategy over a given Quote', () => {
      const strategyFn = jest.fn();
      const indicator = new Indicator(
        'indicator',
        (ds: Dataset) => ds.value[0].close + 1
      );
      const strategy = new Strategy('strategy', strategyFn, [indicator]);

      const quote = new Quote(1);
      quote.extend({
        indicator: 2,
      });

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
        sampleBacktest.configuration
      );

      expect(backtestReport).toEqual(
        sampleBacktest.report
      );
    });
  });
});
