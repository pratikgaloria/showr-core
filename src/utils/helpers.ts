export const getAllUniqueSubsets = (array: any[]): any[][] =>
  array
    .reduce(
      (subsets, value) =>
        subsets.concat(subsets.map((set: any[]) => [value, ...set])),
      [[]]
    )
    .filter((item: any[]) => item.length);
