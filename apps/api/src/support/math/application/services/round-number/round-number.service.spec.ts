import { RoundNumberService } from './round-number.service';

describe('RoundNumberService', () => {
  let service: RoundNumberService;

  beforeEach(() => {
    service = new RoundNumberService();
  });

  describe('execute', () => {
    it('should round to specified decimals', () => {
      const result = service.execute(3.14159, 2);
      expect(result).toBe(3.14);
    });

    it('should round to zero decimals', () => {
      const result = service.execute(3.14159, 0);
      expect(result).toBe(3);
    });

    it('should use default 2 decimals', () => {
      const result = service.execute(3.14159);
      expect(result).toBe(3.14);
    });

    it('should handle negative numbers', () => {
      const result = service.execute(-3.14159, 2);
      expect(result).toBe(-3.14);
    });
  });

  describe('roundUp', () => {
    it('should round up to nearest integer', () => {
      const result = service.roundUp(3.1);
      expect(result).toBe(4);
    });

    it('should handle already integer values', () => {
      const result = service.roundUp(3);
      expect(result).toBe(3);
    });
  });

  describe('roundDown', () => {
    it('should round down to nearest integer', () => {
      const result = service.roundDown(3.9);
      expect(result).toBe(3);
    });

    it('should handle already integer values', () => {
      const result = service.roundDown(3);
      expect(result).toBe(3);
    });
  });
});
