import { Indicator, Dataset } from '../src';
import { Keys } from '../src/enums/symbols.enum';
import { sampleIndicatorFn } from './mocks/mock-data';

interface SampleIndicatorParams {
  period?: number;
}

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
      const indicator = new Indicator<SampleIndicatorParams>(
        'sma5',
        function(this: Indicator<SampleIndicatorParams>, ds: Dataset) {
          const { period = 10 } = this.params as SampleIndicatorParams;

          return ds.value[0].close / period;
        },
        { params: { period: 5 } }
      );

      expect(indicator).toHaveProperty('params');
      expect(indicator.params).toHaveProperty('period');

      expect(indicator.name).toBe('sma5');
      expect(indicator.calculate(new Dataset([1]))).toBe(0.2);
    });
  });

  describe('params', () => {
    it('Should return undefined if params are not provided.', () => {
      const mockFn = jest.fn();
      const indicator = new Indicator<SampleIndicatorParams>('add1', mockFn);

      expect(indicator).toHaveProperty('params');
      expect(indicator.params).toBeUndefined();
    });
  });

  describe('Spread', () => {
    it('Should spread the indicator through-out the dataset', () => {
      const dataset = new Dataset([1, 2]);
      const multi5 = new Indicator(
        'multi5',
        sampleIndicatorFn
      );

      multi5.spread(dataset);

      expect(dataset).toBeInstanceOf(Dataset);
      expect(dataset.value).toStrictEqual([
        {
          close: 1,
          [Keys.indicators]: {
            'multi5': 5,
          }
        },
        {
          close: 2,
          [Keys.indicators]: {
            'multi5': 10,
          }
        },
      ]);
    });

    it('Should call beforeCalculate() if defined with options while spreading.', () => {
      const dataset = new Dataset([1, 2]);
      const mockBeforeCalculateFn = jest.fn();
      const multi5 = new Indicator(
        'multi5',
        sampleIndicatorFn,
        {
          beforeCalculate: mockBeforeCalculateFn,
        }
      );

      multi5.spread(dataset);
      expect(mockBeforeCalculateFn).toHaveBeenCalled();
    });
  });
});
