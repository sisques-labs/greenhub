import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModelFactory } from '@/core/plant-context/plants/domain/factories/plant-view-model/plant-view-model.factory';
import { PlantPrimitives } from '@/core/plant-context/plants/domain/primitives/plant.primitives';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { Test } from '@nestjs/testing';
import { PlantCreatedEventHandler } from './plant-created.event-handler';

describe('PlantCreatedEventHandler', () => {
  let handler: PlantCreatedEventHandler;
  let mockPlantReadRepository: jest.Mocked<PlantReadRepository>;
  let mockPlantViewModelFactory: jest.Mocked<PlantViewModelFactory>;

  beforeEach(async () => {
    mockPlantReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PlantReadRepository>;

    mockPlantViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<PlantViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        PlantCreatedEventHandler,
        {
          provide: PLANT_READ_REPOSITORY_TOKEN,
          useValue: mockPlantReadRepository,
        },
        {
          provide: PlantViewModelFactory,
          useValue: mockPlantViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<PlantCreatedEventHandler>(PlantCreatedEventHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save plant view model when event is handled', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const plantPrimitives: PlantPrimitives = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const event = new PlantCreatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantCreatedEvent',
        },
        plantPrimitives,
      );

      const mockViewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });

      mockPlantViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockPlantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockPlantViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        plantPrimitives,
      );
      expect(mockPlantViewModelFactory.fromPrimitives).toHaveBeenCalledTimes(1);
      expect(mockPlantReadRepository.save).toHaveBeenCalledWith(mockViewModel);
      expect(mockPlantReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with null plantedDate', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const plantPrimitives: PlantPrimitives = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const event = new PlantCreatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantCreatedEvent',
        },
        plantPrimitives,
      );

      const mockViewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });

      mockPlantViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockPlantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockPlantViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        plantPrimitives,
      );
      expect(mockPlantReadRepository.save).toHaveBeenCalledWith(mockViewModel);
    });

    it('should save view model after creating it', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const plantPrimitives: PlantPrimitives = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const event = new PlantCreatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantCreatedEvent',
        },
        plantPrimitives,
      );

      const mockViewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });

      mockPlantViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockPlantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const createOrder =
        mockPlantViewModelFactory.fromPrimitives.mock.invocationCallOrder[0];
      const saveOrder =
        mockPlantReadRepository.save.mock.invocationCallOrder[0];
      expect(createOrder).toBeLessThan(saveOrder);
    });
  });
});
