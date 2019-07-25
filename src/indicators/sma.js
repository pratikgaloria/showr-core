import Indicator from '../indicator';
import { symbols } from '../utils/symbols';

const SMA = new Indicator('SMA', { period: 5, attribute: symbols.CLOSE }, function execute(
  quote,
  dataset,
) {
  const { period, attribute } = this.options;

  if (!period || dataset.value.length < period - 1) {
    return quote.value[attribute];
  }
  if (dataset.value.length === period - 1) {
    const total = dataset.value.reduce((acc, point) => acc + point.value[attribute], 0);
    return (quote.value[attribute] + total) / period;
  }

  const reversedDataset = dataset.value.slice(0).reverse();
  let total = quote.value[attribute];
  for (let i = 0; i < period - 1; i += 1) {
    total += reversedDataset[i].value[attribute];
  }

  return total / period;
});

export default SMA;
