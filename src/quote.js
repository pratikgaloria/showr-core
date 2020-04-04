import errors from './utils/errors';

export class Quote {
  constructor(object) {
    if ((!object && object !== 0) || object instanceof Array) {
      throw new Error(errors.invalidQuoteValue);
    } else {
      this.value = object;
    }
  }
}
