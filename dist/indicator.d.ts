import { Dataset } from './';
export interface IndicatorOptions {
    [key: string]: any;
    beforeCalculate?: (dataset: Dataset) => void;
}
/**
 * Creates a indicator that can be calculated over a dataset.
 */
export declare class Indicator {
    protected _name: string;
    protected _options: IndicatorOptions | undefined;
    protected _calculate: (dataset: Dataset) => number;
    /**
     * Creates an indicator with definition and configuration.
     * @param name - Name of the indicator.
     * @param calculate - Indicator definition function that accepts the `Dataset` and returns a number.
     * @param options - Indicator configuration object.
     */
    constructor(name: string, calculate: (dataset: Dataset) => number, options?: IndicatorOptions);
    get name(): any;
    get options(): IndicatorOptions | undefined;
    get calculate(): (dataset: Dataset) => number;
    /**
     * Extends each quote of the dataset with a calculated indicator value and returns a new dataset.
     * @param dataset - `Dataset`.
     * @returns A new `Dataset`.
     */
    spread(dataset: Dataset): Dataset;
}
