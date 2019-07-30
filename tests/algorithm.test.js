import { Algorithm } from '../src';

describe('Algorithm', () => {
  describe('constructor', () => {
    it('Should return a valid Algorithm object for a given value.', () => {
      const algorithm = new Algorithm('Algo', num => num > 10, num => num < 10);

      expect(algorithm).toBeInstanceOf(Algorithm);

      expect(algorithm).toHaveProperty('name');
      expect(algorithm.name).toBe('Algo');
    });

    it('Should return a valid boolean value for an entry function.', () => {
      const algorithm = new Algorithm('Algo', num => num > 10, num => num < 10);

      expect(algorithm.entry(12)).toBeTruthy();
    });

    it('Should return a valid boolean value for an exit function.', () => {
      const algorithm = new Algorithm('Algo', num => num > 10, num => num < 10);

      expect(algorithm.exit(12)).toBeFalsy();
    });
  });

  describe('execute', () => {
    it('Should return "entry" if entry condition is true', () => {
      const algorithm = new Algorithm('Algo', num => num > 10, num => num < 10);

      expect(algorithm.execute(12)).toBe('entry');
    });

    it('Should return "hold" if entry was already true and another entry occurs.', () => {
      const algorithm = new Algorithm('Algo', num => num > 10, num => num < 10);

      expect(algorithm.execute(12)).toBe('entry');
      expect(algorithm.execute(14)).toBe('hold');
    });

    it('Should return "exit" if exit condition is true and entry conditon was hold.', () => {
      const algorithm = new Algorithm('Algo', num => num > 10, num => num < 10);

      expect(algorithm.execute(12)).toBe('entry');
      expect(algorithm.execute(14)).toBe('hold');
      expect(algorithm.execute(9)).toBe('exit');
    });
  });
});
