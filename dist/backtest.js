"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backtest = exports.BacktestReport = void 0;
const _1 = require("./");
const symbols_1 = require("./enums/symbols");
const strategy_1 = require("./strategy");
/**
 * Creates a back-test report.
 */
class BacktestReport {
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
        this.returns = 0;
    }
    updateCapital(value) {
        this.finalCapital += value;
    }
    updateTotals() {
        this.returns =
            ((this.finalCapital - this.initialCapital) * 100) / this.initialCapital;
        this.numberOfTrades += 1;
    }
    /**
     * Updates the capital according to the traded value after executing the entry position.
     * @param tradedValue - Traded value at the time.
     */
    markEntry(tradedValue) {
        this.updateCapital(-tradedValue);
    }
    /**
     * Updates the capital according to the traded value after executing the exit position.
     * @param tradedValue - Traded value at the time.
     */
    markExit(tradedValue) {
        this.updateCapital(tradedValue);
        if (this._currentCapital > this.finalCapital) {
            this.loss += this._currentCapital - this.finalCapital;
        }
        else {
            this.profit += this.finalCapital - this._currentCapital;
        }
        this._currentCapital = this.finalCapital;
        this.updateTotals();
    }
}
exports.BacktestReport = BacktestReport;
/**
 * Back-tests the strategy over a given dataset.
 */
class Backtest {
    /**
     * Runs back-test over a dataset for a given strategy that can be analyzed.
     * @param dataset - `Dataset` over which strategy should be back-tested.
     * @param strategy - `Strategy` that should be back-tested.
     */
    constructor(dataset, strategy) {
        this._strategy = strategy;
        this._dataset = dataset;
        this._dataset.apply(...strategy.indicators);
        const _position = new _1.Position('idle');
        this._dataset.quotes.forEach((quote) => {
            var _a;
            _position.update((_a = strategy.apply(quote)) === null || _a === void 0 ? void 0 : _a.position);
            quote.extend(Object.assign(Object.assign({}, quote.getStrategies()), { [strategy.name]: new strategy_1.StrategyPoint(_position.value) }), symbols_1.Keys.strategies);
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
    analyze(configuration) {
        const { attribute, tradingQuantity } = configuration;
        const report = new BacktestReport(configuration.capital);
        this._dataset.quotes.forEach((quote, index, array) => {
            var _a;
            const _positionValue = (_a = quote.getStrategy(this.strategy.name)) === null || _a === void 0 ? void 0 : _a.position;
            const _attributeValue = quote.getAttribute(attribute);
            const _tradeValue = _attributeValue * tradingQuantity;
            if (index === array.length - 1 &&
                (_positionValue === 'entry' || _positionValue === 'hold')) {
                report.markExit(_tradeValue);
            }
            else {
                if (_positionValue === 'entry') {
                    report.markEntry(_tradeValue);
                }
                else if (_positionValue === 'exit') {
                    report.markExit(_tradeValue);
                }
            }
        });
        return report;
    }
}
exports.Backtest = Backtest;
