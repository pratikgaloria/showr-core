"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMA = void 0;
const indicator_1 = require("../indicator");
const symbols_1 = require("../enums/symbols");
class SMA extends indicator_1.Indicator {
    constructor(options) {
        super('SMA', function (dataset) {
            const { period = 5, attribute = symbols_1.EnumSymbols.close } = this._options;
            const datasetLength = dataset.value.length;
            if (datasetLength < period) {
                return dataset.quotes[datasetLength - 1].value[attribute];
            }
            let total = 0;
            for (let i = datasetLength - period; i < datasetLength; i++) {
                total += dataset.quotes[i].value[attribute];
            }
            return total / period;
        }, options);
        this._options = Object.assign({}, options);
    }
}
exports.SMA = SMA;
