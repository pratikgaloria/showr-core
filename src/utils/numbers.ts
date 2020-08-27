export const tryParseFloat = (value: any) => {
  if (typeof value === 'object' || isNaN(Number(value))) {
    return value;
  }

  return parseFloat(value);
};

export default {
  tryParseFloat,
};
