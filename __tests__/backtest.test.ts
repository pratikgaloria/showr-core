import { Backtest, BacktestReport, Strategy, Quote, Dataset } from '../src';
import { SMA } from '../src/indicators';
import { StrategyPoint } from '../src/strategy';
import { sampleBacktest } from './mocks/mock-data';

describe('Backtest', () => {
  const dataset = new Dataset(sampleBacktest.dataset);
  const strategy = sampleBacktest.strategy;

  describe('constructor', () => {
    it('Should run back-test over a given dataset for a given strategy.', async () => {
      const backtest = new Backtest(dataset, strategy);

      backtest.dataset.quotes.forEach(q => {
        const strategyForQuote = q.getStrategy(strategy.name);

        expect(strategyForQuote).toBeTruthy();
        expect(strategyForQuote).toBeInstanceOf(StrategyPoint);
      });
    });
  });

  describe('analyze', () => {
    it('Should return a report over a back-tested dataset for a given configuration.', () => {
      const backtest = new Backtest(dataset, strategy);
      const backtestReport = backtest.analyze({
        capital: 100,
        tradingQuantity: 1,
        attribute: 'close'
      });

      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBe(17);
      expect(backtestReport.returns).toBe(-17);
      expect(backtestReport.finalCapital).toBe(83);
    });

    it('Should exit the last trade and return a report if it was on hold.', () => {
      const dataset2 = new Dataset([20, 25, 22, 28, 35, 30, 25, 28, 32]);
      const backtest = new Backtest(dataset2, strategy);
      const backtestReport = backtest.analyze({
        capital: 100,
        tradingQuantity: 1,
        attribute: 'close'
      });

      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBe(3);
      expect(backtestReport.returns).toBe(-3);
      expect(backtestReport.finalCapital).toBe(97);
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
      expect(backtestReport.returns).toBe(0);
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
      expect(backtestReport.returns).toBe(5);
    });

    it('Should update capital and other metrics accordingly for exit position in case of loss.', () => {
      const backtestReport = new BacktestReport(1000);

      backtestReport.markEntry(50);
      backtestReport.markExit(0);

      expect(backtestReport.finalCapital).toBe(950);
      expect(backtestReport.loss).toBe(50);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.returns).toBe(-5);
    });
  });
});
