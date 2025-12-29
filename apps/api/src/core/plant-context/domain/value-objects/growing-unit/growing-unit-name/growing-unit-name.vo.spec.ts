import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('GrowingUnitNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid GrowingUnitNameValueObject', () => {
      const name = new GrowingUnitNameValueObject('Garden Bed 1');
      expect(name.value).toBe('Garden Bed 1');
    });

    it('should trim whitespace by default', () => {
      const name = new GrowingUnitNameValueObject('  Garden Bed 1  ');
      expect(name.value).toBe('Garden Bed 1');
    });

    it('should create GrowingUnitNameValueObject with different names', () => {
      const names = [
        'Pot A',
        'Hanging Basket 1',
        'Window Box 2',
        'Garden Bed 3',
      ];
      names.forEach((unitName) => {
        const name = new GrowingUnitNameValueObject(unitName);
        expect(name.value).toBe(unitName);
      });
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should be an instance of StringValueObject', () => {
      const name = new GrowingUnitNameValueObject('Garden Bed 1');
      expect(name).toBeInstanceOf(StringValueObject);
    });

    it('should use equals method from StringValueObject', () => {
      const name1 = new GrowingUnitNameValueObject('Garden Bed 1');
      const name2 = new GrowingUnitNameValueObject('Garden Bed 1');
      const name3 = new GrowingUnitNameValueObject('Pot A');

      expect(name1.equals(name2)).toBe(true);
      expect(name1.equals(name3)).toBe(false);
    });
  });
});
