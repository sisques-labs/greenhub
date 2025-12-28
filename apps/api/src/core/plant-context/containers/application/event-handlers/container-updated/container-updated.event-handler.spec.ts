import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerUpdatedEvent } from '@/shared/domain/events/features/containers/container-updated/container-updated.event';
import { Test } from '@nestjs/testing';
import { ContainerUpdatedEventHandler } from './container-updated.event-handler';

describe('ContainerUpdatedEventHandler', () => {
  let handler: ContainerUpdatedEventHandler;
  let mockContainerReadRepository: jest.Mocked<ContainerReadRepository>;
  let mockAssertContainerViewModelExistsService: jest.Mocked<AssertContainerViewModelExistsService>;

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

    const module = await Test.createTestingModule({
      providers: [
        ContainerUpdatedEventHandler,
        {
          provide: CONTAINER_READ_REPOSITORY_TOKEN,
          useValue: mockContainerReadRepository,
        },
        {
          provide: AssertContainerViewModelExistsService,
          useValue: mockAssertContainerViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<ContainerUpdatedEventHandler>(
      ContainerUpdatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save container view model when event is handled', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new ContainerUpdatedEvent(
        {
          aggregateId: containerId,
          aggregateType: 'ContainerAggregate',
          eventType: 'ContainerUpdatedEvent',
        },
        {
          name: 'Updated Name',
          type: ContainerTypeEnum.POT,
        },
      );

      const now = new Date();
      const existingViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(containerId);
      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(event.data);
      expect(mockContainerReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockContainerReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when container view model does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new ContainerUpdatedEvent(
        {
          aggregateId: containerId,
          aggregateType: 'ContainerAggregate',
          eventType: 'ContainerUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const error = new ContainerNotFoundException(containerId);
      mockAssertContainerViewModelExistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(containerId);
      expect(mockContainerReadRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new ContainerUpdatedEvent(
        {
          aggregateId: containerId,
          aggregateType: 'ContainerAggregate',
          eventType: 'ContainerUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const now = new Date();
      const existingViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith(event.data);
      expect(mockContainerReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );

      updateSpy.mockRestore();
    });

    it('should save view model after updating it', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new ContainerUpdatedEvent(
        {
          aggregateId: containerId,
          aggregateType: 'ContainerAggregate',
          eventType: 'ContainerUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const now = new Date();
      const existingViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const updateOrder =
        mockAssertContainerViewModelExistsService.execute.mock
          .invocationCallOrder[0];
      const saveOrder =
        mockContainerReadRepository.save.mock.invocationCallOrder[0];
      expect(updateOrder).toBeLessThan(saveOrder);
    });
  });
});
