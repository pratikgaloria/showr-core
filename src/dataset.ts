import { Quote, Indicator } from './';

/**
 * Creates a dataset out of data, where data is an array of any numeric values.
 */
export class Dataset<T = number> {
  protected _value: Quote<T>[];

  /**
   * Creates a dataset after type-casting given data values to quotes.
   * @param data - Array of `any` type of values or `Quote`.
   * @param [symbol] - If provided, each array item will be converted into a { key: value } pair where `key` would be a given symbol.
   */
  constructor(data?: T[]) {
    if (data) {
      this._value = data.map((d) => {
        if (d instanceof Quote) {
          return d;
        }

        return new Quote(d);
      });
    } else {
      this._value = [];
    }
  }

  get value() {
    return this._value.map((q) => q.value);
  }

  get quotes() {
    return this._value.map((q) => q);
  }

  /**
   * Get quote at the given zero based position
   * @param position - number, where 0 is first index, and -1 is the last index.
   * @returns - `Quote` if found or undefined.
   */
  at(position: number) {
    if (position < 0) {
      return this.quotes[this._value.length + position];
    } else {
      return this.quotes[position];
    }
  }

  /**
   * Adds a given quote to the end of the dataset.
   * @param quote - `Quote`.
   * @returns self reference.
   */
  add(quote: Quote<T>) {
    this._value.push(quote);

    return this;
  }

  /**
   * Updates the last quote of the dataset with the given quote.
   * @param quote - `Quote`.
   * @returns self reference.
   */
  update(quote: Quote<T>) {
    this._value[this._value.length - 1] = quote;

    return this;
  }

  /**
   * Applies given indicators to every quotes of the dataset.
   * @param indicators - Array of `Indicator`.
   * @returns self reference.
   */
  apply(...indicators: Indicator<unknown, T>[]) {
    indicators.forEach((i) => {
      i.spread(this);
    });

    return this;
  }

  /**
   * Flatten quote over an attribute
   * @param attribute - The attribute.
   * @returns flatten array.
   */
  flatten(attribute?: string) {
    return this.quotes.map((q) =>
      attribute ? q.getAttribute(attribute) : q.value
    );
  }

  /**
   * get Value of the quote at the given position
   * @param position - number, where 0 is first index, and -1 is the last index.
   * @param attribute - Value of a specific attribute if any (Optional)
   * @returns value.
   */
  valueAt(position: number, attribute?: string) {
    const relativePosition =
      position < 0 ? this._value.length + position : position;

    return attribute
      ? this.quotes[relativePosition].getAttribute(attribute)
      : this.quotes[relativePosition].value;
  }
}
