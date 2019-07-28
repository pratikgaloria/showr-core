import Quote from './quote';
import Indicator from './indicator';

class Dataset {
  constructor(object) {
    this.value = [];

    if (object instanceof Array) {
      this.value = object.map(quote => new Quote(quote));
    }
  }

  apply(...indicators) {
    const self = this;

    indicators.forEach((indicator) => {
      if (indicator instanceof Indicator) {
        self.forEach(quote => Object.assign(quote, {
          [indicator.name]: indicator.calculate(quote, self),
        }));
      }

      throw new Error('Not a valid Indicator.');
    });

    return self;
  }
}

export default Dataset;
