import { Dataset, Strategy, Quote, Indicator } from '../../src';
import { StrategyPoint } from '../../src/strategy';
import { SMA } from './mock-sma';

export const sampleIndicatorFn = (ds: Dataset) =>
  ds.value[ds.value.length - 1].close * 5;

export const sampleStrategy = (name: string) =>
  new Strategy(name, (quote: Quote) => new StrategyPoint('entry'), [
    new Indicator('indicator1', sampleIndicatorFn),
  ]);

export const sampleBacktest = {
  dataset: [20, 25, 22, 28, 35, 30, 25, 18, 15],
  strategy: new Strategy(
    'new-strategy',
    (quote: Quote) => {
      const sma2 = quote.getIndicator('sma2');

      if (!!sma2 && sma2 > 25) {
        return new StrategyPoint('entry');
      }
      if (!!sma2 && sma2 < 25) {
        return new StrategyPoint('exit');
      }
    },
    [new SMA('sma2', { period: 2 })]
  ),
  configuration: {
    capital: 100,
    tradingQuantity: 1,
    attribute: 'close',
  },
  report: {
    _currentCapital: 83,
    finalCapital: 83,
    initialCapital: 100,
    loss: 17,
    numberOfTrades: 1,
    profit: 0,
    returns: -17,
  },
};
