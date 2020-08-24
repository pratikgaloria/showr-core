import { Dataset } from './dataset';
import { Quote } from './quote';
import { PositionType, Position } from './position';
import { Strategy } from './strategy';

export interface BacktestConfiguration {
  capital: number;
  tradingQuantity: number;
  name?: string;
  symbol?: string;
}

/**
 * Creates a back-test report.
 */
export class BacktestReport {
  protected _currentCapital: number;

  profit: number;
  loss: number;
  numberOfTrades: number;
  initialCapital: number;
  finalCapital: number;
  return: number;

  /**
   * Defines the initial capital for the back-test.
   * @param initialCapital - Initial capital for the back-test.
   */
  constructor(initialCapital) {
    this.profit = 0;
    this.loss = 0;
    this.numberOfTrades = 0;
    this.initialCapital = initialCapital;
    this.finalCapital = initialCapital;

    this._currentCapital = initialCapital;
    this.return = 0;
  }

  private updateCapital(value) {
    this.finalCapital += value;
  }

  private updateTotals() {
    this.return =
      ((this.finalCapital - this.initialCapital) * 100) / this.initialCapital;
    this.numberOfTrades += 1;
  }

  /**
   * Updates the capital according to the traded value after executing the entry position.
   * @param tradedValue - Traded value at the time.
   */
  markEntry(tradedValue: number) {
    this.updateCapital(-tradedValue);
  }

  /**
   * Updates the capital according to the traded value after executing the exit position.
   * @param tradedValue - Traded value at the time.
   */
  markExit(tradedValue: number) {
    this.updateCapital(tradedValue);

    if (this._currentCapital > this.finalCapital) {
      this.loss += this._currentCapital - this.finalCapital;
    } else {
      this.profit += this.finalCapital - this._currentCapital;
    }

    this._currentCapital = this.finalCapital;
    this.updateTotals();
  }
}

/**
 * Back-tests the strategy over a given dataset.
 */
export class Backtest {
  protected _dataset: Dataset;

  /**
   * Runs back-test over a dataset for a given strategy that can be analyzed.
   * @param dataset - `Dataset` over which strategy should be back-tested.
   * @param strategy - `Strategy` that should be back-tested.
   */
  constructor(dataset: Dataset, strategy: Strategy) {
    this._dataset = dataset;
    this._dataset.apply(...strategy.indicators);

    const _position = new Position('idle');
    this._dataset.quotes.forEach((quote: Quote) => {
      _position.update(strategy.apply(quote));

      quote.extend(_position.value);
    });
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
    const report = new BacktestReport(configuration.capital);

    this._dataset.quotes.forEach((quote: Quote) => {
      if ((quote.value.position as PositionType) === 'entry') {
        report.markEntry(quote.value.close * configuration.tradingQuantity);
      } else if ((quote.value.position as PositionType) === 'exit') {
        report.markExit(quote.value.close * configuration.tradingQuantity);
      }
    });

    return report;
  }
}
