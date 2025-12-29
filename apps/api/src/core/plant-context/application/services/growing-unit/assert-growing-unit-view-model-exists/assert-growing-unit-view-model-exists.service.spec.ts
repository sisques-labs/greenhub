import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { Test } from '@nestjs/testing';

describe('AssertContainerViewModelExistsService', () => {
  let service: AssertContainerViewModelExistsService;
  let mockContainerReadRepository: jest.Mocked<ContainerReadRepository>;

  beforeEach(async () => {
    mockContainerReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ContainerReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertContainerViewModelExistsService,
        {
          provide: CONTAINER_READ_REPOSITORY_TOKEN,
          useValue: mockContainerReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertContainerViewModelExistsService>(
      AssertContainerViewModelExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return container view model when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockContainerReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(containerId);

      expect(result).toBe(mockViewModel);
      expect(mockContainerReadRepository.findById).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw ContainerNotFoundException when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockContainerReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(containerId)).rejects.toThrow(
        ContainerNotFoundException,
      );
      await expect(service.execute(containerId)).rejects.toThrow(
        `Container with id ${containerId} not found`,
      );

      expect(mockContainerReadRepository.findById).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerReadRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should return container view model with all properties when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockContainerReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(containerId);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(containerId);
      expect(result.name).toBe('Garden Bed 1');
      expect(result.type).toBe(ContainerTypeEnum.GARDEN_BED);
    });

    it('should handle repository errors correctly', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockContainerReadRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(containerId)).rejects.toThrow(
        repositoryError,
      );

      expect(mockContainerReadRepository.findById).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerReadRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
