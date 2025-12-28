import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { PlantContainerChangedEvent } from '@/shared/domain/events/features/plants/plant-container-changed/plant-container-changed.event';
import { Test } from '@nestjs/testing';
import { PlantContainerChangedContainerEventHandler } from './plant-container-changed.event-handler';

describe('PlantContainerChangedContainerEventHandler', () => {
  let handler: PlantContainerChangedContainerEventHandler;
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
        PlantContainerChangedContainerEventHandler,
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

    handler = module.get<PlantContainerChangedContainerEventHandler>(
      PlantContainerChangedContainerEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update both old and new containers when plant container is changed', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const oldContainerId = '223e4567-e89b-12d3-a456-426614174000';
      const newContainerId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantContainerChangedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantContainerChangedEvent',
        },
        {
          id: plantId,
          containerId: newContainerId,
          oldContainerId,
          newContainerId,
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: new Date('2024-01-15'),
          notes: null,
          status: 'PLANTED',
          createdAt: now,
          updatedAt: now,
        },
      );

      const mockOldContainerViewModel = new ContainerViewModel({
        id: oldContainerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 1,
        createdAt: now,
        updatedAt: now,
      });

      const mockNewContainerViewModel = new ContainerViewModel({
        id: newContainerId,
        name: 'Garden Bed 2',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertContainerViewModelExistsService.execute
        .mockResolvedValueOnce(mockOldContainerViewModel)
        .mockResolvedValueOnce(mockNewContainerViewModel);
      mockContainerObtainPlantsService.execute
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          new ContainerPlantViewModel({
            id: plantId,
            name: 'Aloe Vera',
            species: 'Aloe barbadensis',
            plantedDate: new Date('2024-01-15'),
            notes: null,
            status: 'PLANTED',
            createdAt: now,
            updatedAt: now,
          }),
        ]);
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(oldContainerId);
      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(newContainerId);
      expect(mockContainerObtainPlantsService.execute).toHaveBeenCalledWith(
        oldContainerId,
      );
      expect(mockContainerObtainPlantsService.execute).toHaveBeenCalledWith(
        newContainerId,
      );
      expect(mockOldContainerViewModel.numberOfPlants).toBe(0);
      expect(mockNewContainerViewModel.numberOfPlants).toBe(1);
      expect(mockContainerReadRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should handle case when old container has remaining plants', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const oldContainerId = '223e4567-e89b-12d3-a456-426614174000';
      const newContainerId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantContainerChangedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantContainerChangedEvent',
        },
        {
          id: plantId,
          containerId: newContainerId,
          oldContainerId,
          newContainerId,
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: new Date('2024-01-15'),
          notes: null,
          status: 'PLANTED',
          createdAt: now,
          updatedAt: now,
        },
      );

      const mockOldContainerViewModel = new ContainerViewModel({
        id: oldContainerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 2,
        createdAt: now,
        updatedAt: now,
      });

      const mockNewContainerViewModel = new ContainerViewModel({
        id: newContainerId,
        name: 'Garden Bed 2',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const remainingPlant = new ContainerPlantViewModel({
        id: '423e4567-e89b-12d3-a456-426614174000',
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: new Date('2024-01-20'),
        notes: null,
        status: 'GROWING',
        createdAt: now,
        updatedAt: now,
      });

      mockAssertContainerViewModelExistsService.execute
        .mockResolvedValueOnce(mockOldContainerViewModel)
        .mockResolvedValueOnce(mockNewContainerViewModel);
      mockContainerObtainPlantsService.execute
        .mockResolvedValueOnce([remainingPlant])
        .mockResolvedValueOnce([
          new ContainerPlantViewModel({
            id: plantId,
            name: 'Aloe Vera',
            species: 'Aloe barbadensis',
            plantedDate: new Date('2024-01-15'),
            notes: null,
            status: 'PLANTED',
            createdAt: now,
            updatedAt: now,
          }),
        ]);
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockOldContainerViewModel.numberOfPlants).toBe(1);
      expect(mockNewContainerViewModel.numberOfPlants).toBe(1);
    });
  });
});
