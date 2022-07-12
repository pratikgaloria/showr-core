import { Dataset, Indicator, Quote, Strategy, Trader } from '../src';
import { StrategyValue } from '../src/strategy';

describe('Trader', () => {
  const dataset = new Dataset([20, 25, 22, 28, 35, 30, 25, 18, 15]);
  const indicator = new Indicator('sma2', (ds) => ((ds.at(-2) ?? ds.at(-1)).value + ds.at(-1).value) / 2);
  const strategy = new Strategy('buy-if-sma2-is-above-25', (quote: Quote) => {
    const sma2 = quote.getIndicator('sma2');

    if (!!sma2 && sma2 > 25) {
      return new StrategyValue('entry');
    }
    if (!!sma2 && sma2 < 25) {
      return new StrategyValue('exit');
    }
  }, [indicator]);

  describe('constructor', () => {
    it('Should apply strategy over a given dataset.', async () => {
      const trader = new Trader(dataset, strategy);

      trader.dataset.quotes.forEach(q => {
        const strategyForQuote = q.getStrategy(strategy.name);

        expect(strategyForQuote).toBeTruthy();
        expect(strategyForQuote).toBeInstanceOf(StrategyValue);
      });
    });
  });

  describe('tick', () => {
    it('Should return a strategy position over a new quote.', () => {
      const trader = new Trader(dataset, strategy);
      const newPosition = trader.tick(new Quote(40));

      expect(newPosition).toBe('entry');
    });
  });
});
