import { Position } from '../position';

describe('Position', () => {
  describe('constructor', () => {
    it('Should return a valid Position object.', () => {
      const position = new Position('idle');

      expect(position).toHaveProperty('value');
      expect(position.value).toStrictEqual({
        position: 'idle',
      });
    });
  });

  describe('update', () => {
    describe('Should update the correct position', () => {
      describe('if current position is idle', () => {
        it('and new position is entry', () => {
          const position = new Position('idle');
          position.update('entry');
          expect(position.value.position).toBe('entry');
        });

        it('and new position is other than entry', () => {
          const position = new Position('idle');
          position.update('idle');
          expect(position.value.position).toBe('idle');

          position.update('exit');
          expect(position.value.position).toBe('idle');

          position.update('hold');
          expect(position.value.position).toBe('idle');

          position.update();
          expect(position.value.position).toBe('idle');
        });
      });

      describe('if current position is entry', () => {
        it('and new position is exit', () => {
          const position = new Position('entry');
          position.update('exit');
          expect(position.value.position).toBe('exit');
        });

        it('and new position is other than exit', () => {
          let position = new Position('entry');
          position.update('idle');
          expect(position.value.position).toBe('hold');

          position = new Position('entry');
          position.update('entry');
          expect(position.value.position).toBe('hold');

          position = new Position('entry');
          position.update('hold');
          expect(position.value.position).toBe('hold');

          position = new Position('entry');
          position.update();
          expect(position.value.position).toBe('hold');
        });
      });

      describe('if current position is hold', () => {
        it('and new position is exit', () => {
          const position = new Position('hold');
          position.update('exit');
          expect(position.value.position).toBe('exit');
        });

        it('and new position is other than exit', () => {
          let position = new Position('hold');
          position.update('idle');
          expect(position.value.position).toBe('hold');

          position = new Position('hold');
          position.update('entry');
          expect(position.value.position).toBe('hold');

          position = new Position('hold');
          position.update('hold');
          expect(position.value.position).toBe('hold');

          position = new Position('hold');
          position.update();
          expect(position.value.position).toBe('hold');
        });
      });

      describe('if current position is exit', () => {
        it('and new position is entry', () => {
          const position = new Position('exit');
          position.update('entry');
          expect(position.value.position).toBe('entry');
        });

        it('and new position is other than entry', () => {
          let position = new Position('exit');
          position.update('idle');
          expect(position.value.position).toBe('idle');

          position = new Position('exit');
          position.update('exit');
          expect(position.value.position).toBe('idle');

          position = new Position('exit');
          position.update('hold');
          expect(position.value.position).toBe('idle');

          position = new Position('exit');
          position.update();
          expect(position.value.position).toBe('idle');
        });
      });
    });
  });
});
