import { Dataset, Quote, TradePosition, Strategy } from './';
import { BacktestReport } from './backtestReport';
import { StrategyValue } from './strategy';

export interface BacktestConfiguration {
  capital: number;
  tradingQuantity: number;
  attribute?: string;
  name?: string;
}

/**
 * Back-tests the strategy over a given dataset.
 */
export class Backtest<P = unknown, T = number> {
  protected _dataset: Dataset<T>;
  protected _strategy: Strategy<P, T>;

  /**
   * Runs back-test over a dataset for a given strategy that can be analyzed.
   * @param dataset - `Dataset` over which strategy should be back-tested.
   * @param strategy - `Strategy` that should be back-tested.
   */
  constructor(dataset: Dataset<T>, strategy: Strategy<P, T>) {
    this._strategy = strategy;
    this._dataset = dataset;
    this._dataset.apply(...strategy.indicators);

    const _position = new TradePosition('idle');
    this._dataset.quotes.forEach((quote: Quote<T>) => {
      _position.update(strategy.apply(quote)?.position);

      quote.setStrategy(strategy.name, new StrategyValue(_position.value));
    });
  }

  get strategy() {
    return this._strategy;
  }

  get dataset() {
    return this._dataset;
  }

  /**
   * Creates a report with profit and other metrics over a back-tested dataset.
   * @param configuration - `BacktestConfiguration` with trading quantity and capital.
   * @returns `BacktestReport`.
   */
  analyze(configuration: BacktestConfiguration) {
    const { attribute, tradingQuantity } = configuration;
    const report = new BacktestReport(configuration.capital);

    this._dataset.quotes.forEach((quote: Quote<T>, index, array) => {
      const _positionValue = quote.getStrategy(this.strategy.name).position;
      const _attributeValue = attribute
        ? quote.getAttribute(attribute)
        : quote.value;
      const _tradeValue = _attributeValue * tradingQuantity;

      if (
        index === array.length - 1 &&
        (_positionValue === 'entry' || _positionValue === 'hold')
      ) {
        report.markExit(_tradeValue);
      } else {
        if (_positionValue === 'entry') {
          report.markEntry(_tradeValue);
        } else if (_positionValue === 'exit') {
          report.markExit(_tradeValue);
        }
      }
    });

    return report;
  }
}
