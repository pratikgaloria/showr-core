export const getAllUniqueSubsets = (array: any[]): any[][] =>
  array
    .reduce(
      (subsets, value) =>
        subsets.concat(subsets.map((set: any[]) => [value, ...set])),
      [[]]
    )
    .filter((item: any[]) => item.length);

export const getAverageGain = (array: number[], period: number) => {
  const datasetLength = array.length;
  const requiredLength = period + 1;

  if (datasetLength < requiredLength) {
    return undefined;
  }

  let averageGain = 0;
  for (let i = datasetLength - 2; i > datasetLength - requiredLength; i--) {
    const currentValue = array[i];
    const previousValue = array[i - 1];

    const difference = currentValue - previousValue;
    averageGain += difference > 0 ? difference : 0;
  }

  return averageGain / period;
};

export const getAverageLoss = (array: number[], period: number) => {
  const datasetLength = array.length;
  const requiredLength = period + 1;

  if (datasetLength < requiredLength) {
    return undefined;
  }

  let averageLoss = 0;
  for (let i = datasetLength - 2; i > datasetLength - requiredLength; i--) {
    const currentValue = array[i];
    const previousValue = array[i - 1];

    const difference = currentValue - previousValue;
    averageLoss += difference < 0 ? -difference : 0;
  }

  return averageLoss / period;
};
