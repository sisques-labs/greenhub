import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { Test } from '@nestjs/testing';
import { PlantUpdatedContainerEventHandler } from './plant-updated.event-handler';

describe('PlantUpdatedContainerEventHandler', () => {
  let handler: PlantUpdatedContainerEventHandler;
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
        PlantUpdatedContainerEventHandler,
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

    handler = module.get<PlantUpdatedContainerEventHandler>(
      PlantUpdatedContainerEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should do nothing when event is handled', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {
          containerId,
          name: 'Updated Name',
          species: 'Updated Species',
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
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const mockPlants: ContainerPlantViewModel[] = [];

      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        mockContainerViewModel,
      );
      mockContainerObtainPlantsService.execute.mockResolvedValue(mockPlants);
      mockContainerReadRepository.save.mockResolvedValue();

      await handler.handle(event);

      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(containerId);
      expect(mockContainerObtainPlantsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerReadRepository.save).toHaveBeenCalledWith(
        mockContainerViewModel,
      );
    });

    it('should handle event without throwing errors', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {
          containerId,
          name: 'Updated Name',
          species: 'Updated Species',
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
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const mockPlants: ContainerPlantViewModel[] = [];

      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        mockContainerViewModel,
      );
      mockContainerObtainPlantsService.execute.mockResolvedValue(mockPlants);
      mockContainerReadRepository.save.mockResolvedValue();

      await expect(handler.handle(event)).resolves.not.toThrow();
    });
  });
});
