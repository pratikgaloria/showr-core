"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const _1 = require("./");
/**
 * Defines a strategy that can be back-tested.
 */
class Strategy {
    /**
     * Creates a strategy with definition and indicators.
     * @param name - Name of the strategy.
     * @param define - Strategy definition function that accepts a `Quote` and returns a `PositionType`.
     * @param indicators - Array of `Indicator` that can be used to determine the position in this strategy.
     */
    constructor(name, define, indicators) {
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
     * Applies the strategy over a given quote and returns the position.
     * @param quote - `Quote` on which strategy should be applied.
     * @returns `PositionType`.
     */
    apply(quote) {
        return this._define(quote);
    }
    /**
     * Backtests the strategy over a given Dataset and configuration, and returns the report.
     * @param dataset - `Dataset` on which strategy should be applied over each quote.
     * @param configuration - `BacktestConfiguration` that configures the backtest.
     * @returns `BacktestReport`.
     */
    backtest(dataset, configuration) {
        return new _1.Backtest(dataset, this).analyze(configuration);
    }
}
exports.Strategy = Strategy;
