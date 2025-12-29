import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('GrowingUnitTypeValueObject', () => {
  describe('constructor', () => {
    it('should create a valid GrowingUnitTypeValueObject with POT type', () => {
      const type = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);
      expect(type.value).toBe(GrowingUnitTypeEnum.POT);
    });

    it('should create a valid GrowingUnitTypeValueObject with GARDEN_BED type', () => {
      const type = new GrowingUnitTypeValueObject(
        GrowingUnitTypeEnum.GARDEN_BED,
      );
      expect(type.value).toBe(GrowingUnitTypeEnum.GARDEN_BED);
    });

    it('should create a valid GrowingUnitTypeValueObject with HANGING_BASKET type', () => {
      const type = new GrowingUnitTypeValueObject(
        GrowingUnitTypeEnum.HANGING_BASKET,
      );
      expect(type.value).toBe(GrowingUnitTypeEnum.HANGING_BASKET);
    });

    it('should create a valid GrowingUnitTypeValueObject with WINDOW_BOX type', () => {
      const type = new GrowingUnitTypeValueObject(
        GrowingUnitTypeEnum.WINDOW_BOX,
      );
      expect(type.value).toBe(GrowingUnitTypeEnum.WINDOW_BOX);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new GrowingUnitTypeValueObject('');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new GrowingUnitTypeValueObject('   ');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid type', () => {
      expect(() => {
        new GrowingUnitTypeValueObject('INVALID_TYPE' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new GrowingUnitTypeValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new GrowingUnitTypeValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal types', () => {
      const type1 = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);
      const type2 = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);
      expect(type1.equals(type2)).toBe(true);
    });

    it('should return false for different types', () => {
      const type1 = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);
      const type2 = new GrowingUnitTypeValueObject(
        GrowingUnitTypeEnum.GARDEN_BED,
      );
      expect(type1.equals(type2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should return the correct value', () => {
      const type = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);
      expect(type.value).toBe('POT');
    });

    it('should validate enum values correctly for all types', () => {
      const potType = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);
      expect(potType.value).toBe('POT');

      const gardenBedType = new GrowingUnitTypeValueObject(
        GrowingUnitTypeEnum.GARDEN_BED,
      );
      expect(gardenBedType.value).toBe('GARDEN_BED');

      const hangingBasketType = new GrowingUnitTypeValueObject(
        GrowingUnitTypeEnum.HANGING_BASKET,
      );
      expect(hangingBasketType.value).toBe('HANGING_BASKET');

      const windowBoxType = new GrowingUnitTypeValueObject(
        GrowingUnitTypeEnum.WINDOW_BOX,
      );
      expect(windowBoxType.value).toBe('WINDOW_BOX');
    });
  });
});
