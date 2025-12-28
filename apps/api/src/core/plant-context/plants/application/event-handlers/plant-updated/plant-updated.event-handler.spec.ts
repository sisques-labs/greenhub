import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import { AssertPlantViewModelExistsService } from '@/core/plant-context/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { Test } from '@nestjs/testing';
import { PlantUpdatedEventHandler } from './plant-updated.event-handler';

describe('PlantUpdatedEventHandler', () => {
  let handler: PlantUpdatedEventHandler;
  let mockPlantReadRepository: jest.Mocked<PlantReadRepository>;
  let mockAssertPlantViewModelExistsService: jest.Mocked<AssertPlantViewModelExistsService>;

  beforeEach(async () => {
    mockPlantReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PlantReadRepository>;

    mockAssertPlantViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPlantViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        PlantUpdatedEventHandler,
        {
          provide: PLANT_READ_REPOSITORY_TOKEN,
          useValue: mockPlantReadRepository,
        },
        {
          provide: AssertPlantViewModelExistsService,
          useValue: mockAssertPlantViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<PlantUpdatedEventHandler>(PlantUpdatedEventHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save plant view model when event is handled', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {
          name: 'Updated Name',
          species: 'Updated Species',
        },
      );

      const now = new Date();
      const existingViewModel = new PlantViewModel({
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertPlantViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockPlantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertPlantViewModelExistsService.execute,
      ).toHaveBeenCalledWith(plantId);
      expect(
        mockAssertPlantViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(event.data);
      expect(mockPlantReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockPlantReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when plant view model does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const error = new PlantNotFoundException(plantId);
      mockAssertPlantViewModelExistsService.execute.mockRejectedValue(error);

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(
        mockAssertPlantViewModelExistsService.execute,
      ).toHaveBeenCalledWith(plantId);
      expect(mockPlantReadRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const now = new Date();
      const existingViewModel = new PlantViewModel({
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertPlantViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockPlantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith(event.data);
      expect(mockPlantReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );

      updateSpy.mockRestore();
    });

    it('should save view model after updating it', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const now = new Date();
      const existingViewModel = new PlantViewModel({
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

      mockAssertPlantViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockPlantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const updateOrder =
        mockAssertPlantViewModelExistsService.execute.mock
          .invocationCallOrder[0];
      const saveOrder =
        mockPlantReadRepository.save.mock.invocationCallOrder[0];
      expect(updateOrder).toBeLessThan(saveOrder);
    });
  });
});
