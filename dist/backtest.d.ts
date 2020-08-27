import { Dataset, Strategy } from './';
export interface BacktestConfiguration {
    capital: number;
    tradingQuantity: number;
    attribute: string;
    name?: string;
    symbol?: string;
}
/**
 * Creates a back-test report.
 */
export declare class BacktestReport {
    protected _currentCapital: number;
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
    constructor(initialCapital: any);
    private updateCapital;
    private updateTotals;
    /**
     * Updates the capital according to the traded value after executing the entry position.
     * @param tradedValue - Traded value at the time.
     */
    markEntry(tradedValue: number): void;
    /**
     * Updates the capital according to the traded value after executing the exit position.
     * @param tradedValue - Traded value at the time.
     */
    markExit(tradedValue: number): void;
}
/**
 * Back-tests the strategy over a given dataset.
 */
export declare class Backtest {
    protected _dataset: Dataset;
    protected _strategy: Strategy;
    /**
     * Runs back-test over a dataset for a given strategy that can be analyzed.
     * @param dataset - `Dataset` over which strategy should be back-tested.
     * @param strategy - `Strategy` that should be back-tested.
     */
    constructor(dataset: Dataset, strategy: Strategy);
    get strategy(): Strategy;
    get dataset(): Dataset;
    /**
     * Creates a report with profit and other metrics over a back-tested dataset.
     * @param configuration - `BacktestConfiguration` with trading quantity and capital.
     * @returns `BacktestReport`.
     */
    analyze(configuration: BacktestConfiguration): BacktestReport;
}
