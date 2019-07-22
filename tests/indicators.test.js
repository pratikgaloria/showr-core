import { SMA } from '../src/indicators';
import { symbols } from '../src/utils/symbols';

describe('Indicators', () => {
  describe('SMA', () => {
    const dataset5 = [
      {
        [symbols.CLOSE]: 10,
      },
      {
        [symbols.CLOSE]: 12,
      },
      {
        [symbols.CLOSE]: 14,
      },
      {
        [symbols.CLOSE]: 16,
      },
      {
        [symbols.CLOSE]: 18,
      },
    ];

    it('Should return a valid value for a given point.', () => {
      const point = { [symbols.CLOSE]: 20 };
      const expectedValue = 16;

      expect(SMA.value(point, dataset5)).toBe(expectedValue);
    });

    it('Should return the same value as attribute if dataset has fewer points than range.', () => {
      const dataset = [
        {
          [symbols.CLOSE]: 10,
        },
        {
          [symbols.CLOSE]: 12,
        },
        {
          [symbols.CLOSE]: 14,
        },
      ];
      const point = { [symbols.CLOSE]: 20 };
      const expectedValue = 20;

      expect(SMA.value(point, dataset)).toBe(expectedValue);
    });

    it('Should return a valid value if dataset points are as equal as range.', () => {
      const dataset = [
        {
          [symbols.CLOSE]: 10,
        },
        {
          [symbols.CLOSE]: 12,
        },
        {
          [symbols.CLOSE]: 14,
        },
        {
          [symbols.CLOSE]: 16,
        },
      ];
      const point = { [symbols.CLOSE]: 20 };
      const expectedValue = 14.4;

      expect(SMA.value(point, dataset)).toBe(expectedValue);
    });

    it('Should return a valid value for a given period.', () => {
      const point = { [symbols.CLOSE]: 20 };
      const expectedValue = 18;

      expect(SMA.set({ period: 3 }).value(point, dataset5)).toBe(expectedValue);
    });

    it('Should return a valid value for any given attribute', () => {
      const dataset = [
        {
          [symbols.HIGH]: 10,
        },
        {
          [symbols.HIGH]: 12,
        },
      ];
      const point = { [symbols.HIGH]: 14 };
      const expectedValue = 12;

      expect(SMA.set({ period: 3, attribute: symbols.HIGH }).value(point, dataset)).toBe(
        expectedValue,
      );
    });

    it('Should return NaN if attribute is not present', () => {
      const point = { [symbols.HIGH]: 20 };

      expect(SMA.value(point, dataset5)).toBeNaN();
    });
  });
});
