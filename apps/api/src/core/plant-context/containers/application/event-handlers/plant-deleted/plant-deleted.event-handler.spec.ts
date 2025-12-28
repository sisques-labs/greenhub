import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { PlantDeletedEvent } from '@/shared/domain/events/features/plants/plant-deleted/plant-deleted.event';
import { Test } from '@nestjs/testing';
import { PlantDeletedContainerEventHandler } from './plant-deleted.event-handler';

describe('PlantDeletedContainerEventHandler', () => {
  let handler: PlantDeletedContainerEventHandler;
  let mockContainerReadRepository: jest.Mocked<ContainerReadRepository>;
  let mockAssertContainerViewModelExistsService: jest.Mocked<AssertContainerViewModelExistsService>;
  let mockContainerObtainPlantsService: jest.Mocked<ContainerObtainPlantsService>;

  beforeEach(async () => {
    mockContainerReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ContainerReadRepository>;

    mockAssertContainerViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertContainerViewModelExistsService>;

    mockContainerObtainPlantsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ContainerObtainPlantsService>;

    const module = await Test.createTestingModule({
      providers: [
        PlantDeletedContainerEventHandler,
        {
          provide: CONTAINER_READ_REPOSITORY_TOKEN,
          useValue: mockContainerReadRepository,
        },
        {
          provide: AssertContainerViewModelExistsService,
          useValue: mockAssertContainerViewModelExistsService,
        },
        {
          provide: ContainerObtainPlantsService,
          useValue: mockContainerObtainPlantsService,
        },
      ],
    }).compile();

    handler = module.get<PlantDeletedContainerEventHandler>(
      PlantDeletedContainerEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update container view model when plant is deleted', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantDeletedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantDeletedEvent',
        },
        {
          id: plantId,
          containerId,
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: new Date('2024-01-15'),
          notes: null,
          status: 'PLANTED',
          createdAt: now,
          updatedAt: now,
        },
      );

      const mockContainerViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 1,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        mockContainerViewModel,
      );
      mockContainerObtainPlantsService.execute.mockResolvedValue([]);
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(containerId);
      expect(mockContainerObtainPlantsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerViewModel.plants).toEqual([]);
      expect(mockContainerViewModel.numberOfPlants).toBe(0);
      expect(mockContainerReadRepository.save).toHaveBeenCalledWith(
        mockContainerViewModel,
      );
    });

    it('should update container with remaining plants after deletion', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantDeletedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantDeletedEvent',
        },
        {
          id: plantId,
          containerId,
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: new Date('2024-01-15'),
          notes: null,
          status: 'PLANTED',
          createdAt: now,
          updatedAt: now,
        },
      );

      const mockContainerViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 2,
        createdAt: now,
        updatedAt: now,
      });

      const remainingPlant = new ContainerPlantViewModel({
        id: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: new Date('2024-01-20'),
        notes: null,
        status: 'GROWING',
        createdAt: now,
        updatedAt: now,
      });

      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        mockContainerViewModel,
      );
      mockContainerObtainPlantsService.execute.mockResolvedValue([
        remainingPlant,
      ]);
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockContainerViewModel.plants).toHaveLength(1);
      expect(mockContainerViewModel.numberOfPlants).toBe(1);
    });
  });
});
