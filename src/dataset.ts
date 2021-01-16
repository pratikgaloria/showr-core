import { Quote, Indicator } from './';

/**
 * Creates a dataset out of data, where data is an array of any numeric values.
 */
export class Dataset {
  protected _value: Quote[];

  /**
   * Creates a dataset after type-casting given data values to quotes.
   * @param data - Array of `any` type of values or `Quote`.
   * @param [symbol] - If provided, each array item will be converted into a { key: value } pair where `key` would be a given symbol.
   */
  constructor(data?: any[], key?: string) {
    if (data) {
      this._value = data.map(d => {
        if (d instanceof Quote) {
          return d;
        }

        return new Quote(d, key);
      });
    } else {
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
  add(quote: Quote) {
    this._value.push(quote);

    return this;
  }

  /**
   * Updates the last quote of the dataset with the given quote.
   * @param quote - `Quote`.
   * @returns self reference.
   */
  update(quote: Quote) {
    this._value[this._value.length - 1] = quote;

    return this;
  }

  /**
   * Applies given indicators to every quotes of the dataset.
   * @param indicators - Array of `Indicator`.
   * @returns self reference.
   */
  apply(...indicators: Indicator<any>[]) {
    indicators.forEach(i => {
      i.spread(this);
    });

    return this;
  }

  /**
   * Flatten quote over an attribute
   * @param attribute - The attribute.
   * @returns flatten array.
   */
  flatten(attribute: string) {
    return this.quotes.map(q => q.getAttribute(attribute));
  }
}
