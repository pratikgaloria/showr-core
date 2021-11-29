import { TradePosition } from '../src';

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
          const position = new TradePosition('idle');
          position.update('entry');
          expect(position.value).toBe('entry');
        });

        it('and new position is other than entry', () => {
          const position = new TradePosition('idle');
          position.update('idle');
          expect(position.value).toBe('idle');

          position.update('exit');
          expect(position.value).toBe('idle');

          position.update('hold');
          expect(position.value).toBe('idle');

          position.update();
          expect(position.value).toBe('idle');
        });
      });

      describe('if current position is entry', () => {
        it('and new position is exit', () => {
          const position = new TradePosition('entry');
          position.update('exit');
          expect(position.value).toBe('exit');
        });

        it('and new position is other than exit', () => {
          let position = new TradePosition('entry');
          position.update('idle');
          expect(position.value).toBe('hold');

          position = new TradePosition('entry');
          position.update('entry');
          expect(position.value).toBe('hold');

          position = new TradePosition('entry');
          position.update('hold');
          expect(position.value).toBe('hold');

          position = new TradePosition('entry');
          position.update();
          expect(position.value).toBe('hold');
        });
      });

      describe('if current position is hold', () => {
        it('and new position is exit', () => {
          const position = new TradePosition('hold');
          position.update('exit');
          expect(position.value).toBe('exit');
        });

        it('and new position is other than exit', () => {
          let position = new TradePosition('hold');
          position.update('idle');
          expect(position.value).toBe('hold');

          position = new TradePosition('hold');
          position.update('entry');
          expect(position.value).toBe('hold');

          position = new TradePosition('hold');
          position.update('hold');
          expect(position.value).toBe('hold');

          position = new TradePosition('hold');
          position.update();
          expect(position.value).toBe('hold');
        });
      });

      describe('if current position is exit', () => {
        it('and new position is entry', () => {
          const position = new TradePosition('exit');
          position.update('entry');
          expect(position.value).toBe('entry');
        });

        it('and new position is other than entry', () => {
          let position = new TradePosition('exit');
          position.update('idle');
          expect(position.value).toBe('idle');

          position = new TradePosition('exit');
          position.update('exit');
          expect(position.value).toBe('idle');

          position = new TradePosition('exit');
          position.update('hold');
          expect(position.value).toBe('idle');

          position = new TradePosition('exit');
          position.update();
          expect(position.value).toBe('idle');
        });
      });
    });
  });
});
