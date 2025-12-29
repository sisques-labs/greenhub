import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { PlantTypeormMapper } from '@/core/plant-context/infrastructure/database/typeorm/mappers/plant/plant-typeorm.mapper';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantTypeormMapper', () => {
  let mapper: PlantTypeormMapper;
  let mockPlantEntityFactory: jest.Mocked<PlantEntityFactory>;
  let plantEntityFactory: PlantEntityFactory;

  beforeEach(() => {
    plantEntityFactory = new PlantEntityFactory();

    mockPlantEntityFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<PlantEntityFactory>;

    mapper = new PlantTypeormMapper(mockPlantEntityFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const plantedDate = new Date('2024-01-15');

      const typeormEntity = new PlantTypeormEntity();
      typeormEntity.id = plantId;
      typeormEntity.growingUnitId = growingUnitId;
      typeormEntity.name = 'Basil';
      typeormEntity.species = 'Ocimum basilicum';
      typeormEntity.plantedDate = plantedDate;
      typeormEntity.notes = 'Keep in indirect sunlight';
      typeormEntity.status = PlantStatusEnum.PLANTED;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const plantEntity = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: new PlantPlantedDateValueObject(plantedDate),
        notes: new PlantNotesValueObject('Keep in indirect sunlight'),
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      mockPlantEntityFactory.fromPrimitives.mockReturnValue(plantEntity);

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(plantEntity);
      expect(mockPlantEntityFactory.fromPrimitives).toHaveBeenCalledWith({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      });
      expect(mockPlantEntityFactory.fromPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new PlantTypeormEntity();
      typeormEntity.id = plantId;
      typeormEntity.growingUnitId = growingUnitId;
      typeormEntity.name = 'Basil';
      typeormEntity.species = 'Ocimum basilicum';
      typeormEntity.plantedDate = null;
      typeormEntity.notes = null;
      typeormEntity.status = PlantStatusEnum.GROWING;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const plantEntity = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
      });

      mockPlantEntityFactory.fromPrimitives.mockReturnValue(plantEntity);

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(plantEntity);
      expect(mockPlantEntityFactory.fromPrimitives).toHaveBeenCalledWith({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const plantedDate = new Date('2024-01-15');

      const plantEntity = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: new PlantPlantedDateValueObject(plantedDate),
        notes: new PlantNotesValueObject('Keep in indirect sunlight'),
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      const toPrimitivesSpy = jest
        .spyOn(plantEntity, 'toPrimitives')
        .mockReturnValue({
          id: plantId,
          growingUnitId: growingUnitId,
          name: 'Basil',
          species: 'Ocimum basilicum',
          plantedDate: plantedDate,
          notes: 'Keep in indirect sunlight',
          status: PlantStatusEnum.PLANTED,
        });

      const result = mapper.toTypeormEntity(plantEntity);

      expect(result).toBeInstanceOf(PlantTypeormEntity);
      expect(result.id).toBe(plantId);
      expect(result.growingUnitId).toBe(growingUnitId);
      expect(result.name).toBe('Basil');
      expect(result.species).toBe('Ocimum basilicum');
      expect(result.plantedDate).toEqual(plantedDate);
      expect(result.notes).toBe('Keep in indirect sunlight');
      expect(result.status).toBe(PlantStatusEnum.PLANTED);
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';

      const plantEntity = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
      });

      const toPrimitivesSpy = jest
        .spyOn(plantEntity, 'toPrimitives')
        .mockReturnValue({
          id: plantId,
          growingUnitId: growingUnitId,
          name: 'Basil',
          species: 'Ocimum basilicum',
          plantedDate: null,
          notes: null,
          status: PlantStatusEnum.GROWING,
        });

      const result = mapper.toTypeormEntity(plantEntity);

      expect(result).toBeInstanceOf(PlantTypeormEntity);
      expect(result.id).toBe(plantId);
      expect(result.growingUnitId).toBe(growingUnitId);
      expect(result.name).toBe('Basil');
      expect(result.species).toBe('Ocimum basilicum');
      expect(result.plantedDate).toBeNull();
      expect(result.notes).toBeNull();
      expect(result.status).toBe(PlantStatusEnum.GROWING);

      toPrimitivesSpy.mockRestore();
    });
  });

  describe('toTypeormEntityFromPrimitives', () => {
    it('should convert primitives to TypeORM entity', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const plantedDate = new Date('2024-01-15');

      const primitives = {
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      };

      const result = mapper.toTypeormEntityFromPrimitives(primitives);

      expect(result).toBeInstanceOf(PlantTypeormEntity);
      expect(result.id).toBe(plantId);
      expect(result.growingUnitId).toBe(growingUnitId);
      expect(result.name).toBe('Basil');
      expect(result.species).toBe('Ocimum basilicum');
      expect(result.plantedDate).toEqual(plantedDate);
      expect(result.notes).toBe('Keep in indirect sunlight');
      expect(result.status).toBe(PlantStatusEnum.PLANTED);
    });

    it('should convert primitives with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';

      const primitives = {
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
      };

      const result = mapper.toTypeormEntityFromPrimitives(primitives);

      expect(result).toBeInstanceOf(PlantTypeormEntity);
      expect(result.id).toBe(plantId);
      expect(result.growingUnitId).toBe(growingUnitId);
      expect(result.name).toBe('Basil');
      expect(result.species).toBe('Ocimum basilicum');
      expect(result.plantedDate).toBeNull();
      expect(result.notes).toBeNull();
      expect(result.status).toBe(PlantStatusEnum.GROWING);
    });
  });
});
