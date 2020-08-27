import { Dataset, Quote, Indicator, Backtest } from '../src';
import { StrategyPoint } from '../src/strategy';
import { sampleIndicatorFn, sampleStrategy } from './mocks/mock-data';

describe('Quote', () => {
  describe('constructor', () => {
    it('Should create a valid Quote object for a given primitive value.', () => {
      const quote = new Quote(1);

      expect(quote).toHaveProperty('value');
      expect(quote.value).toHaveProperty('close');
      expect(quote.value.close).toBe(1);
    });

    it('Should create a valid Quote object for a given value and a key.', () => {
      const quote = new Quote(1.345, 'open');

      expect(quote.value).toStrictEqual({ open: 1.345 });
    });

    it('Should create a valid Quote object for a given object.', () => {
      const date = new Date();
      const quote = new Quote({
        date,
        open: 1.345,
        high: 5.44,
        low: 3.999,
        close: 5.0,
      });

      expect(quote.value).toStrictEqual({
        date,
        open: 1.345,
        high: 5.44,
        low: 3.999,
        close: 5,
      });
    });

    it('Should throw an error if a given value is not valid.', () => {
      expect(() => new Quote([1])).toThrow();
      expect(() => new Quote(null)).toThrow();
      expect(() => new Quote(undefined)).toThrow();
      expect(() => new Quote(() => {})).toThrow();
    });

    it('Should not throw an error if given value is 0.', () => {
      expect(() => new Quote('')).not.toThrow();
      expect(() => new Quote(0)).not.toThrow();
    });
  });

  describe('extend', () => {
    it('Should extend with a valid object value.', () => {
      const quote = new Quote(1);

      expect(quote.extend({ open: 2 }).value).toStrictEqual({
        open: 2,
        close: 1,
      });
    });

    it('Should not extend with an array.', () => {
      const quote = new Quote(1);

      expect(quote.extend([2]).value).toStrictEqual({
        close: 1,
      });
    });
  });

  describe('getIndicator', () => {
    it('Should return an indicator value if exists.', () => {
      const dataset = new Dataset([1, 2]);
      const multi5 = new Indicator(
        'multi5',
        sampleIndicatorFn
      );

      dataset.apply(multi5);
      dataset.quotes.forEach(q => {
        expect(q.getIndicator('multi5')).toBeTruthy();
      });
    });

    it("Should return undefined if indicator does't exists", () => {
      const ds = new Dataset([1, 2]);

      ds.quotes.forEach(q => {
        expect(q.getIndicator('multi5')).toBeUndefined();
      });
    });
  });

  describe('getIndicators', () => {
    it('Should return indicators of the quote if exists.', () => {
      const dataset = new Dataset([1, 2]);
      const multi2 = new Indicator(
        'multi2',
        sampleIndicatorFn
      );
      const multi5 = new Indicator(
        'multi5',
        sampleIndicatorFn
      );

      dataset.apply(multi2, multi5);
      dataset.quotes.forEach(q => {
        const indicators = q.getIndicators();
        expect(indicators).toHaveProperty('multi2');
        expect(indicators).toHaveProperty('multi5');
      });
    });

    it("Should return blank objects if indicators don't exists", () => {
      const ds = new Dataset([1, 2]);

      ds.quotes.forEach(q => {
        expect(q.getIndicators()).toStrictEqual({});
      });
    });
  });

  describe('getAttribute', () => {
    it('Should return attribute value if exists.', () => {
      const dataset = new Dataset([{ open: 1 }, { open: 3 }]);

      dataset.quotes.forEach(q => {
        expect(q.getAttribute('open')).toBe(q.value.open);
      });
    });

    it('Should return undefined if attribute doesn\'t exists.', () => {
      const dataset = new Dataset([1, 2]);

      dataset.quotes.forEach(q => {
        expect(q.getAttribute('open')).toBeUndefined();
      });
    });
  });

  describe('getStrategy', () => {
    it('Should return strategy point for if exists.', () => {
      const dataset = new Dataset([1, 2]);
      const strategy = sampleStrategy('new-strategy');
      const backtest = new Backtest(dataset, strategy);

      backtest.dataset.quotes.forEach(q => {
        expect(q.getStrategy('new-strategy')).toBeInstanceOf(StrategyPoint);
      })
    });

    it('Should return undefined if strategy doesn\'t exists.', () => {
      const dataset = new Dataset([1, 2]);
      
      dataset.quotes.forEach(q => {
        expect(q.getStrategy('new-strategy')).toBeUndefined();
      })
    });
  });

  describe('getStrategies', () => {
    it('Should return strategies if exists.', () => {
      const dataset = new Dataset([1, 2]);
      const strategy = sampleStrategy('new-strategy');
      const backtest = new Backtest(dataset, strategy);
      
      dataset.quotes.forEach(q => {
        const strategies = q.getStrategies();
        expect(strategies).toHaveProperty('new-strategy');
      });
    });

    it("Should return blank objects if strategies don't exists", () => {
      const ds = new Dataset([1, 2]);

      ds.quotes.forEach(q => {
        expect(q.getStrategies()).toStrictEqual({});
      });
    });
  });
});
