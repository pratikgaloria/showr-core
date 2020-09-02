import { Dataset, Quote } from './';
import { Keys } from './enums/symbols.enum';

export interface IndicatorOptions<T> {
  params?: T;
  beforeCalculate?: (dataset: Dataset) => void;
}

/**
 * Creates a indicator that can be calculated over a dataset.
 */
export class Indicator<T> {
  protected _name: string;
  protected _options?: IndicatorOptions<T>;
  protected _calculate: (dataset: Dataset) => number;

  /**
   * Creates an indicator with definition and configuration.
   * @param name - Name of the indicator.
   * @param calculate - Indicator definition function that accepts the `Dataset` and returns a number.
   * @param options - Indicator configuration object.
   */
  constructor(
    name: string,
    calculate: (dataset: Dataset) => number,
    options?: IndicatorOptions<T>
  ) {
    this._name = name;
    this._calculate = calculate;
    this._options = options;
  }

  get name() {
    return this._name;
  }

  get options() {
    return this._options;
  }

  get params() {
    return this._options?.params;
  }

  get calculate() {
    return this._calculate;
  }

  /**
   * Mutates each quote of the given dataset with a calculated indicator value.
   * @param dataset - `Dataset`.
   * @returns Mutated `Dataset`.
   */
  spread(dataset: Dataset) {
    if (this.options && this.options.beforeCalculate) {
      this.options.beforeCalculate(dataset);
    }

    const emptyDataset = new Dataset();
    dataset.quotes.forEach((quote: Quote) => {
      const quoteWithIndicator = quote.extend(
        {
          ...quote.getIndicators(),
          [this.name]: this.calculate(emptyDataset.add(quote)),
        },
        Keys.indicators
      );

      emptyDataset.update(quoteWithIndicator);
    });

    return dataset;
  }
}
