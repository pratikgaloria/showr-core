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
     * Get quote indicator value by indicator name.
     * @param indicatorName - Name of the `Indicator`.
     * @returns Value of indicator if exists, `undefined` otherwise.
     */
    getIndicator(indicatorName: string): any;
    /**
     * Extends quote with the given attribute.
     * @param attribute - Any object.
     * @returns self reference.
     */
    extend(attribute: object, key?: string): this;
}
