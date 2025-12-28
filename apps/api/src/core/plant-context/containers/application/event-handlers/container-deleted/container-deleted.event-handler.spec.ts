import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerDeletedEvent } from '@/shared/domain/events/features/containers/container-deleted/container-deleted.event';
import { Test } from '@nestjs/testing';
import { ContainerDeletedEventHandler } from './container-deleted.event-handler';

describe('ContainerDeletedEventHandler', () => {
  let handler: ContainerDeletedEventHandler;
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
        ContainerDeletedEventHandler,
        {
          provide: CONTAINER_READ_REPOSITORY_TOKEN,
          useValue: mockContainerReadRepository,
        },
      ],
    }).compile();

    handler = module.get<ContainerDeletedEventHandler>(
      ContainerDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete container view model when event is handled', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new ContainerDeletedEvent(
        {
          aggregateId: containerId,
          aggregateType: 'ContainerAggregate',
          eventType: 'ContainerDeletedEvent',
        },
        {
          id: containerId,
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );

      mockContainerReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockContainerReadRepository.delete).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerReadRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
