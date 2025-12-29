import { PlantUpdateCommand } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command';
import { PlantUpdateCommandHandler } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command-handler';
import { IPlantUpdateCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-update/plant-update-command.dto';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsService } from '@/core/plant-context/application/services/plant/assert-plant-exists/assert-plant-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { IGrowingUnitWriteRepository } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitPlantNameChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-name-changed/growing-unit-plant-name-changed.event';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { EventBus } from '@nestjs/cqrs';

describe('PlantUpdateCommandHandler', () => {
  let handler: PlantUpdateCommandHandler;
  let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertPlantExistsService: jest.Mocked<AssertPlantExistsService>;
  let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
  let plantEntityFactory: PlantEntityFactory;

  beforeEach(() => {
    plantEntityFactory = new PlantEntityFactory();
    mockGrowingUnitWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertPlantExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPlantExistsService>;

    mockAssertGrowingUnitExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

    handler = new PlantUpdateCommandHandler(
      mockGrowingUnitWriteRepository,
      mockEventBus,
      mockAssertPlantExistsService,
      mockAssertGrowingUnitExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update plant name successfully', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const plantId = '223e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantUpdateCommandDto = {
        id: plantId,
        name: 'Sweet Basil',
      };

      const command = new PlantUpdateCommand(commandDto);
      const mockPlant = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      const mockGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(growingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 1'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      mockGrowingUnit.addPlant(mockPlant, false);

      mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
        plantId,
      );
      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        growingUnitId,
      );
      const updatedPlant = mockGrowingUnit.getPlantById(plantId);
      expect(updatedPlant?.name.value).toBe('Sweet Basil');
      expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
        mockGrowingUnit,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockGrowingUnit.getUncommittedEvents(),
      );
    });

    it('should update plant status successfully', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const plantId = '223e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantUpdateCommandDto = {
        id: plantId,
        status: PlantStatusEnum.GROWING,
      };

      const command = new PlantUpdateCommand(commandDto);
      const mockPlant = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      const mockGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(growingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 1'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      mockGrowingUnit.addPlant(mockPlant, false);

      mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const updatedPlant = mockGrowingUnit.getPlantById(plantId);
      expect(updatedPlant?.status.value).toBe(PlantStatusEnum.GROWING);
    });

    it('should publish events after updating', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const plantId = '223e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantUpdateCommandDto = {
        id: plantId,
        name: 'Sweet Basil',
      };

      const command = new PlantUpdateCommand(commandDto);
      const mockPlant = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      const mockGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(growingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 1'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      mockGrowingUnit.addPlant(mockPlant, false);

      mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );

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
      const nameChangedEvent = capturedEvents.find(
        (e) => e instanceof GrowingUnitPlantNameChangedEvent,
      );
      expect(nameChangedEvent).toBeInstanceOf(GrowingUnitPlantNameChangedEvent);
    });
  });
});
