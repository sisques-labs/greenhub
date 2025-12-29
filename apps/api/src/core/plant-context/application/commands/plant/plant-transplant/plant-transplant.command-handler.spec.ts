import { EventBus } from '@nestjs/cqrs';
import { PlantTransplantCommand } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command';
import { PlantTransplantCommandHandler } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command-handler';
import { IPlantTransplantCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-transplant/plant-transplant-command.dto';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { PlantTransplantService } from '@/core/plant-context/domain/services/plant/plant-transplant/plant-transplant.service';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantTransplantCommandHandler', () => {
  let handler: PlantTransplantCommandHandler;
  let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
  let mockPlantTransplantService: jest.Mocked<PlantTransplantService>;

  beforeEach(() => {
    mockGrowingUnitWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

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

    handler = new PlantTransplantCommandHandler(
      mockGrowingUnitWriteRepository,
      mockEventBus,
      mockAssertGrowingUnitExistsService,
      mockPlantTransplantService,
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
      const sourceGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(sourceGrowingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 1'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      const targetGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(targetGrowingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 2'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      mockAssertGrowingUnitExistsService.execute
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockPlantTransplantService.execute.mockResolvedValue(undefined);
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
      const sourceGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(sourceGrowingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 1'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      const targetGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(targetGrowingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 2'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      mockAssertGrowingUnitExistsService.execute
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockPlantTransplantService.execute.mockResolvedValue(undefined);
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
      const sourceGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(sourceGrowingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 1'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      const targetGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(targetGrowingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 2'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      mockAssertGrowingUnitExistsService.execute
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockPlantTransplantService.execute.mockResolvedValue(undefined);
      mockGrowingUnitWriteRepository.save
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(targetGrowingUnit);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockGrowingUnitWriteRepository.save.mock.invocationCallOrder;
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder;
      expect(saveOrder[0]).toBeLessThan(publishOrder[0]);
      expect(saveOrder[1]).toBeLessThan(publishOrder[1]);
    });
  });
});
