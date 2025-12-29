import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { AssertContainerExistsService } from '@/core/plant-context/containers/application/services/assert-container-exists/assert-container-exists.service';
import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { Test } from '@nestjs/testing';

describe('AssertContainerExistsService', () => {
  let service: AssertContainerExistsService;
  let mockContainerWriteRepository: jest.Mocked<ContainerWriteRepository>;

  beforeEach(async () => {
    mockContainerWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ContainerWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertContainerExistsService,
        {
          provide: CONTAINER_WRITE_REPOSITORY_TOKEN,
          useValue: mockContainerWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertContainerExistsService>(
      AssertContainerExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return container aggregate when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockContainerWriteRepository.findById.mockResolvedValue(mockContainer);

      const result = await service.execute(containerId);

      expect(result).toBe(mockContainer);
      expect(mockContainerWriteRepository.findById).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw ContainerNotFoundException when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockContainerWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(containerId)).rejects.toThrow(
        ContainerNotFoundException,
      );
      await expect(service.execute(containerId)).rejects.toThrow(
        `Container with id ${containerId} not found`,
      );

      expect(mockContainerWriteRepository.findById).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerWriteRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should return container aggregate with all properties when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockContainerWriteRepository.findById.mockResolvedValue(mockContainer);

      const result = await service.execute(containerId);

      expect(result).toBe(mockContainer);
      expect(result.id.value).toBe(containerId);
      expect(result.name.value).toBe('Garden Bed 1');
      expect(result.type.value).toBe(ContainerTypeEnum.GARDEN_BED);
    });

    it('should handle repository errors correctly', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockContainerWriteRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(containerId)).rejects.toThrow(
        repositoryError,
      );

      expect(mockContainerWriteRepository.findById).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerWriteRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
