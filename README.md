# showr-core

![Travis (.org)](https://img.shields.io/travis/pratikgaloria/showr-core.svg)
[![Coverage Status](https://coveralls.io/repos/github/pratikgaloria/showr-core/badge.svg?branch=master)](https://coveralls.io/github/pratikgaloria/showr-core?branch=master)
[![npm (scoped)](https://img.shields.io/npm/v/@showr/core.svg)](https://www.npmjs.com/package/@showr/core)
![GitHub issues](https://img.shields.io/github/issues/pratikgaloria/showr-core.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/@showr/core.svg)

Showr: Open source JavaScript library to generate technical indicators over stock market data sets.

## Usage

### Indicators

Each Indicator has an `calculate` function to calculate the value, it accepts below parameters:

1. `quote`: OHLC quote for which you need to generate an Indicator
2. `dataset`: Historical dataset consist of one or more OHLC quotes.

Example:

#### Importing indicator

```JavaScript
import { SMA } from '@showr/core/indicators';
```

#### Using indicator

```JavaScript
// Historical dataset
const dataset = new Dataset([{
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
}]);

// Latest point
const quote = new Quote({
  timestamp: '07/22/2019T09:30:00Z',
  open: 145,
  high: 160,
  low: 140,
  close: 150,
});

// Calculate SMA (Simple Moving Average) for a given Point over last 3 periods.
console.log(SMA.calculate(quote, dataset)); // 145

```
