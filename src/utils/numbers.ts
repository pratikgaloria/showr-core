export const tryParseFloat = (value: any) => {
  if (isNaN(parseFloat(value))) {
    return value;
  }

  return parseFloat(value);
};

export default {
  tryParseFloat,
};
