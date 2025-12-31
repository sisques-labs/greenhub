import { PlantTransplantCommand } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command';
import { PlantTransplantCommandHandler } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command-handler';
import { IPlantTransplantCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-transplant/plant-transplant-command.dto';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { IGrowingUnitWriteRepository } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { IPlantWriteRepository } from '@/core/plant-context/domain/repositories/plant/plant-write/plant-write.repository';
import { PlantTransplantService } from '@/core/plant-context/domain/services/plant/plant-transplant/plant-transplant.service';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

describe('PlantTransplantCommandHandler', () => {
  let handler: PlantTransplantCommandHandler;
  let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
  let mockPlantWriteRepository: jest.Mocked<IPlantWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
  let mockPlantTransplantService: jest.Mocked<PlantTransplantService>;
  let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;

  beforeEach(() => {
    mockGrowingUnitWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

    mockPlantWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByGrowingUnitId: jest.fn(),
    } as unknown as jest.Mocked<IPlantWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertGrowingUnitExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

    mockPlantTransplantService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<PlantTransplantService>;

    mockPublishIntegrationEventsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<PublishIntegrationEventsService>;

    handler = new PlantTransplantCommandHandler(
      mockGrowingUnitWriteRepository,
      mockPlantWriteRepository,
      mockEventBus,
      mockAssertGrowingUnitExistsService,
      mockPlantTransplantService,
      mockPublishIntegrationEventsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should transplant plant successfully', async () => {
      const sourceGrowingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const targetGrowingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const plantId = '323e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantTransplantCommandDto = {
        sourceGrowingUnitId,
        targetGrowingUnitId,
        plantId,
      };

      const command = new PlantTransplantCommand(commandDto);
      const sourceGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(sourceGrowingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const targetGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(targetGrowingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 2'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const transplantedPlant = new PlantEntity({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(targetGrowingUnitId),
        name: new PlantNameValueObject('Test Plant'),
        species: new PlantSpeciesValueObject('Test Species'),
        plantedDate: new PlantPlantedDateValueObject(new Date()),
        notes: new PlantNotesValueObject(''),
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      mockAssertGrowingUnitExistsService.execute
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockPlantTransplantService.execute.mockResolvedValue(transplantedPlant);
      mockPlantWriteRepository.save.mockResolvedValue(transplantedPlant);
      mockGrowingUnitWriteRepository.save
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        sourceGrowingUnitId,
      );
      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        targetGrowingUnitId,
      );
      expect(mockPlantTransplantService.execute).toHaveBeenCalledWith({
        sourceGrowingUnit,
        targetGrowingUnit,
        plantId,
      });
      expect(mockPlantWriteRepository.save).toHaveBeenCalledWith(
        transplantedPlant,
      );
      expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
        sourceGrowingUnit,
      );
      expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
        targetGrowingUnit,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(2);
    });

    it('should publish events from both growing units', async () => {
      const sourceGrowingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const targetGrowingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const plantId = '323e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantTransplantCommandDto = {
        sourceGrowingUnitId,
        targetGrowingUnitId,
        plantId,
      };

      const command = new PlantTransplantCommand(commandDto);
      const sourceGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(sourceGrowingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const targetGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(targetGrowingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 2'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const transplantedPlant = new PlantEntity({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(targetGrowingUnitId),
        name: new PlantNameValueObject('Test Plant'),
        species: new PlantSpeciesValueObject('Test Species'),
        plantedDate: new PlantPlantedDateValueObject(new Date()),
        notes: new PlantNotesValueObject(''),
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      mockAssertGrowingUnitExistsService.execute
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockPlantTransplantService.execute.mockResolvedValue(transplantedPlant);
      mockPlantWriteRepository.save.mockResolvedValue(transplantedPlant);
      mockGrowingUnitWriteRepository.save
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        sourceGrowingUnit.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        targetGrowingUnit.getUncommittedEvents(),
      );
    });

    it('should save growing units before publishing events', async () => {
      const sourceGrowingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const targetGrowingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const plantId = '323e4567-e89b-12d3-a456-426614174000';
      const commandDto: IPlantTransplantCommandDto = {
        sourceGrowingUnitId,
        targetGrowingUnitId,
        plantId,
      };

      const command = new PlantTransplantCommand(commandDto);
      const sourceGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(sourceGrowingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const targetGrowingUnit = new GrowingUnitAggregate({
        id: new GrowingUnitUuidValueObject(targetGrowingUnitId),
        name: new GrowingUnitNameValueObject('Garden Bed 2'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      });

      const transplantedPlant = new PlantEntity({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(targetGrowingUnitId),
        name: new PlantNameValueObject('Test Plant'),
        species: new PlantSpeciesValueObject('Test Species'),
        plantedDate: new PlantPlantedDateValueObject(new Date()),
        notes: new PlantNotesValueObject(''),
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      mockAssertGrowingUnitExistsService.execute
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockPlantTransplantService.execute.mockResolvedValue(transplantedPlant);
      mockPlantWriteRepository.save.mockResolvedValue(transplantedPlant);
      mockGrowingUnitWriteRepository.save
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const plantSaveOrder =
        mockPlantWriteRepository.save.mock.invocationCallOrder;
      const growingUnitSaveOrder =
        mockGrowingUnitWriteRepository.save.mock.invocationCallOrder;
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder;
      expect(plantSaveOrder[0]).toBeLessThan(growingUnitSaveOrder[0]);
      expect(growingUnitSaveOrder[0]).toBeLessThan(publishOrder[0]);
      expect(growingUnitSaveOrder[1]).toBeLessThan(publishOrder[1]);
    });
  });
});
