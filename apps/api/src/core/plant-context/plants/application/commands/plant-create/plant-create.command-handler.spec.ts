import { IPlantCreateCommandDto } from '@/core/plant-context/plants/application/dtos/commands/plant-create/plant-create-command.dto';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantAggregateFactory } from '@/core/plant-context/plants/domain/factories/plant-aggregate/plant-aggregate.factory';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { PlantCreateCommand } from './plant-create.command';
import { PlantCreateCommandHandler } from './plant-create.command-handler';

describe('PlantCreateCommandHandler', () => {
  let handler: PlantCreateCommandHandler;
  let mockPlantWriteRepository: jest.Mocked<PlantWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockPlantAggregateFactory: jest.Mocked<PlantAggregateFactory>;

  beforeEach(async () => {
    mockPlantWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PlantWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockPlantAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<PlantAggregateFactory>;

    const module = await Test.createTestingModule({
      providers: [
        PlantCreateCommandHandler,
        {
          provide: PLANT_WRITE_REPOSITORY_TOKEN,
          useValue: mockPlantWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: PlantAggregateFactory,
          useValue: mockPlantAggregateFactory,
        },
      ],
    }).compile();

    handler = module.get<PlantCreateCommandHandler>(PlantCreateCommandHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create plant successfully', async () => {
      const commandDto: IPlantCreateCommandDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      };

      const command = new PlantCreateCommand(commandDto);
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockPlantAggregateFactory.create.mockReturnValue(mockPlant);
      mockPlantWriteRepository.save.mockResolvedValue(mockPlant);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockPlant.id.value);
      expect(mockPlantAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: command.name,
          species: command.species,
          plantedDate: command.plantedDate,
          notes: command.notes,
          status: command.status,
        }),
        true,
      );
      const createCall = mockPlantAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(mockPlantWriteRepository.save).toHaveBeenCalledWith(mockPlant);
      expect(mockPlantWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockPlant.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should create plant with null plantedDate', async () => {
      const commandDto: IPlantCreateCommandDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      };

      const command = new PlantCreateCommand(commandDto);
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: null,
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockPlantAggregateFactory.create.mockReturnValue(mockPlant);
      mockPlantWriteRepository.save.mockResolvedValue(mockPlant);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockPlant.id.value);
      expect(mockPlantAggregateFactory.create).toHaveBeenCalled();
      expect(mockPlantWriteRepository.save).toHaveBeenCalledWith(mockPlant);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
    });

    it('should publish PlantCreatedEvent when plant is created', async () => {
      const commandDto: IPlantCreateCommandDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      };

      const command = new PlantCreateCommand(commandDto);
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockPlantAggregateFactory.create.mockReturnValue(mockPlant);
      mockPlantWriteRepository.save.mockResolvedValue(mockPlant);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const uncommittedEvents = mockPlant.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(PlantCreatedEvent);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(uncommittedEvents);
    });

    it('should save plant before publishing events', async () => {
      const commandDto: IPlantCreateCommandDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      };

      const command = new PlantCreateCommand(commandDto);
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockPlantAggregateFactory.create.mockReturnValue(mockPlant);
      mockPlantWriteRepository.save.mockResolvedValue(mockPlant);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockPlantWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should return the created plant id', async () => {
      const commandDto: IPlantCreateCommandDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      };

      const command = new PlantCreateCommand(commandDto);
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockPlantAggregateFactory.create.mockReturnValue(mockPlant);
      mockPlantWriteRepository.save.mockResolvedValue(mockPlant);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(plantId);
    });
  });
});
