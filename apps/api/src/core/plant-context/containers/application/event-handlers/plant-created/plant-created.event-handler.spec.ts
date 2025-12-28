import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { Test } from '@nestjs/testing';
import { PlantCreatedContainerEventHandler } from './plant-created.event-handler';

describe('PlantCreatedContainerEventHandler', () => {
  let handler: PlantCreatedContainerEventHandler;
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
        PlantCreatedContainerEventHandler,
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

    handler = module.get<PlantCreatedContainerEventHandler>(
      PlantCreatedContainerEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update container view model when plant is created with containerId', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantCreatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantCreatedEvent',
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
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const mockPlant = new ContainerPlantViewModel({
        id: plantId,
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: null,
        status: 'PLANTED',
        createdAt: now,
        updatedAt: now,
      });

      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        mockContainerViewModel,
      );
      mockContainerObtainPlantsService.execute.mockResolvedValue([mockPlant]);
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(containerId);
      expect(mockContainerObtainPlantsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerViewModel.plants).toEqual([mockPlant]);
      expect(mockContainerViewModel.numberOfPlants).toBe(1);
      expect(mockContainerReadRepository.save).toHaveBeenCalledWith(
        mockContainerViewModel,
      );
    });

    it('should skip update when plant has no containerId', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantCreatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantCreatedEvent',
        },
        {
          id: plantId,
          containerId: '',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: new Date('2024-01-15'),
          notes: null,
          status: 'PLANTED',
          createdAt: now,
          updatedAt: now,
        },
      );

      await handler.handle(event);

      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).not.toHaveBeenCalled();
      expect(mockContainerObtainPlantsService.execute).not.toHaveBeenCalled();
      expect(mockContainerReadRepository.save).not.toHaveBeenCalled();
    });

    it('should update container with multiple plants', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const event = new PlantCreatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantCreatedEvent',
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
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const mockPlant1 = new ContainerPlantViewModel({
        id: plantId,
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: null,
        status: 'PLANTED',
        createdAt: now,
        updatedAt: now,
      });

      const mockPlant2 = new ContainerPlantViewModel({
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
        mockPlant1,
        mockPlant2,
      ]);
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockContainerViewModel.plants).toHaveLength(2);
      expect(mockContainerViewModel.numberOfPlants).toBe(2);
    });
  });
});
