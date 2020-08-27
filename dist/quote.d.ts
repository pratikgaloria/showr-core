import { StrategyPoint } from './strategy';
export declare type TQuote = {
    [key: string]: any;
};
/**
 * Creates a quote out of any value.
 */
export declare class Quote {
    protected _value: TQuote;
    /**
     * Creates a quote after type-casting the given value.
     * @param value - Any value.
     * @param symbol - `key` of the value when converted to the object.
     */
    constructor(value: any, symbol?: string);
    get value(): TQuote;
    static transform(valueToTransform: any, symbol?: string): TQuote;
    /**
     * Get value of the given attribute of the quote.
     * @param attribute - The attribute.
     * @returns The value of given attribute if exists, `undefined` otherwise.
     */
    getAttribute(attribute: string): any;
    /**
     * Get all indicator values.
     * @returns `indicators` object of the `Quote` if exists, blank object otherwise.
     */
    getIndicators(): any;
    /**
     * Get quote indicator value by indicator name.
     * @param indicatorName - Name of the `Indicator`.
     * @returns Value of indicator if exists, `undefined` otherwise.
     */
    getIndicator(indicatorName: string): any;
    /**
     * Get strategy values for the given quote.
     * @param strategyName - Name of the strategy.
     * @returns `StrategyPoint` object if strategy exists, `undefined` otherwise.
     */
    getStrategy(strategyName: string): StrategyPoint | undefined;
    /**
     * Get all strategy values.
     * @returns `strategies` object of the `Quote` if exists, blank object otherwise.
     */
    getStrategies(): any;
    /**
     * Extends quote with the given attribute.
     * @param attribute - Any object.
     * @returns self reference.
     */
    extend(attribute: object, key?: string): this;
}
