import { Dataset, Quote, Strategy } from './';
import { BacktestReport } from './backtestReport';

export interface BacktestConfiguration {
  capital: number;
  name?: string;
}

export type BacktestTrigger<T> = (
  quote: Quote<T>,
  index: number,
  quotes: Quote<T>[]
) => number;
export type BacktestRunner<T> = {
  config: BacktestConfiguration;
  onEntry: BacktestTrigger<T>;
  onExit: BacktestTrigger<T>;
};

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
  run({ config, onEntry, onExit }: BacktestRunner<T>) {
    const report = new BacktestReport<T>(config.capital);

    this._dataset.quotes.forEach((quote: Quote<T>, index, array) => {
      const positionValue = quote.getStrategy(this.strategy.name)?.position;

      if (
        index === array.length - 1 &&
        (positionValue === 'entry' || positionValue === 'hold')
      ) {
        report.markExit(onExit(quote, index, array), quote);
        if (this._strategy.options.onTrigger) {
          this._strategy.options.onTrigger('exit', quote);
        }
      } else {
        if (positionValue === 'entry') {
          report.markEntry(onEntry(quote, index, array), quote);
          if (this._strategy.options.onTrigger) {
            this._strategy.options.onTrigger('entry', quote);
          }
        } else if (positionValue === 'exit') {
          report.markExit(onExit(quote, index, array), quote);
          if (this._strategy.options.onTrigger) {
            this._strategy.options.onTrigger('exit', quote);
          }
        }
      }
    });

    return report;
  }
}
