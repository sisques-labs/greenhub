import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('PlantNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PlantNameValueObject', () => {
      const name = new PlantNameValueObject('Aloe Vera');
      expect(name.value).toBe('Aloe Vera');
    });

    it('should trim whitespace by default', () => {
      const name = new PlantNameValueObject('  Aloe Vera  ');
      expect(name.value).toBe('Aloe Vera');
    });

    it('should create PlantNameValueObject with different plant names', () => {
      const names = ['Basil', 'Tomato', 'Lavender', 'Mint'];
      names.forEach((plantName) => {
        const name = new PlantNameValueObject(plantName);
        expect(name.value).toBe(plantName);
      });
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should be an instance of StringValueObject', () => {
      const name = new PlantNameValueObject('Aloe Vera');
      expect(name).toBeInstanceOf(StringValueObject);
    });

    it('should use equals method from StringValueObject', () => {
      const name1 = new PlantNameValueObject('Aloe Vera');
      const name2 = new PlantNameValueObject('Aloe Vera');
      const name3 = new PlantNameValueObject('Basil');

      expect(name1.equals(name2)).toBe(true);
      expect(name1.equals(name3)).toBe(false);
    });
  });
});
