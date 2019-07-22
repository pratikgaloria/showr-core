# showr-core

![Travis (.org)](https://img.shields.io/travis/pratikgaloria/showr-core.svg)
[![Coverage Status](https://coveralls.io/repos/github/pratikgaloria/showr-core/badge.svg?branch=master)](https://coveralls.io/github/pratikgaloria/showr-core?branch=master)
[![npm (scoped)](https://img.shields.io/npm/v/@showr/core.svg)](https://www.npmjs.com/package/@showr/core)
![GitHub issues](https://img.shields.io/github/issues/pratikgaloria/showr-core.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/@showr/core.svg)

Showr: Open source JavaScript library to generate technical indicators over stock market data sets.

## Usage

### Indicators

To generate a value over any point, call `value` function of any indicator. This function accepts below parameters:

1. `point`: OHLC data point for which you need to generate an Indicator
2. `dataset`: Historical dataset consisting OHLC data points.
3. `options`: Other options for an indicator. For example, range, period etc.

To set custom options, use `set` function of any indicator.

Example:

#### Importing indicator

```JavaScript
import { SMA } from '@showr/core/indicators';
```

#### Using indicator

```JavaScript
// Historical dataset
const dataset = [{
  timestamp: '07/20/2019T09:30:00Z',
  open: 142,
  high: 145,
  low: 135,
  close: 140,
}, {
  timestamp: '07/21/2019T09:30:00Z',
  open: 140,
  high: 150,
  low: 130,
  close: 145,
}];

// Latest point
const point = {
  timestamp: '07/22/2019T09:30:00Z',
  open: 145,
  high: 160,
  low: 140,
  close: 150,
};

// To calculate a simple moving average for a given Point over the last 3 periods.
console.log(SMA.set({ period: 3}).value(point, dataset)); // 145

```
