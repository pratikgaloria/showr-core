import Indicator from './utils/indicator';
import { symbols } from './utils/symbols';

export const SMA = new Indicator('SMA', { period: 5, attribute: symbols.CLOSE }, function execute(
  point,
  dataset,
) {
  const { period, attribute } = this.options;

  if (dataset.length < period - 1) {
    return point[attribute];
  }

  if (dataset.length === period - 1) {
    const total = dataset.reduce((acc, data) => acc + data[attribute], 0);
    return (point[attribute] + total) / period;
  }

  const reverseDataset = dataset.slice(0).reverse();
  let total = point[attribute];
  for (let i = 0; i < period - 1; i += 1) {
    total += reverseDataset[i][attribute];
  }

  return total / period;
});

export default {
  SMA,
};
