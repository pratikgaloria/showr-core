"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indicator = void 0;
const _1 = require("./");
const symbols_1 = require("./enums/symbols");
/**
 * Creates a indicator that can be calculated over a dataset.
 */
class Indicator {
    /**
     * Creates an indicator with definition and configuration.
     * @param name - Name of the indicator.
     * @param calculate - Indicator definition function that accepts the `Dataset` and returns a number.
     * @param options - Indicator configuration object.
     */
    constructor(name, calculate, options) {
        this._name = name;
        this._options = options;
        this._calculate = calculate;
    }
    get name() {
        return this.options && this.options.name ? this.options.name : this._name;
    }
    get options() {
        return this._options;
    }
    get calculate() {
        return this._calculate;
    }
    /**
     * Mutates each quote of the given dataset with a calculated indicator value.
     * @param dataset - `Dataset`.
     * @returns Mutated `Dataset`.
     */
    spread(dataset) {
        if (this.options && this.options.beforeCalculate) {
            this.options.beforeCalculate(dataset);
        }
        const emptyDataset = new _1.Dataset();
        dataset.quotes.forEach((quote) => {
            const quoteWithIndicator = quote.extend(Object.assign(Object.assign({}, quote.getIndicators()), { [this.name]: this.calculate(emptyDataset.add(quote)) }), symbols_1.Keys.indicators);
            emptyDataset.update(quoteWithIndicator);
        });
        return dataset;
    }
}
exports.Indicator = Indicator;
