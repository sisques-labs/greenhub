import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';

describe('PlantNotesValueObject', () => {
  describe('constructor', () => {
    it('should create a notes value object with valid string', () => {
      const notes = new PlantNotesValueObject('Keep in indirect sunlight');

      expect(notes.value).toBe('Keep in indirect sunlight');
    });

    it('should create a notes value object with empty string', () => {
      const notes = new PlantNotesValueObject('');

      expect(notes.value).toBe('');
    });

    it('should create a notes value object with long string', () => {
      const longNotes = 'A'.repeat(500);
      const notes = new PlantNotesValueObject(longNotes);

      expect(notes.value).toBe(longNotes);
    });
  });

  describe('value getter', () => {
    it('should return the notes string', () => {
      const notes = new PlantNotesValueObject('Keep in indirect sunlight');

      expect(notes.value).toBe('Keep in indirect sunlight');
    });
  });
});
