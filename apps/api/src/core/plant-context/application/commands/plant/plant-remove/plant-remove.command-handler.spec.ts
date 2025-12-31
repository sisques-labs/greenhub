import { PlantRemoveCommand } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command';
import { PlantRemoveCommandHandler } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command-handler';
import { IPlantRemoveCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-remove/plant-remove-command.dto';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitPlantRemovedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-removed/growing-unit-plant-removed.event';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { IGrowingUnitWriteRepository } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { IPlantWriteRepository } from '@/core/plant-context/domain/repositories/plant/plant-write/plant-write.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { EventBus } from '@nestjs/cqrs';

describe('PlantRemoveCommandHandler', () => {
  let handler: PlantRemoveCommandHandler;
  let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
  let mockPlantWriteRepository: jest.Mocked<IPlantWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
  let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;
  let plantEntityFactory: PlantEntityFactory;

  beforeEach(() => {
    plantEntityFactory = new PlantEntityFactory();
    mockGrowingUnitWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

    mockPlantWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IPlantWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertGrowingUnitExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

    mockPublishIntegrationEventsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<PublishIntegrationEventsService>;

    handler = new PlantRemoveCommandHandler(
      mockGrowingUnitWriteRepository,
      mockPlantWriteRepository,
      mockEventBus,
      mockAssertGrowingUnitExistsService,
      mockPublishIntegrationEventsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should remove plant from growing unit successfully', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const plantId = '223e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantRemoveCommandDto = {
        growingUnitId,
        plantId,
      };

      const command = new PlantRemoveCommand(commandDto);
      const mockGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(growingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const plant = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      mockGrowingUnit.addPlant(plant, false);

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockPlantWriteRepository.delete.mockResolvedValue(undefined);
      mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        growingUnitId,
      );
      expect(mockPlantWriteRepository.delete).toHaveBeenCalledWith(plantId);
      expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
        mockGrowingUnit,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockGrowingUnit.getUncommittedEvents(),
      );
    });

    it('should not throw error when plant does not exist in growing unit', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const plantId = '223e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantRemoveCommandDto = {
        growingUnitId,
        plantId,
      };

      const command = new PlantRemoveCommand(commandDto);
      const mockGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(growingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );

      await handler.execute(command);

      expect(mockPlantWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockGrowingUnitWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish GrowingUnitPlantRemovedEvent when plant is removed', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const plantId = '223e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantRemoveCommandDto = {
        growingUnitId,
        plantId,
      };

      const command = new PlantRemoveCommand(commandDto);
      const mockGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(growingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const plant = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      mockGrowingUnit.addPlant(plant, false);

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockPlantWriteRepository.delete.mockResolvedValue(undefined);

      // Make save return the same object to preserve events
      mockGrowingUnitWriteRepository.save.mockImplementation(
        async (aggregate) => aggregate,
      );

      // Capture the events that are passed to publishAll
      let capturedEvents: any[] = [];
      mockEventBus.publishAll.mockImplementation(async (events) => {
        capturedEvents = Array.isArray(events) ? [...events] : [];
        return undefined;
      });

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(capturedEvents.length).toBeGreaterThanOrEqual(1);
      const removedEvent = capturedEvents.find(
        (e) => e instanceof GrowingUnitPlantRemovedEvent,
      );
      expect(removedEvent).toBeInstanceOf(GrowingUnitPlantRemovedEvent);
    });
  });
});
