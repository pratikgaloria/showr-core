import { Quote, Dataset, Indicator, BacktestConfiguration, BacktestReport } from './';
import { PositionType } from './position';
/**
 * Defines a strategy that can be back-tested.
 */
export declare class Strategy {
    protected _name: string;
    protected _define: (quote: Quote) => PositionType | undefined;
    protected _indicators: Indicator[];
    /**
     * Creates a strategy with definition and indicators.
     * @param name - Name of the strategy.
     * @param define - Strategy definition function that accepts a `Quote` and returns a `PositionType`.
     * @param indicators - Array of `Indicator` that can be used to determine the position in this strategy.
     */
    constructor(name: string, define: (quote: Quote) => PositionType | undefined, indicators: Indicator[]);
    get name(): string;
    get indicators(): Indicator[];
    /**
     * Applies the strategy over a given quote and returns the position.
     * @param quote - `Quote` on which strategy should be applied.
     * @returns `PositionType`.
     */
    apply(quote: Quote): "idle" | "entry" | "exit" | "hold" | undefined;
    /**
     * Backtests the strategy over a given Dataset and configuration, and returns the report.
     * @param dataset - `Dataset` on which strategy should be applied over each quote.
     * @param configuration - `BacktestConfiguration` that configures the backtest.
     * @returns `BacktestReport`.
     */
    backtest(dataset: Dataset, configuration: BacktestConfiguration): BacktestReport;
}
