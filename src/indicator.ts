import { Dataset } from './dataset';
import { Quote } from './quote';

export interface IndicatorOptions {
  [key: string]: any;
  beforeCalculate?: (dataset: Dataset) => void;
}

/**
 * Creates a indicator that can be calculated over a dataset.
 */
export class Indicator {
  protected _name: string;
  protected _options: IndicatorOptions | undefined;
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
    options?: IndicatorOptions
  ) {
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
   * Extends each quote of the dataset with a calculated indicator value and returns a new dataset.
   * @param dataset - `Dataset`.
   * @returns A new `Dataset`.
   */
  spread(dataset: Dataset) {
    if (this.options && this.options.beforeCalculate) {
      this.options.beforeCalculate(dataset);
    }

    const emptyDataset = new Dataset();

    dataset.quotes.forEach((quote: Quote) => {
      const quoteWithIndicator = quote.extend({
        [this.name]: this.calculate(emptyDataset.add(quote)),
      });

      emptyDataset.update(quoteWithIndicator);
    });

    return dataset;
  }
}
