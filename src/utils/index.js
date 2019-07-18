export const toDouble = (value, fixed = 2) => +parseFloat(value).toFixed(fixed);

export default {
  toDouble,
};
