import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantTypeormEntity } from '@/core/plant-context/plants/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { PlantTypeormMapper } from '@/core/plant-context/plants/infrastructure/database/typeorm/mappers/plant-typeorm.mapper';
import { PlantTypeormRepository } from '@/core/plant-context/plants/infrastructure/database/typeorm/repositories/plant-typeorm.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';

describe('PlantTypeormRepository', () => {
  let repository: PlantTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockPlantTypeormMapper: jest.Mocked<PlantTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<PlantTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<PlantTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockTenantContextService = {
      getTenantIdOrThrow: jest.fn().mockReturnValue('test-tenant-id'),
    } as unknown as jest.Mocked<TenantContextService>;

    mockPlantTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<PlantTypeormMapper>;

    repository = new PlantTypeormRepository(
      mockTypeormMasterService,
      mockTenantContextService,
      mockPlantTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return plant aggregate when plant exists', async () => {
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

      const plantAggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(plantedDate),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockPlantTypeormMapper.toDomainEntity.mockReturnValue(plantAggregate);

      const result = await repository.findById(plantId);

      expect(result).toBe(plantAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: plantId },
      });
      expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when plant does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(plantId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: plantId },
      });
      expect(mockPlantTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save plant aggregate and return saved aggregate', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const plantedDate = new Date('2024-01-15');

      const plantAggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(plantedDate),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new PlantTypeormEntity();
      typeormEntity.id = plantId;
      typeormEntity.name = 'Aloe Vera';
      typeormEntity.species = 'Aloe barbadensis';
      typeormEntity.status = PlantStatusEnum.PLANTED;

      const savedTypeormEntity = new PlantTypeormEntity();
      savedTypeormEntity.id = plantId;
      savedTypeormEntity.name = 'Aloe Vera';
      savedTypeormEntity.species = 'Aloe barbadensis';
      savedTypeormEntity.status = PlantStatusEnum.PLANTED;

      const savedPlantAggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(plantedDate),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPlantTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockPlantTypeormMapper.toDomainEntity.mockReturnValue(
        savedPlantAggregate,
      );

      const result = await repository.save(plantAggregate);

      expect(result).toBe(savedPlantAggregate);
      expect(mockPlantTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        plantAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete plant', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await repository.delete(plantId);

      expect(mockSoftDelete).toHaveBeenCalledWith(plantId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle delete errors correctly', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Plant not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(plantId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(plantId);
    });
  });
});
