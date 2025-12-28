import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantAggregateFactory } from '@/core/plant-context/plants/domain/factories/plant-aggregate/plant-aggregate.factory';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantTypeormEntity } from '@/core/plant-context/plants/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { PlantTypeormMapper } from '@/core/plant-context/plants/infrastructure/database/typeorm/mappers/plant-typeorm.mapper';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantTypeormMapper', () => {
  let mapper: PlantTypeormMapper;
  let mockPlantAggregateFactory: jest.Mocked<PlantAggregateFactory>;

  beforeEach(() => {
    mockPlantAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<PlantAggregateFactory>;

    mapper = new PlantTypeormMapper(mockPlantAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const plantedDate = new Date('2024-01-15');

      const typeormEntity = new PlantTypeormEntity();
      typeormEntity.id = plantId;
      typeormEntity.name = 'Aloe Vera';
      typeormEntity.species = 'Aloe barbadensis';
      typeormEntity.plantedDate = plantedDate;
      typeormEntity.notes = 'Keep in indirect sunlight';
      typeormEntity.status = PlantStatusEnum.PLANTED;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockPlantAggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(plantedDate),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPlantAggregateFactory.fromPrimitives.mockReturnValue(
        mockPlantAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockPlantAggregate);
      expect(mockPlantAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: plantId,
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockPlantAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new PlantTypeormEntity();
      typeormEntity.id = plantId;
      typeormEntity.name = 'Aloe Vera';
      typeormEntity.species = 'Aloe barbadensis';
      typeormEntity.plantedDate = null;
      typeormEntity.notes = null;
      typeormEntity.status = PlantStatusEnum.GROWING;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockPlantAggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: null,
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPlantAggregateFactory.fromPrimitives.mockReturnValue(
        mockPlantAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockPlantAggregate);
      expect(mockPlantAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: plantId,
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const plantedDate = new Date('2024-01-15');

      const mockPlantAggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(plantedDate),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockPlantAggregate, 'toPrimitives')
        .mockReturnValue({
          id: plantId,
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: plantedDate,
          notes: 'Keep in indirect sunlight',
          status: PlantStatusEnum.PLANTED,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockPlantAggregate);

      expect(result).toBeInstanceOf(PlantTypeormEntity);
      expect(result.id).toBe(plantId);
      expect(result.containerId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.name).toBe('Aloe Vera');
      expect(result.species).toBe('Aloe barbadensis');
      expect(result.plantedDate).toEqual(plantedDate);
      expect(result.notes).toBe('Keep in indirect sunlight');
      expect(result.status).toBe(PlantStatusEnum.PLANTED);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockPlantAggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: null,
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockPlantAggregate, 'toPrimitives')
        .mockReturnValue({
          id: plantId,
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: null,
          notes: null,
          status: PlantStatusEnum.GROWING,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockPlantAggregate);

      expect(result).toBeInstanceOf(PlantTypeormEntity);
      expect(result.id).toBe(plantId);
      expect(result.containerId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.name).toBe('Aloe Vera');
      expect(result.species).toBe('Aloe barbadensis');
      expect(result.plantedDate).toBeNull();
      expect(result.notes).toBeNull();
      expect(result.status).toBe(PlantStatusEnum.GROWING);
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
