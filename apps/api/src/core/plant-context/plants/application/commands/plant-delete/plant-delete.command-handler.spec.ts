import { IPlantDeleteCommandDto } from '@/core/plant-context/plants/application/dtos/commands/plant-delete/plant-delete-command.dto';
import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantDeletedEvent } from '@/shared/domain/events/features/plants/plant-deleted/plant-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { PlantDeleteCommand } from './plant-delete.command';
import { PlantDeleteCommandHandler } from './plant-delete.command-handler';

describe('PlantDeleteCommandHandler', () => {
  let handler: PlantDeleteCommandHandler;
  let mockPlantWriteRepository: jest.Mocked<PlantWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertPlantExistsService: jest.Mocked<AssertPlantExistsService>;

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

    mockAssertPlantExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPlantExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        PlantDeleteCommandHandler,
        {
          provide: PLANT_WRITE_REPOSITORY_TOKEN,
          useValue: mockPlantWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertPlantExistsService,
          useValue: mockAssertPlantExistsService,
        },
      ],
    }).compile();

    handler = module.get<PlantDeleteCommandHandler>(PlantDeleteCommandHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete plant successfully when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantDeleteCommandDto = {
        id: plantId,
      };

      const command = new PlantDeleteCommand(commandDto);
      const now = new Date();
      const existingPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertPlantExistsService.execute.mockResolvedValue(existingPlant);
      mockPlantWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
        plantId,
      );
      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledTimes(1);
      expect(mockPlantWriteRepository.delete).toHaveBeenCalledWith(plantId);
      expect(mockPlantWriteRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when plant does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantDeleteCommandDto = {
        id: plantId,
      };

      const command = new PlantDeleteCommand(commandDto);
      const error = new PlantNotFoundException(plantId);

      mockAssertPlantExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
        plantId,
      );
      expect(mockPlantWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish PlantDeletedEvent when plant is deleted', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantDeleteCommandDto = {
        id: plantId,
      };

      const command = new PlantDeleteCommand(commandDto);
      const now = new Date();
      const existingPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertPlantExistsService.execute.mockResolvedValue(existingPlant);
      mockPlantWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      const publishedEvents = mockEventBus.publishAll.mock.calls[0]?.[0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents && publishedEvents.length > 0) {
        const deletedEvent = publishedEvents.find(
          (e) => e instanceof PlantDeletedEvent,
        );
        expect(deletedEvent).toBeInstanceOf(PlantDeletedEvent);
      }
    });

    it('should delete plant from repository before publishing events', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantDeleteCommandDto = {
        id: plantId,
      };

      const command = new PlantDeleteCommand(commandDto);
      const now = new Date();
      const existingPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertPlantExistsService.execute.mockResolvedValue(existingPlant);
      mockPlantWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const deleteOrder =
        mockPlantWriteRepository.delete.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(publishOrder);
    });
  });
});
