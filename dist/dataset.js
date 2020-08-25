"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dataset = void 0;
const _1 = require("./");
const symbols_1 = require("./enums/symbols");
/**
 * Creates a dataset out of data, where data is an array of any numeric values.
 */
class Dataset {
    /**
     * Creates a dataset after type-casting given data values to quotes.
     * @param data - Array of `any` type of values or `Quote`.
     * @param [symbol] - If provided, each array item will be converted into a { key: value } pair where `key` would be a given symbol.
     */
    constructor(data, key) {
        if (data) {
            this._value = data.map(d => {
                if (d instanceof _1.Quote) {
                    return d;
                }
                return new _1.Quote(d, key);
            });
        }
        else {
            this._value = [];
        }
    }
    get value() {
        return this._value.map(q => q.value);
    }
    get quotes() {
        return this._value.map(q => q);
    }
    /**
     * Adds a given quote to the end of the dataset.
     * @param quote - `Quote`.
     * @returns self reference.
     */
    add(quote) {
        this._value.push(quote);
        return this;
    }
    /**
     * Updates the last quote of the dataset with the given quote.
     * @param quote - `Quote`.
     * @returns self reference.
     */
    update(quote) {
        this._value[this._value.length - 1] = quote;
        return this;
    }
    /**
     * Applies given indicators to every quotes of the dataset.
     * @param indicators - Array of `Indicator`.
     * @returns self reference.
     */
    apply(...indicators) {
        const emptyDataset = new Dataset();
        this._value.forEach((quote) => {
            emptyDataset.add(quote);
            quote.extend(indicators.reduce((q, i) => (Object.assign(Object.assign({}, q), { [i.name]: i.calculate(emptyDataset) })), {}), symbols_1.Keys.indicators);
        });
        return this;
    }
}
exports.Dataset = Dataset;
