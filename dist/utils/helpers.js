"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUniqueSubsets = void 0;
exports.getAllUniqueSubsets = (array) => array
    .reduce((subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])), [[]])
    .filter((item) => item.length);
