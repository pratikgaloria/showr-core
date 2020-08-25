import { Quote, Indicator } from './';
/**
 * Creates a dataset out of data, where data is an array of any numeric values.
 */
export declare class Dataset {
    protected _value: Quote[];
    /**
     * Creates a dataset after type-casting given data values to quotes.
     * @param data - Array of `any` type of values or `Quote`.
     * @param [symbol] - If provided, each array item will be converted into a { key: value } pair where `key` would be a given symbol.
     */
    constructor(data?: any[], key?: string);
    get value(): import("./quote").TQuote[];
    get quotes(): Quote[];
    /**
     * Adds a given quote to the end of the dataset.
     * @param quote - `Quote`.
     * @returns self reference.
     */
    add(quote: Quote): this;
    /**
     * Updates the last quote of the dataset with the given quote.
     * @param quote - `Quote`.
     * @returns self reference.
     */
    update(quote: Quote): this;
    /**
     * Applies given indicators to every quotes of the dataset.
     * @param indicators - Array of `Indicator`.
     * @returns self reference.
     */
    apply(...indicators: Indicator[]): this;
}
