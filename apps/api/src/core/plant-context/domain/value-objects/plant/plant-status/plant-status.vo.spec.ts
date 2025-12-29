import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PlantStatusValueObject with PLANTED status', () => {
      const status = new PlantStatusValueObject(PlantStatusEnum.PLANTED);
      expect(status.value).toBe(PlantStatusEnum.PLANTED);
    });

    it('should create a valid PlantStatusValueObject with GROWING status', () => {
      const status = new PlantStatusValueObject(PlantStatusEnum.GROWING);
      expect(status.value).toBe(PlantStatusEnum.GROWING);
    });

    it('should create a valid PlantStatusValueObject with HARVESTED status', () => {
      const status = new PlantStatusValueObject(PlantStatusEnum.HARVESTED);
      expect(status.value).toBe(PlantStatusEnum.HARVESTED);
    });

    it('should create a valid PlantStatusValueObject with DEAD status', () => {
      const status = new PlantStatusValueObject(PlantStatusEnum.DEAD);
      expect(status.value).toBe(PlantStatusEnum.DEAD);
    });

    it('should create a valid PlantStatusValueObject with ARCHIVED status', () => {
      const status = new PlantStatusValueObject(PlantStatusEnum.ARCHIVED);
      expect(status.value).toBe(PlantStatusEnum.ARCHIVED);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new PlantStatusValueObject('');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new PlantStatusValueObject('   ');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid status', () => {
      expect(() => {
        new PlantStatusValueObject('INVALID_STATUS' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new PlantStatusValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new PlantStatusValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal statuses', () => {
      const status1 = new PlantStatusValueObject(PlantStatusEnum.PLANTED);
      const status2 = new PlantStatusValueObject(PlantStatusEnum.PLANTED);
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different statuses', () => {
      const status1 = new PlantStatusValueObject(PlantStatusEnum.PLANTED);
      const status2 = new PlantStatusValueObject(PlantStatusEnum.GROWING);
      expect(status1.equals(status2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should return the correct value', () => {
      const status = new PlantStatusValueObject(PlantStatusEnum.PLANTED);
      expect(status.value).toBe('PLANTED');
    });

    it('should validate enum values correctly for all statuses', () => {
      const plantedStatus = new PlantStatusValueObject(PlantStatusEnum.PLANTED);
      expect(plantedStatus.value).toBe('PLANTED');

      const growingStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);
      expect(growingStatus.value).toBe('GROWING');

      const harvestedStatus = new PlantStatusValueObject(
        PlantStatusEnum.HARVESTED,
      );
      expect(harvestedStatus.value).toBe('HARVESTED');

      const deadStatus = new PlantStatusValueObject(PlantStatusEnum.DEAD);
      expect(deadStatus.value).toBe('DEAD');

      const archivedStatus = new PlantStatusValueObject(
        PlantStatusEnum.ARCHIVED,
      );
      expect(archivedStatus.value).toBe('ARCHIVED');
    });
  });
});
