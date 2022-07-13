import { Dataset, Quote, Strategy } from './';
import { BacktestReport } from './backtestReport';

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
   * Runs a back-test over a dataset for a given strategy.
   * @param dataset - `Dataset` over which strategy should be back-tested.
   * @param strategy - `Strategy` that should be back-tested.
   */
  constructor(dataset: Dataset<T>, strategy: Strategy<P, T>) {
    this._strategy = strategy;
    this._dataset = dataset;

    this._dataset.prepare(strategy);
  }

  get strategy() {
    return this._strategy;
  }

  get dataset() {
    return this._dataset;
  }

  /**
   * Runs the back-test over a dataset with the given configuration and returns report.
   * @param configuration - `BacktestConfiguration` with trading quantity and capital.
   * @returns `BacktestReport`.
   */
  run(configuration: BacktestConfiguration) {
    const { attribute, tradingQuantity } = configuration;
    const report = new BacktestReport(configuration.capital);

    this._dataset.quotes.forEach((quote: Quote<T>, index, array) => {
      const positionValue = quote.getStrategy(this.strategy.name).position;
      const attributeValue = attribute
        ? quote.getAttribute(attribute)
        : quote.value;
      const tradeValue = attributeValue * tradingQuantity;

      if (
        index === array.length - 1 &&
        (positionValue === 'entry' || positionValue === 'hold')
      ) {
        report.markExit(tradeValue);
      } else {
        if (positionValue === 'entry') {
          report.markEntry(tradeValue);
        } else if (positionValue === 'exit') {
          report.markExit(tradeValue);
        }
      }
    });

    return report;
  }
}
