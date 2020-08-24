export const getAllUniqueSubsets = (array: Array<any>): Array<Array<any>> =>
  array
    .reduce(
      (subsets, value) =>
        subsets.concat(subsets.map((set: Array<any>) => [value, ...set])),
      [[]]
    )
    .filter((item: Array<any>) => item.length);
