import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('PlantNotesValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PlantNotesValueObject', () => {
      const notes = new PlantNotesValueObject('Keep in indirect sunlight');
      expect(notes.value).toBe('Keep in indirect sunlight');
    });

    it('should trim whitespace by default', () => {
      const notes = new PlantNotesValueObject('  Keep in indirect sunlight  ');
      expect(notes.value).toBe('Keep in indirect sunlight');
    });

    it('should create PlantNotesValueObject with different notes', () => {
      const notesTexts = [
        'Water daily',
        'Needs full sun',
        'Fertilize monthly',
        'Prune in spring',
      ];
      notesTexts.forEach((notesText) => {
        const notes = new PlantNotesValueObject(notesText);
        expect(notes.value).toBe(notesText);
      });
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should be an instance of StringValueObject', () => {
      const notes = new PlantNotesValueObject('Keep in indirect sunlight');
      expect(notes).toBeInstanceOf(StringValueObject);
    });

    it('should use equals method from StringValueObject', () => {
      const notes1 = new PlantNotesValueObject('Keep in indirect sunlight');
      const notes2 = new PlantNotesValueObject('Keep in indirect sunlight');
      const notes3 = new PlantNotesValueObject('Water daily');

      expect(notes1.equals(notes2)).toBe(true);
      expect(notes1.equals(notes3)).toBe(false);
    });
  });
});
