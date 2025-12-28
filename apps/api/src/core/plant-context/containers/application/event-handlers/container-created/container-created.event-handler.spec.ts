import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerViewModelFactory } from '@/core/plant-context/containers/domain/factories/container-view-model/container-view-model.factory';
import { ContainerPrimitives } from '@/core/plant-context/containers/domain/primitives/container.primitives';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerCreatedEvent } from '@/shared/domain/events/features/containers/container-created/container-created.event';
import { Test } from '@nestjs/testing';
import { ContainerCreatedEventHandler } from './container-created.event-handler';

describe('ContainerCreatedEventHandler', () => {
  let handler: ContainerCreatedEventHandler;
  let mockContainerReadRepository: jest.Mocked<ContainerReadRepository>;
  let mockContainerViewModelFactory: jest.Mocked<ContainerViewModelFactory>;

  beforeEach(async () => {
    mockContainerReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ContainerReadRepository>;

    mockContainerViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<ContainerViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        ContainerCreatedEventHandler,
        {
          provide: CONTAINER_READ_REPOSITORY_TOKEN,
          useValue: mockContainerReadRepository,
        },
        {
          provide: ContainerViewModelFactory,
          useValue: mockContainerViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<ContainerCreatedEventHandler>(
      ContainerCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save container view model when event is handled', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const containerPrimitives: ContainerPrimitives = {
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        createdAt: now,
        updatedAt: now,
      };

      const event = new ContainerCreatedEvent(
        {
          aggregateId: containerId,
          aggregateType: 'ContainerAggregate',
          eventType: 'ContainerCreatedEvent',
        },
        containerPrimitives,
      );

      const mockViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockContainerViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockContainerViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        containerPrimitives,
      );
      expect(
        mockContainerViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
      expect(mockContainerReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
      expect(mockContainerReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should save view model after creating it', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const containerPrimitives: ContainerPrimitives = {
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        createdAt: now,
        updatedAt: now,
      };

      const event = new ContainerCreatedEvent(
        {
          aggregateId: containerId,
          aggregateType: 'ContainerAggregate',
          eventType: 'ContainerCreatedEvent',
        },
        containerPrimitives,
      );

      const mockViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockContainerViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockContainerReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const createOrder =
        mockContainerViewModelFactory.fromPrimitives.mock
          .invocationCallOrder[0];
      const saveOrder =
        mockContainerReadRepository.save.mock.invocationCallOrder[0];
      expect(createOrder).toBeLessThan(saveOrder);
    });
  });
});
