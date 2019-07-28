import { Dataset, Quote } from '../../src';
import { SMA } from '../../src/indicators';
import { symbols } from '../../src/utils/symbols';

describe('Indicators: SMA', () => {
  const dataset5 = new Dataset([
    {
      [symbols.CLOSE]: 10,
      SMA: 10,
    },
    {
      [symbols.CLOSE]: 12,
      SMA: 12,
    },
    {
      [symbols.CLOSE]: 14,
      SMA: 14,
    },
    {
      [symbols.CLOSE]: 16,
      SMA: 16,
    },
    {
      [symbols.CLOSE]: 18,
      SMA: 18,
    },
  ]);

  it('Should return a valid value for a given quote.', () => {
    const quote = new Quote({ [symbols.CLOSE]: 20 });
    const expectedValue = 16;

    expect(SMA.calculate(quote, dataset5)).toBe(expectedValue);
  });

  it('Should return the same value as attribute if dataset has fewer points than range.', () => {
    const dataset = new Dataset([
      {
        [symbols.CLOSE]: 10,
        SMA: 10,
      },
      {
        [symbols.CLOSE]: 12,
        SMA: 12,
      },
      {
        [symbols.CLOSE]: 14,
        SMA: 14,
      },
    ]);
    const quote = new Quote({ [symbols.CLOSE]: 20 });
    const expectedValue = 20;

    expect(SMA.calculate(quote, dataset)).toBe(expectedValue);
  });

  it('Should return a valid value if dataset points are as equal as range.', () => {
    const dataset = new Dataset([
      {
        [symbols.CLOSE]: 10,
        SMA: 10,
      },
      {
        [symbols.CLOSE]: 12,
        SMA: 12,
      },
      {
        [symbols.CLOSE]: 14,
        SMA: 14,
      },
      {
        [symbols.CLOSE]: 16,
        SMA: 16,
      },
    ]);
    const quote = new Quote({ [symbols.CLOSE]: 20 });
    const expectedValue = 14.4;

    expect(SMA.calculate(quote, dataset)).toBe(expectedValue);
  });

  it('Should return a valid value for a given period.', () => {
    const quote = new Quote({ [symbols.CLOSE]: 20 });
    const expectedValue = 18;

    expect(SMA.set({ period: 3 }).calculate(quote, dataset5)).toBe(expectedValue);
  });

  it('Should return a valid value for any given attribute', () => {
    const dataset = new Dataset([
      {
        [symbols.HIGH]: 10,
        SMA: 10,
      },
      {
        [symbols.HIGH]: 12,
        SMA: 12,
      },
    ]);
    const quote = new Quote({ [symbols.HIGH]: 14 });
    const expectedValue = 12;

    expect(SMA.set({ period: 3, attribute: [symbols.HIGH] }).calculate(quote, dataset)).toBe(
      expectedValue,
    );
  });

  it('Should return NaN if attribute is not present', () => {
    const quote = new Quote({ [symbols.HIGH]: 20 });

    expect(SMA.calculate(quote, dataset5)).toBeNaN();
  });
});
