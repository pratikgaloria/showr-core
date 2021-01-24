import { Dataset, Quote, Position, Strategy } from './';
import { Keys } from './enums/symbols.enum';
import { StrategyPoint } from './strategy';

export interface BacktestConfiguration {
  capital: number;
  tradingQuantity: number;
  attribute: string;
  name?: string;
}

/**
 * Creates a back-test report.
 */
export class BacktestReport {
  _currentCapital: number;

  profit: number;
  loss: number;
  numberOfTrades: number;
  initialCapital: number;
  finalCapital: number;
  returns: number;

  /**
   * Defines the initial capital for the back-test.
   * @param initialCapital - Initial capital for the back-test.
   */
  constructor(initialCapital: number) {
    this.profit = 0;
    this.loss = 0;
    this.numberOfTrades = 0;
    this.initialCapital = initialCapital;
    this.finalCapital = initialCapital;

    this.returns = 0;
    this._currentCapital = initialCapital;
  }

  private updateCapital(value: number) {
    this.finalCapital += value;
  }

  private updateTotals() {
    this.returns =
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
  protected _strategy: Strategy;

  /**
   * Runs back-test over a dataset for a given strategy that can be analyzed.
   * @param dataset - `Dataset` over which strategy should be back-tested.
   * @param strategy - `Strategy` that should be back-tested.
   */
  constructor(dataset: Dataset, strategy: Strategy) {
    this._strategy = strategy;
    this._dataset = dataset;
    this._dataset.apply(...strategy.indicators);

    const _position = new Position('idle');
    this._dataset.quotes.forEach((quote: Quote) => {
      _position.update(strategy.apply(quote)?.position);

      quote.extend(
        {
          ...quote.getStrategies(),
          [strategy.name]: new StrategyPoint(_position.value),
        },
        Keys.strategies
      );
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

    this._dataset.quotes.forEach((quote: Quote, index, array) => {
      const _positionValue = quote.getStrategy(this.strategy.name)?.position;
      const _attributeValue = quote.getAttribute(attribute);
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
