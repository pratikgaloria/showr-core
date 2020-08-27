"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quote = void 0;
const symbols_1 = require("./enums/symbols");
const numbers_1 = require("./utils/numbers");
/**
 * Creates a quote out of any value.
 */
class Quote {
    /**
     * Creates a quote after type-casting the given value.
     * @param value - Any value.
     * @param symbol - `key` of the value when converted to the object.
     */
    constructor(value, symbol) {
        this._value = Quote.transform(value, symbol);
    }
    get value() {
        return this._value;
    }
    static transform(valueToTransform, symbol = symbols_1.EnumSymbols.close) {
        if (typeof valueToTransform === 'number' ||
            typeof valueToTransform === 'string') {
            return {
                [symbol]: numbers_1.tryParseFloat(valueToTransform),
            };
        }
        else if (valueToTransform &&
            typeof valueToTransform === 'object' &&
            !(valueToTransform instanceof Array)) {
            return Object.keys(valueToTransform).reduce((q, k) => {
                return Object.assign(Object.assign({}, q), { [k]: numbers_1.tryParseFloat(valueToTransform[k]) });
            }, {});
        }
        else {
            throw new Error(`Invalid quote value: ${valueToTransform}`);
        }
    }
    /**
     * Get value of the given attribute of the quote.
     * @param attribute - The attribute.
     * @returns The value of given attribute if exists, `undefined` otherwise.
     */
    getAttribute(attribute) {
        return Object.prototype.hasOwnProperty.call(this._value, attribute)
            ? this._value[attribute]
            : undefined;
    }
    /**
     * Get all indicator values.
     * @returns `indicators` object of the `Quote` if exists, blank object otherwise.
     */
    getIndicators() {
        return Object.prototype.hasOwnProperty.call(this._value, symbols_1.Keys.indicators)
            ? this._value[symbols_1.Keys.indicators]
            : {};
    }
    /**
     * Get quote indicator value by indicator name.
     * @param indicatorName - Name of the `Indicator`.
     * @returns Value of indicator if exists, `undefined` otherwise.
     */
    getIndicator(indicatorName) {
        if (Object.prototype.hasOwnProperty.call(this._value, symbols_1.Keys.indicators) &&
            !!this._value[symbols_1.Keys.indicators][indicatorName]) {
            return this._value[symbols_1.Keys.indicators][indicatorName];
        }
        return undefined;
    }
    /**
     * Get strategy values for the given quote.
     * @param strategyName - Name of the strategy.
     * @returns `StrategyPoint` object if strategy exists, `undefined` otherwise.
     */
    getStrategy(strategyName) {
        if (Object.prototype.hasOwnProperty.call(this._value, symbols_1.Keys.strategies) &&
            !!this._value[symbols_1.Keys.strategies][strategyName]) {
            return this._value[symbols_1.Keys.strategies][strategyName];
        }
        return undefined;
    }
    /**
     * Get all strategy values.
     * @returns `strategies` object of the `Quote` if exists, blank object otherwise.
     */
    getStrategies() {
        return Object.prototype.hasOwnProperty.call(this._value, symbols_1.Keys.strategies)
            ? this._value[symbols_1.Keys.strategies]
            : {};
    }
    /**
     * Extends quote with the given attribute.
     * @param attribute - Any object.
     * @returns self reference.
     */
    extend(attribute, key) {
        if (!(attribute instanceof Array)) {
            Object.assign(this._value, key ? { [key]: attribute } : attribute);
        }
        return this;
    }
}
exports.Quote = Quote;
