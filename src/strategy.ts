import { Dataset, Indicator, Backtest, BacktestReport } from './';
import { BacktestRunner } from './backtest';
import { TradePosition, TradePositionType } from './position';
import { Quote } from './quote';

export class StrategyValue {
  position: TradePositionType;

  constructor(position: TradePositionType = 'idle') {
    this.position = position;
  }
}

export interface StrategyOptions<P, T> {
  entryWhen: (quote: Quote<T>) => boolean;
  exitWhen: (quote: Quote<T>) => boolean;
  indicators?: Indicator<P, T>[];
  onTrigger?: (positionType: TradePositionType, quote: Quote<T>) => void;
}

/**
 * Defines a strategy that can be back-tested.
 */
export class Strategy<P = unknown, T = number> {
  protected _name: string;
  protected _options: StrategyOptions<P, T>;

  /**
   * Creates a strategy with definition and indicators.
   * @param name - Name of the strategy.
   * @param options - StrategyOptions.
   */
  constructor(name: string, options: StrategyOptions<P, T>) {
    this._name = name;
    this._options = options;
  }

  get name() {
    return this._name;
  }

  get options() {
    return this._options;
  }

  /**
   * Applies the strategy over a given quote and returns the strategy values.
   * @param quote - `Quote` on which strategy should be applied.
   * @param lastPosition - TradePositionType of the last quote.
   * @returns `StrategyValue`.
   */
  apply(quote: Quote<T>, lastPosition: TradePositionType = 'idle') {
    let newPosition: TradePositionType = 'idle';

    if (
      (lastPosition === 'hold' || lastPosition === 'entry') &&
      this._options.exitWhen(quote)
    ) {
      newPosition = 'exit';
    } else if (this._options.entryWhen(quote)) {
      newPosition = 'entry';
    }

    const updatedPosition = TradePosition.update(lastPosition, newPosition);
    this._options.onTrigger?.(updatedPosition, quote);

    return new StrategyValue(updatedPosition);
  }

  /**
   * Backtests the strategy over a given Dataset and configuration, and returns the report.
   * @param dataset - `Dataset` on which strategy should be applied over each quote.
   * @param configuration - `BacktestConfiguration` that configures the backtest.
   * @returns `BacktestReport`.
   */
  backtest(dataset: Dataset<T>, runner: BacktestRunner<T>): BacktestReport<T> {
    return new Backtest(dataset, this).run(runner);
  }
}
