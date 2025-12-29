import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';
import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

describe('GrowingUnitCapacityValueObject', () => {
  describe('constructor', () => {
    it('should create a valid GrowingUnitCapacityValueObject', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.value).toBe(10);
      expect(capacity.maxCapacity).toBe(10);
    });

    it('should create from string', () => {
      const capacity = new GrowingUnitCapacityValueObject('15');
      expect(capacity.value).toBe(15);
      expect(capacity.maxCapacity).toBe(15);
    });

    it('should throw InvalidNumberException for capacity less than 1', () => {
      expect(() => new GrowingUnitCapacityValueObject(0)).toThrow(
        InvalidNumberException,
      );
      expect(() => new GrowingUnitCapacityValueObject(-1)).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for decimal values', () => {
      expect(() => new GrowingUnitCapacityValueObject(10.5)).toThrow(
        InvalidNumberException,
      );
    });

    it('should be an instance of NumberValueObject', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity).toBeInstanceOf(NumberValueObject);
    });
  });

  describe('hasCapacity', () => {
    it('should return true when current count is less than capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.hasCapacity(5)).toBe(true);
      expect(capacity.hasCapacity(9)).toBe(true);
      expect(capacity.hasCapacity(0)).toBe(true);
    });

    it('should return false when current count equals or exceeds capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.hasCapacity(10)).toBe(false);
      expect(capacity.hasCapacity(15)).toBe(false);
    });
  });

  describe('getRemainingCapacity', () => {
    it('should return correct remaining capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.getRemainingCapacity(0)).toBe(10);
      expect(capacity.getRemainingCapacity(5)).toBe(5);
      expect(capacity.getRemainingCapacity(9)).toBe(1);
      expect(capacity.getRemainingCapacity(10)).toBe(0);
    });

    it('should return 0 when current count exceeds capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.getRemainingCapacity(15)).toBe(0);
      expect(capacity.getRemainingCapacity(20)).toBe(0);
    });
  });

  describe('canAdd', () => {
    it('should return true when count can be added without exceeding capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.canAdd(5, 3)).toBe(true);
      expect(capacity.canAdd(0, 10)).toBe(true);
      expect(capacity.canAdd(9, 1)).toBe(true);
    });

    it('should return false when adding count would exceed capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.canAdd(5, 6)).toBe(false);
      expect(capacity.canAdd(10, 1)).toBe(false);
      expect(capacity.canAdd(8, 3)).toBe(false);
    });

    it('should return true when adding count exactly reaches capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.canAdd(5, 5)).toBe(true);
      expect(capacity.canAdd(0, 10)).toBe(true);
    });
  });

  describe('getAvailableCapacityPercentage', () => {
    it('should return correct percentage of available capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.getAvailableCapacityPercentage(0)).toBe(100);
      expect(capacity.getAvailableCapacityPercentage(5)).toBe(50);
      expect(capacity.getAvailableCapacityPercentage(9)).toBe(10);
      expect(capacity.getAvailableCapacityPercentage(10)).toBe(0);
    });

    it('should return 0 when capacity is full or exceeded', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.getAvailableCapacityPercentage(10)).toBe(0);
      expect(capacity.getAvailableCapacityPercentage(15)).toBe(0);
    });
  });

  describe('getUsedCapacityPercentage', () => {
    it('should return correct percentage of used capacity', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.getUsedCapacityPercentage(0)).toBe(0);
      expect(capacity.getUsedCapacityPercentage(5)).toBe(50);
      expect(capacity.getUsedCapacityPercentage(9)).toBe(90);
      expect(capacity.getUsedCapacityPercentage(10)).toBe(100);
    });

    it('should return 100 when capacity is full or exceeded', () => {
      const capacity = new GrowingUnitCapacityValueObject(10);
      expect(capacity.getUsedCapacityPercentage(10)).toBe(100);
      expect(capacity.getUsedCapacityPercentage(15)).toBe(100);
    });
  });

  describe('maxCapacity getter', () => {
    it('should return the maximum capacity value', () => {
      const capacity1 = new GrowingUnitCapacityValueObject(5);
      expect(capacity1.maxCapacity).toBe(5);

      const capacity2 = new GrowingUnitCapacityValueObject(100);
      expect(capacity2.maxCapacity).toBe(100);
    });
  });
});
