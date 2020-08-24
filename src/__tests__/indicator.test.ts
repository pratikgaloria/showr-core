import { Indicator } from '../indicator';
import { Dataset } from '../dataset';

describe('Indicator', () => {
  describe('constructor', () => {
    it('Should create a valid Indicator object.', () => {
      const mockFn = jest.fn();
      const indicator = new Indicator('add1', mockFn);

      expect(indicator).toHaveProperty('name');
      expect(indicator.name).toBe('add1');

      expect(indicator).toHaveProperty('calculate');
      const ds = new Dataset([1]);
      indicator.calculate(new Dataset([1]));
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith(ds);
    });

    it('Should create a valid Indicator object with options.', () => {
      const indicator = new Indicator(
        'sma',
        function(this: Indicator, ds: Dataset) {
          return ds.value[0].close / this.options?.period;
        },
        { name: 'sma5', period: 5 }
      );

      expect(indicator).toHaveProperty('options');
      expect(indicator.options).toHaveProperty('name');
      expect(indicator.options).toHaveProperty('period');

      expect(indicator.name).toBe('sma5');
      expect(indicator.calculate(new Dataset([1]))).toBe(0.2);
    });
  });

  describe('Spread', () => {
    it('Should spread the indicator through-out the dataset', () => {
      const ds = new Dataset([1, 2]);
      const multi5 = new Indicator(
        'multi5',
        ds => ds.value[ds.value.length - 1].close * 5
      );

      const dsWithMulti5 = multi5.spread(ds);
      expect(dsWithMulti5).toBeInstanceOf(Dataset);
      expect(dsWithMulti5.value).toStrictEqual([
        {
          close: 1,
          multi5: 5,
        },
        {
          close: 2,
          multi5: 10,
        },
      ]);
    });

    it('Should call beforeCalculate() if defined with options while spreading.', () => {
      const ds = new Dataset([1, 2]);
      const mockBeforeCalculateFn = jest.fn();
      const multi5 = new Indicator(
        'multi5',
        ds => ds.value[ds.value.length - 1].close * 5,
        {
          beforeCalculate: mockBeforeCalculateFn,
        }
      );

      const dsWithMulti5 = multi5.spread(ds);
      expect(mockBeforeCalculateFn).toHaveBeenCalled();
    });
  });
});
