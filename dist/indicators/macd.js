"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MACD = void 0;
const indicator_1 = require("../indicator");
const symbols_1 = require("../enums/symbols");
const ema_1 = require("./ema");
class MACD extends indicator_1.Indicator {
    constructor(options) {
        super('MACD', function (dataset) {
            const datasetLength = dataset.value.length;
            if (datasetLength === 1) {
                return 0;
            }
            return (dataset.value[datasetLength - 1][symbols_1.Keys.indicators].ema12 -
                dataset.value[datasetLength - 1][symbols_1.Keys.indicators].ema26);
        }, options);
        this._options = Object.assign({}, options);
        this._options.beforeCalculate = (dataset) => {
            const ema12 = new ema_1.EMA({
                name: 'ema12',
                period: 12,
                attribute: this._options.attribute,
            });
            const ema26 = new ema_1.EMA({
                name: 'ema26',
                period: 26,
                attribute: this._options.attribute,
            });
            dataset.apply(ema12, ema26);
        };
    }
}
exports.MACD = MACD;
