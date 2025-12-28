import { IContainerCreateCommandDto } from '@/core/plant-context/containers/application/dtos/commands/container-create/container-create-command.dto';
import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerAggregateFactory } from '@/core/plant-context/containers/domain/factories/container-aggregate/container-aggregate.factory';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerCreatedEvent } from '@/shared/domain/events/features/containers/container-created/container-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ContainerCreateCommand } from './container-create.command';
import { ContainerCreateCommandHandler } from './container-create.command-handler';

describe('ContainerCreateCommandHandler', () => {
  let handler: ContainerCreateCommandHandler;
  let mockContainerWriteRepository: jest.Mocked<ContainerWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockContainerAggregateFactory: jest.Mocked<ContainerAggregateFactory>;

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

    mockContainerAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<ContainerAggregateFactory>;

    const module = await Test.createTestingModule({
      providers: [
        ContainerCreateCommandHandler,
        {
          provide: CONTAINER_WRITE_REPOSITORY_TOKEN,
          useValue: mockContainerWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: ContainerAggregateFactory,
          useValue: mockContainerAggregateFactory,
        },
      ],
    }).compile();

    handler = module.get<ContainerCreateCommandHandler>(
      ContainerCreateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create container successfully', async () => {
      const commandDto: IContainerCreateCommandDto = {
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
      };

      const command = new ContainerCreateCommand(commandDto);
      const now = new Date();
      const mockContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockContainerAggregateFactory.create.mockReturnValue(mockContainer);
      mockContainerWriteRepository.save.mockResolvedValue(mockContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockContainer.id.value);
      expect(mockContainerAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: command.name,
          type: command.type,
        }),
        true,
      );
      const createCall = mockContainerAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(mockContainerWriteRepository.save).toHaveBeenCalledWith(
        mockContainer,
      );
      expect(mockContainerWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockContainer.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should publish ContainerCreatedEvent when container is created', async () => {
      const commandDto: IContainerCreateCommandDto = {
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
      };

      const command = new ContainerCreateCommand(commandDto);
      const now = new Date();
      const mockContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockContainerAggregateFactory.create.mockReturnValue(mockContainer);
      mockContainerWriteRepository.save.mockResolvedValue(mockContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const uncommittedEvents = mockContainer.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ContainerCreatedEvent);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(uncommittedEvents);
    });

    it('should save container before publishing events', async () => {
      const commandDto: IContainerCreateCommandDto = {
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
      };

      const command = new ContainerCreateCommand(commandDto);
      const now = new Date();
      const mockContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockContainerAggregateFactory.create.mockReturnValue(mockContainer);
      mockContainerWriteRepository.save.mockResolvedValue(mockContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockContainerWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should return the created container id', async () => {
      const commandDto: IContainerCreateCommandDto = {
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
      };

      const command = new ContainerCreateCommand(commandDto);
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockContainerAggregateFactory.create.mockReturnValue(mockContainer);
      mockContainerWriteRepository.save.mockResolvedValue(mockContainer);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(containerId);
    });
  });
});
