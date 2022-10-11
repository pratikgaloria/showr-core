//import '@types/jest';
import { TradePosition } from '../src/position';

describe('Position', () => {
  describe('constructor', () => {
    it('Should return a valid Position object.', () => {
      const position = new TradePosition('idle');

      expect(position).toHaveProperty('value');
      expect(position.value).toBe('idle');
    });
  });

  describe('update', () => {
    describe('Should update the correct position', () => {
      describe('if current position is idle', () => {
        it('and new position is entry', () => {
          expect(TradePosition.update('idle', 'entry')).toBe('entry');
        });

        it('and new position is other than entry', () => {
          expect(TradePosition.update('idle', 'idle')).toBe('idle');
          expect(TradePosition.update('idle', 'exit')).toBe('idle');
          expect(TradePosition.update('idle', 'hold')).toBe('idle');
        });
      });

      describe('if current position is entry', () => {
        it('and new position is exit', () => {
          expect(TradePosition.update('entry', 'exit')).toBe('exit');
        });

        it('and new position is other than exit', () => {
          expect(TradePosition.update('entry', 'idle')).toBe('hold');
          expect(TradePosition.update('entry', 'entry')).toBe('hold');
          expect(TradePosition.update('entry', 'hold')).toBe('hold');
        });
      });

      describe('if current position is hold', () => {
        it('and new position is exit', () => {
          expect(TradePosition.update('hold', 'exit')).toBe('exit');
        });

        it('and new position is other than exit', () => {
          expect(TradePosition.update('hold', 'idle')).toBe('hold');
          expect(TradePosition.update('hold', 'entry')).toBe('hold');
          expect(TradePosition.update('hold', 'hold')).toBe('hold');
        });
      });

      describe('if current position is exit', () => {
        it('and new position is entry', () => {
          expect(TradePosition.update('exit', 'entry')).toBe('entry');
        });

        it('and new position is other than entry', () => {
          expect(TradePosition.update('exit', 'idle')).toBe('idle');
          expect(TradePosition.update('exit', 'exit')).toBe('idle');
          expect(TradePosition.update('exit', 'hold')).toBe('idle');
        });
      });
    });
  });
});
