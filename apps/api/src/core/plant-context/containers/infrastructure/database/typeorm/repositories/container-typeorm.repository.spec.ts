import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerTypeormEntity } from '@/core/plant-context/containers/infrastructure/database/typeorm/entities/container-typeorm.entity';
import { ContainerTypeormMapper } from '@/core/plant-context/containers/infrastructure/database/typeorm/mappers/container-typeorm.mapper';
import { ContainerTypeormRepository } from '@/core/plant-context/containers/infrastructure/database/typeorm/repositories/container-typeorm.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';

describe('ContainerTypeormRepository', () => {
  let repository: ContainerTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockContainerTypeormMapper: jest.Mocked<ContainerTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<ContainerTypeormEntity>>;
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
    } as unknown as jest.Mocked<Repository<ContainerTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockContainerTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<ContainerTypeormMapper>;

    repository = new ContainerTypeormRepository(
      mockTypeormMasterService,
      mockContainerTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return container aggregate when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new ContainerTypeormEntity();
      typeormEntity.id = containerId;
      typeormEntity.name = 'Garden Bed 1';
      typeormEntity.type = ContainerTypeEnum.GARDEN_BED;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const containerAggregate = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockContainerTypeormMapper.toDomainEntity.mockReturnValue(
        containerAggregate,
      );

      const result = await repository.findById(containerId);

      expect(result).toBe(containerAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: containerId },
      });
      expect(mockContainerTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockContainerTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return null when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(containerId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: containerId },
      });
      expect(mockContainerTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save container aggregate and return saved aggregate', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const containerAggregate = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new ContainerTypeormEntity();
      typeormEntity.id = containerId;
      typeormEntity.name = 'Garden Bed 1';
      typeormEntity.type = ContainerTypeEnum.GARDEN_BED;

      const savedTypeormEntity = new ContainerTypeormEntity();
      savedTypeormEntity.id = containerId;
      savedTypeormEntity.name = 'Garden Bed 1';
      savedTypeormEntity.type = ContainerTypeEnum.GARDEN_BED;

      const savedContainerAggregate = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockContainerTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockContainerTypeormMapper.toDomainEntity.mockReturnValue(
        savedContainerAggregate,
      );

      const result = await repository.save(containerAggregate);

      expect(result).toBe(savedContainerAggregate);
      expect(mockContainerTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        containerAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockContainerTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete container', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await repository.delete(containerId);

      expect(mockSoftDelete).toHaveBeenCalledWith(containerId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle delete errors correctly', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Container not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(containerId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(containerId);
    });
  });
});
