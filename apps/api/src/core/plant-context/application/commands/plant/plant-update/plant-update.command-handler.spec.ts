import { IContainerUpdateCommandDto } from '@/core/plant-context/containers/application/dtos/commands/container-update/container-update-command.dto';
import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerUpdatedEvent } from '@/shared/domain/events/features/plant-context/containers/container-updated/container-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { AssertContainerExistsService } from '../../services/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { ContainerUpdateCommand } from './container-update.command';
import { ContainerUpdateCommandHandler } from './plant-update.command-handler';

describe('ContainerUpdateCommandHandler', () => {
  let handler: ContainerUpdateCommandHandler;
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
        ContainerUpdateCommandHandler,
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

    handler = module.get<ContainerUpdateCommandHandler>(
      ContainerUpdateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update container successfully when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IContainerUpdateCommandDto = {
        id: containerId,
        name: 'Updated Name',
      };

      const command = new ContainerUpdateCommand(commandDto);
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
      mockContainerWriteRepository.save.mockResolvedValue(existingContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledTimes(1);
      expect(mockContainerWriteRepository.save).toHaveBeenCalledWith(
        existingContainer,
      );
      expect(mockContainerWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IContainerUpdateCommandDto = {
        id: containerId,
        name: 'Updated Name',
      };

      const command = new ContainerUpdateCommand(commandDto);
      const error = new ContainerNotFoundException(containerId);

      mockAssertContainerExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockContainerWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IContainerUpdateCommandDto = {
        id: containerId,
        name: 'Updated Name',
        type: ContainerTypeEnum.POT,
      };

      const command = new ContainerUpdateCommand(commandDto);
      const now = new Date();
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
      mockContainerWriteRepository.save.mockResolvedValue(existingContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(existingContainer.name.value).toBe('Updated Name');
      expect(existingContainer.type.value).toBe(ContainerTypeEnum.POT);
    });

    it('should publish ContainerUpdatedEvent when container is updated', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IContainerUpdateCommandDto = {
        id: containerId,
        name: 'Updated Name',
      };

      const command = new ContainerUpdateCommand(commandDto);
      const now = new Date();
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
      mockContainerWriteRepository.save.mockResolvedValue(existingContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(existingContainer.name.value).toBe('Updated Name');
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      const publishedEvents = mockEventBus.publishAll.mock.calls[0]?.[0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents && publishedEvents.length > 0) {
        const updatedEvent = publishedEvents.find(
          (e) => e instanceof ContainerUpdatedEvent,
        );
        expect(updatedEvent).toBeInstanceOf(ContainerUpdatedEvent);
      }
    });

    it('should save container before publishing events', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IContainerUpdateCommandDto = {
        id: containerId,
        name: 'Updated Name',
      };

      const command = new ContainerUpdateCommand(commandDto);
      const now = new Date();
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
      mockContainerWriteRepository.save.mockResolvedValue(existingContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockContainerWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });
  });
});
