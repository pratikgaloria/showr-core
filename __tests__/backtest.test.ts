import { Backtest, BacktestReport, Strategy, Quote, Dataset } from '../src';
import { SMA } from '../src/indicators';

describe('Backtest', () => {
  const dataset = new Dataset([20, 25, 22, 28, 35, 30, 25, 18, 15]);
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

  describe('constructor', () => {
    it('Should run back-test over a given dataset for a given strategy.', async () => {
      const backtest = new Backtest(dataset, strategy);
      backtest.dataset.quotes.forEach(async q => {
        await expect(q.value).toHaveProperty('position');
      });
    });
  });

  describe('analyze', () => {
    it('Should return a report over a back-tested dataset for a given configuration.', () => {
      const backtest = new Backtest(dataset, strategy);
      const backtestReport = backtest.analyze({
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

describe('BacktestReport', () => {
  describe('constructor', () => {
    it('Should initialize with initialCapital and other default values.', () => {
      const backtestReport = new BacktestReport(1000);

      expect(backtestReport.initialCapital).toBe(1000);
      expect(backtestReport.profit).toBe(0);
      expect(backtestReport.loss).toBe(0);
      expect(backtestReport.numberOfTrades).toBe(0);
      expect(backtestReport.return).toBe(0);
      expect(backtestReport.finalCapital).toBe(1000);
    });
  });

  describe('markEntry', () => {
    it('Should update capital accordingly for entry position.', () => {
      const backtestReport = new BacktestReport(1000);

      backtestReport.markEntry(50);
      expect(backtestReport.finalCapital).toBe(950);
    });
  });

  describe('markExit', () => {
    it('Should update capital and other metrics accordingly for exit position in case of profit.', () => {
      const backtestReport = new BacktestReport(1000);

      backtestReport.markEntry(50);
      backtestReport.markExit(100);

      expect(backtestReport.finalCapital).toBe(1050);
      expect(backtestReport.profit).toBe(50);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.return).toBe(5);
    });

    it('Should update capital and other metrics accordingly for exit position in case of loss.', () => {
      const backtestReport = new BacktestReport(1000);

      backtestReport.markEntry(50);
      backtestReport.markExit(0);

      expect(backtestReport.finalCapital).toBe(950);
      expect(backtestReport.loss).toBe(50);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.return).toBe(-5);
    });
  });
});
