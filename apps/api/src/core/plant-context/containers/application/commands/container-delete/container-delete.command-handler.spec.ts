import { IContainerDeleteCommandDto } from '@/core/plant-context/containers/application/dtos/commands/container-delete/container-delete-command.dto';
import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerDeletedEvent } from '@/shared/domain/events/features/containers/container-deleted/container-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { AssertContainerExistsService } from '../../services/assert-container-exists/assert-container-exists.service';
import { ContainerDeleteCommand } from './container-delete.command';
import { ContainerDeleteCommandHandler } from './container-delete.command-handler';

describe('ContainerDeleteCommandHandler', () => {
  let handler: ContainerDeleteCommandHandler;
  let mockContainerWriteRepository: jest.Mocked<ContainerWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertContainerExistsService: jest.Mocked<AssertContainerExistsService>;

  beforeEach(async () => {
    mockContainerWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ContainerWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertContainerExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertContainerExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        ContainerDeleteCommandHandler,
        {
          provide: CONTAINER_WRITE_REPOSITORY_TOKEN,
          useValue: mockContainerWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertContainerExistsService,
          useValue: mockAssertContainerExistsService,
        },
      ],
    }).compile();

    handler = module.get<ContainerDeleteCommandHandler>(
      ContainerDeleteCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete container successfully when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IContainerDeleteCommandDto = {
        id: containerId,
      };

      const command = new ContainerDeleteCommand(commandDto);
      const existingContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertContainerExistsService.execute.mockResolvedValue(
        existingContainer,
      );
      mockContainerWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledTimes(1);
      expect(mockContainerWriteRepository.delete).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerWriteRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IContainerDeleteCommandDto = {
        id: containerId,
      };

      const command = new ContainerDeleteCommand(commandDto);
      const error = new ContainerNotFoundException(containerId);

      mockAssertContainerExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish ContainerDeletedEvent when container is deleted', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IContainerDeleteCommandDto = {
        id: containerId,
      };

      const command = new ContainerDeleteCommand(commandDto);
      const existingContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertContainerExistsService.execute.mockResolvedValue(
        existingContainer,
      );
      mockContainerWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      const publishedEvents = mockEventBus.publishAll.mock.calls[0]?.[0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents && publishedEvents.length > 0) {
        const deletedEvent = publishedEvents.find(
          (e) => e instanceof ContainerDeletedEvent,
        );
        expect(deletedEvent).toBeInstanceOf(ContainerDeletedEvent);
      }
    });

    it('should delete container before publishing events', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IContainerDeleteCommandDto = {
        id: containerId,
      };

      const command = new ContainerDeleteCommand(commandDto);
      const existingContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertContainerExistsService.execute.mockResolvedValue(
        existingContainer,
      );
      mockContainerWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const deleteOrder =
        mockContainerWriteRepository.delete.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(publishOrder);
    });
  });
});
