import { EnumSymbols, Keys } from './enums/symbols';
import { tryParseFloat } from './utils/numbers';

export type TQuote = {
  [key: string]: any;
};

/**
 * Creates a quote out of any value.
 */
export class Quote {
  protected _value: TQuote;

  /**
   * Creates a quote after type-casting the given value.
   * @param value - Any value.
   * @param symbol - `key` of the value when converted to the object.
   */
  constructor(value: any, symbol?: string) {
    this._value = Quote.transform(value, symbol);
  }

  get value() {
    return this._value;
  }

  static transform(
    valueToTransform: any,
    symbol: string = EnumSymbols.close
  ): TQuote {
    if (
      typeof valueToTransform === 'number' ||
      typeof valueToTransform === 'string'
    ) {
      return {
        [symbol]: tryParseFloat(valueToTransform),
      };
    } else if (
      valueToTransform &&
      typeof valueToTransform === 'object' &&
      !(valueToTransform instanceof Array)
    ) {
      return Object.keys(valueToTransform).reduce((q: any, k: string) => {
        return {
          ...q,
          [k]: tryParseFloat(valueToTransform[k]),
        };
      }, {});
    } else {
      throw new Error(`Invalid quote value: ${valueToTransform}`);
    }
  }

  /**
   * Get quote indicator value by indicator name.
   * @param indicatorName - Name of the `Indicator`.
   * @returns Value of indicator if exists, `undefined` otherwise.
   */
  getIndicator(indicatorName: string) {
    if (
      this._value[Keys.indicators] &&
      this._value[Keys.indicators][indicatorName]
    ) {
      return this._value[Keys.indicators][indicatorName];
    }
    return undefined;
  }

  /**
   * Extends quote with the given attribute.
   * @param attribute - Any object.
   * @returns self reference.
   */
  extend(attribute: object, key?: string) {
    if (!(attribute instanceof Array)) {
      Object.assign(this._value, key ? { [key]: attribute } : attribute);
    }

    return this;
  }
}
