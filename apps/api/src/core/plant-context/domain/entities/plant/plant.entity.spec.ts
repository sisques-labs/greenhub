import { IPlantDto } from '@/core/plant-context/domain/dtos/entities/plant/plant.dto';
import { PlantPlantedDateMissingException } from '@/core/plant-context/domain/exceptions/growing-unit-plant-planted-date-missing.exception';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantEntity', () => {
  const createProps = (): IPlantDto => {
    return {
      id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      growingUnitId: new GrowingUnitUuidValueObject(
        '223e4567-e89b-12d3-a456-426614174000',
      ),
      name: new PlantNameValueObject('Aloe Vera'),
      species: new PlantSpeciesValueObject('Aloe barbadensis'),
      plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
      notes: new PlantNotesValueObject('Keep in indirect sunlight'),
      status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
    };
  };

  describe('constructor', () => {
    it('should create a PlantEntity with all properties', () => {
      const props = createProps();
      const entity = new PlantEntity(props);

      expect(entity).toBeInstanceOf(PlantEntity);
      expect(entity.id.value).toBe(props.id.value);
      expect(entity.growingUnitId.value).toBe(props.growingUnitId.value);
      expect(entity.name.value).toBe(props.name.value);
      expect(entity.species.value).toBe(props.species.value);
      expect(entity.plantedDate?.value).toEqual(props.plantedDate?.value);
      expect(entity.notes.value).toBe(props.notes.value);
      expect(entity.status.value).toBe(props.status.value);
    });

    it('should create a PlantEntity with null plantedDate', () => {
      const props: IPlantDto = {
        ...createProps(),
        plantedDate: null,
      };
      const entity = new PlantEntity(props);

      expect(entity.plantedDate).toBeNull();
    });

    it('should create a PlantEntity with null notes (converts to empty notes)', () => {
      const props: IPlantDto = {
        ...createProps(),
        notes: null,
      };
      const entity = new PlantEntity(props);

      expect(entity.notes).toBeInstanceOf(PlantNotesValueObject);
      expect(entity.notes.value).toBe('');
    });
  });

  describe('changeStatus', () => {
    it('should change the plant status', () => {
      const props = createProps();
      const entity = new PlantEntity(props);
      const newStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);

      entity.changeStatus(newStatus);

      expect(entity.status.value).toBe(PlantStatusEnum.GROWING);
    });
  });

  describe('changeGrowingUnit', () => {
    it('should change the growing unit id', () => {
      const props = createProps();
      const entity = new PlantEntity(props);
      const newGrowingUnitId = new GrowingUnitUuidValueObject(
        '323e4567-e89b-12d3-a456-426614174000',
      );

      entity.changeGrowingUnit(newGrowingUnitId);

      expect(entity.growingUnitId.value).toBe(newGrowingUnitId.value);
    });
  });

  describe('changeName', () => {
    it('should change the plant name', () => {
      const props = createProps();
      const entity = new PlantEntity(props);
      const newName = new PlantNameValueObject('Basil');

      entity.changeName(newName);

      expect(entity.name.value).toBe('Basil');
    });
  });

  describe('changeSpecies', () => {
    it('should change the plant species', () => {
      const props = createProps();
      const entity = new PlantEntity(props);
      const newSpecies = new PlantSpeciesValueObject('Ocimum basilicum');

      entity.changeSpecies(newSpecies);

      expect(entity.species.value).toBe('Ocimum basilicum');
    });
  });

  describe('changePlantedDate', () => {
    it('should change the planted date', () => {
      const props = createProps();
      const entity = new PlantEntity(props);
      const newPlantedDate = new PlantPlantedDateValueObject(
        new Date('2024-02-15'),
      );

      entity.changePlantedDate(newPlantedDate);

      expect(entity.plantedDate?.value).toEqual(newPlantedDate.value);
    });
  });

  describe('changeNotes', () => {
    it('should change the plant notes', () => {
      const props = createProps();
      const entity = new PlantEntity(props);
      const newNotes = new PlantNotesValueObject('Updated notes');

      entity.changeNotes(newNotes);

      expect(entity.notes.value).toBe('Updated notes');
    });
  });

  describe('getAge', () => {
    it('should return the age in milliseconds when plantedDate is set', () => {
      const plantedDate = new Date('2024-01-15');
      const props: IPlantDto = {
        ...createProps(),
        plantedDate: new PlantPlantedDateValueObject(plantedDate),
      };
      const entity = new PlantEntity(props);

      const age = entity.getAge();

      expect(age).toBeGreaterThan(0);
      expect(typeof age).toBe('number');
    });

    it('should throw PlantPlantedDateMissingException when plantedDate is null', () => {
      const props: IPlantDto = {
        ...createProps(),
        plantedDate: null,
      };
      const entity = new PlantEntity(props);

      expect(() => entity.getAge()).toThrow(PlantPlantedDateMissingException);
      expect(() => entity.getAge()).toThrow(
        `Plant ${props.id.value} does not have a planted date`,
      );
    });
  });

  describe('getters', () => {
    it('should expose value objects through getters', () => {
      const props = createProps();
      const entity = new PlantEntity(props);

      expect(entity.id).toBeInstanceOf(PlantUuidValueObject);
      expect(entity.growingUnitId).toBeInstanceOf(GrowingUnitUuidValueObject);
      expect(entity.name).toBeInstanceOf(PlantNameValueObject);
      expect(entity.species).toBeInstanceOf(PlantSpeciesValueObject);
      expect(entity.status).toBeInstanceOf(PlantStatusValueObject);
      if (entity.plantedDate) {
        expect(entity.plantedDate).toBeInstanceOf(PlantPlantedDateValueObject);
      }
      expect(entity.notes).toBeInstanceOf(PlantNotesValueObject);
    });
  });

  describe('toPrimitives', () => {
    it('should convert entity to primitives correctly', () => {
      const props = createProps();
      const entity = new PlantEntity(props);

      const primitives = entity.toPrimitives();

      expect(primitives).toEqual({
        id: props.id.value,
        growingUnitId: props.growingUnitId.value,
        name: props.name.value,
        species: props.species.value,
        plantedDate: props.plantedDate?.value ?? null,
        notes: props.notes.value,
        status: props.status.value,
      });
    });

    it('should convert entity to primitives with null plantedDate', () => {
      const props: IPlantDto = {
        ...createProps(),
        plantedDate: null,
      };
      const entity = new PlantEntity(props);

      const primitives = entity.toPrimitives();

      expect(primitives.plantedDate).toBeNull();
    });
  });
});
