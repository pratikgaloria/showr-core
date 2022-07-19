import { BacktestReport } from '../src';

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
      expect(backtestReport.numberOfLosingTrades).toBe(0);
      expect(backtestReport.numberOfWinningTrades).toBe(1);
      expect(backtestReport.winningRate).toBe(1);
      expect(backtestReport.returns).toBe(5);
    });

    it('Should update capital and other metrics accordingly for exit position in case of loss.', () => {
      const backtestReport = new BacktestReport(1000);

      backtestReport.markEntry(50);
      backtestReport.markExit(0);

      expect(backtestReport.finalCapital).toBe(950);
      expect(backtestReport.loss).toBe(50);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.numberOfLosingTrades).toBe(1);
      expect(backtestReport.numberOfWinningTrades).toBe(0);
      expect(backtestReport.winningRate).toBe(0);
      expect(backtestReport.returns).toBe(-5);
    });
  });
});
