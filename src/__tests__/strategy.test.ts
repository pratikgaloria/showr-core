import { Strategy, Indicator, Dataset, Quote } from '../';
import { SMA } from 'indicators';

describe('Strategy', () => {
  describe('constructor', () => {
    it('Should create a valid Strategy object.', () => {
      const strategy = new Strategy('new-strategy', (quote: Quote) => 'entry', [
        new Indicator('sma', (ds: Dataset) => ds.value[0].close + 1),
      ]);

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
      const ds = new Dataset([20, 25, 22, 28, 35, 30, 25, 18, 15]);
      const iSMA = new SMA({ name: 'sma2', period: 2 });
      const strategy = new Strategy(
        'new-strategy',
        (quote: Quote) => {
          const sma2 = quote.getIndicator('sma2');

          if (!!sma2 && sma2 > 25) {
            return 'entry';
          }
          if (!!sma2 && sma2 < 25) {
            return 'exit';
          }
        },
        [iSMA]
      );

      const backtestReport = strategy.backtest(ds, {
        capital: 100,
        tradingQuantity: 1,
      });

      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBe(17);
      expect(backtestReport.return).toBe(-17);
      expect(backtestReport.finalCapital).toBe(83);
    });
  });
});
