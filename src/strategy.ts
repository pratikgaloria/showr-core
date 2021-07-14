import {
  Quote,
  Dataset,
  Indicator,
  Backtest,
  BacktestConfiguration,
  BacktestReport,
} from './';
import { PositionType } from './position';

export class StrategyValue {
  position: PositionType | undefined;

  constructor(position: PositionType | undefined) {
    this.position = position;
  }
}

/**
 * Defines a strategy that can be back-tested.
 */
export class Strategy<P = any, T = number> {
  protected _name: string;
  protected _define: (quote: Quote<T>) => StrategyValue | undefined;
  protected _indicators: Indicator<P, T>[];

  /**
   * Creates a strategy with definition and indicators.
   * @param name - Name of the strategy.
   * @param define - Strategy definition function that accepts a `Quote` and returns a `PositionType`.
   * @param indicators - Array of `Indicator` that can be used to determine the position in this strategy.
   */
  constructor(
    name: string,
    define: (quote: Quote<T>) => StrategyValue | undefined,
    indicators: Indicator<P, T>[]
  ) {
    this._name = name;
    this._define = define;
    this._indicators = indicators;
  }

  get name() {
    return this._name;
  }

  get indicators() {
    return this._indicators;
  }

  /**
   * Applies the strategy over a given quote and returns the strategy values.
   * @param quote - `Quote` on which strategy should be applied.
   * @returns `StrategyPoint`.
   */
  apply(quote: Quote<T>) {
    return this._define(quote);
  }

  /**
   * Backtests the strategy over a given Dataset and configuration, and returns the report.
   * @param dataset - `Dataset` on which strategy should be applied over each quote.
   * @param configuration - `BacktestConfiguration` that configures the backtest.
   * @returns `BacktestReport`.
   */
  backtest(
    dataset: Dataset<T>,
    configuration: BacktestConfiguration
  ): BacktestReport {
    return new Backtest(dataset, this).analyze(configuration);
  }
}
