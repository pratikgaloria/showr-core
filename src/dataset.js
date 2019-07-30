import Quote from './quote';
import Indicator from './indicator';
import Algorithm from './algorithm';
import errors from './utils/errors';

class Dataset {
  constructor(object) {
    if (object instanceof Array) {
      this.value = object.map(quote => new Quote(quote));
    } else {
      this.value = new Array(new Quote(object));
    }
  }

  apply(...indicators) {
    const self = this;

    indicators.forEach((indicator) => {
      if (indicator instanceof Indicator) {
        self.value.forEach(quote => Object.assign(quote, {
          [indicator.name]: indicator.calculate(quote, self),
        }));
      } else {
        throw new Error(errors.invalidIndicator);
      }
    });

    return self;
  }

  backtest(...algorithms) {
    const self = this;

    algorithms.forEach((algorithm) => {
      if (algorithm instanceof Algorithm) {
        self.value.forEach(quote => Object.assign(quote, {
          backtest: {
            ...quote.backtest,
            [algorithm.name]: algorithm.execute(quote, self),
          },
        }));
      } else {
        throw new Error(errors.invalidAlgorithm);
      }
    });

    return self;
  }
}

export default Dataset;
