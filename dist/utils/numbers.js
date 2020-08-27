"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseFloat = void 0;
exports.tryParseFloat = (value) => {
    if (typeof value === 'object' || isNaN(Number(value))) {
        return value;
    }
    return parseFloat(value);
};
exports.default = {
    tryParseFloat: exports.tryParseFloat,
};
