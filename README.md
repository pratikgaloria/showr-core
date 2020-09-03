# showr-core

![Travis (.org)](https://img.shields.io/travis/pratikgaloria/showr-core.svg)
[![Coverage Status](https://coveralls.io/repos/github/pratikgaloria/showr-core/badge.svg?branch=master)](https://coveralls.io/github/pratikgaloria/showr-core?branch=master)
[![npm (scoped)](https://img.shields.io/npm/v/@showr/core.svg)](https://www.npmjs.com/package/@showr/core)
![GitHub issues](https://img.shields.io/github/issues/pratikgaloria/showr-core.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/@showr/core.svg)

showr-core is a library built with Typescript that allows you to define efficient trading strategy to gain profits during a live market. You can use and combine hundreds of technical indicators to define your strategy or you can create your own technical indicator.

Its powerful API also allows you to backtest your strategy over a historical data before putting it in action.

# Features

This open-source library lets you create your own trading strategy and apply the same during the live market. Some of the features are:
- [x] Use hundreds of in-built technical indicators or create your own.
- [x] Define trading strategies using combination of indicators, rules and configuration. 
- [x] Backtest your trading strategy over any historical dataset.
- [ ] Test your strategy over a live market.

# Installation
```bash
npm i --save @showr/core
```
or
```bash
yarn add @showr/core
```

# Usage
You can import available classes and helpers from the main library.
```javascript
import { Dataset, Indicator } from '@showr/core';
// or
const { Dataset, Indicator } = require('@showr/core');
```
See complete API [documentation](https://pratikgaloria.github.io/showr-core) for all the available classes and methods.

# API

## Dataset
Dataset can be created out of any data which should in a form of an array. Dataset allows you to apply indicators over each data point and you can backtest your trading strategy over any Dataset.

```javascript
import { Dataset } from '@showr/core';

const ds = new Dataset([10, 12.5, 11], 'close');

console.log(ds.value); // [{ close: 10 }, { close: 12.5 }, { close: 11 }]
```
You can provide any array containing objects or numbers and that will be converted into a Dataset object, which later can be used to perform various operations like backtesting.

## Indicator

The outstanding advantage of this library is that you can create your own technical indicator and then use it for defining trading strategies.

All you need is to define a `calculate` function for the indicator you are creating and then you can apply it over your Dataset.

For example, you can create indicator that multiplies the quote value with golden ratio.
```Typescript
import { Dataset, Indicator } from '@showr/core';
import _ from 'lodash'; // Optional

const goldenR = new Indicator('goldenR', (ds: Dataset) => {
    const lastQuote = _.last(ds.quotes);
    return lastQuote.getAttribute('close') * 1.61;
});
```
Now create a dataset and apply the above indicator to it.
```JavaScript
// ...
const ds = new Dataset([10, 20, 30], 'close');
ds.apply(goldenR);

console.log(ds.quotes); // [{ close: 10, indicators: { goldenR: 16.1 }}, ... ]
console.log(_.last(ds.quotes).getIndicator('goldenR')); // 16.1
```

Learn more about creating indicators with Parameter in API documentation.

In-built indicators are provided in a stand-alone library [@showr/indicators](https://www.npmjs.com/package/@showr/indicators) and you can directly import them inside your project.

For example,
```JavaScript
import { Dataset } from '@showr/core';
import { SMA } from '@showr/indicators';

const ds = new Dataset([10, 20, 30]);

const sma2 = new SMA('sma2', { period: 2 });
ds.apply(sma2);

console.log(_.last(ds.quotes).getIndicator('sma2')); // 25
```