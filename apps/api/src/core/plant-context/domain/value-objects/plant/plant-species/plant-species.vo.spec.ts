import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('PlantSpeciesValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PlantSpeciesValueObject', () => {
      const species = new PlantSpeciesValueObject('Aloe barbadensis');
      expect(species.value).toBe('Aloe barbadensis');
    });

    it('should trim whitespace by default', () => {
      const species = new PlantSpeciesValueObject('  Aloe barbadensis  ');
      expect(species.value).toBe('Aloe barbadensis');
    });

    it('should create PlantSpeciesValueObject with different species names', () => {
      const speciesNames = [
        'Ocimum basilicum',
        'Solanum lycopersicum',
        'Lavandula angustifolia',
        'Mentha spicata',
      ];
      speciesNames.forEach((speciesName) => {
        const species = new PlantSpeciesValueObject(speciesName);
        expect(species.value).toBe(speciesName);
      });
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should be an instance of StringValueObject', () => {
      const species = new PlantSpeciesValueObject('Aloe barbadensis');
      expect(species).toBeInstanceOf(StringValueObject);
    });

    it('should use equals method from StringValueObject', () => {
      const species1 = new PlantSpeciesValueObject('Aloe barbadensis');
      const species2 = new PlantSpeciesValueObject('Aloe barbadensis');
      const species3 = new PlantSpeciesValueObject('Ocimum basilicum');

      expect(species1.equals(species2)).toBe(true);
      expect(species1.equals(species3)).toBe(false);
    });
  });
});
