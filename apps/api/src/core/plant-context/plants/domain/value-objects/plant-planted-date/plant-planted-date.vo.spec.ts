import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

describe('PlantPlantedDateValueObject', () => {
  describe('constructor', () => {
    it('should create a plant planted date value object with provided date', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const plantedDate = new PlantPlantedDateValueObject(date);

      expect(plantedDate.value).toBe(date);
    });

    it('should create a plant planted date value object with current date when no date provided', () => {
      const beforeCreation = new Date();
      const plantedDate = new PlantPlantedDateValueObject();
      const afterCreation = new Date();

      expect(plantedDate.value).toBeInstanceOf(Date);
      expect(plantedDate.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(plantedDate.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should accept valid date strings', () => {
      const dateString = '2024-01-15T10:00:00Z';
      const date = new Date(dateString);
      const plantedDate = new PlantPlantedDateValueObject(date);

      expect(plantedDate.value).toBeInstanceOf(Date);
      expect(plantedDate.value.toISOString()).toBe(date.toISOString());
    });

    it('should handle different date formats', () => {
      const dates = [
        new Date('2024-01-15'),
        new Date('2024-12-31T23:59:59Z'),
        new Date('2023-06-15T12:30:45.123Z'),
      ];

      dates.forEach((date) => {
        const plantedDate = new PlantPlantedDateValueObject(date);
        expect(plantedDate.value).toBe(date);
      });
    });

    it('should handle future dates', () => {
      const futureDate = new Date('2030-01-15T10:00:00Z');
      const plantedDate = new PlantPlantedDateValueObject(futureDate);

      expect(plantedDate.value).toBe(futureDate);
    });

    it('should handle past dates', () => {
      const pastDate = new Date('2020-01-15T10:00:00Z');
      const plantedDate = new PlantPlantedDateValueObject(pastDate);

      expect(plantedDate.value).toBe(pastDate);
    });
  });

  describe('inherited methods from DateValueObject', () => {
    it('should be an instance of DateValueObject', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const plantedDate = new PlantPlantedDateValueObject(date);
      expect(plantedDate).toBeInstanceOf(DateValueObject);
    });

    it('should use equals method from DateValueObject', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const plantedDate1 = new PlantPlantedDateValueObject(date);
      const plantedDate2 = new PlantPlantedDateValueObject(date);
      const differentDate = new Date('2024-01-16T10:00:00Z');
      const plantedDate3 = new PlantPlantedDateValueObject(differentDate);

      expect(plantedDate1.equals(plantedDate2)).toBe(true);
      expect(plantedDate1.equals(plantedDate3)).toBe(false);
    });

    it('should use toISOString method from DateValueObject', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const plantedDate = new PlantPlantedDateValueObject(date);

      expect(plantedDate.toISOString()).toBe('2024-01-15T10:00:00.000Z');
    });
  });
});
