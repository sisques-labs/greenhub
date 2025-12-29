import { EventBus } from '@nestjs/cqrs';
import { GrowingUnitDeleteCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command';
import { GrowingUnitDeleteCommandHandler } from '@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command-handler';
import { IGrowingUnitDeleteCommandDto } from '@/core/plant-context/application/dtos/commands/growing-unit/growing-unit-delete/growing-unit-delete-command.dto';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitDeletedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

describe('GrowingUnitDeleteCommandHandler', () => {
  let handler: GrowingUnitDeleteCommandHandler;
  let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;

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

    handler = new GrowingUnitDeleteCommandHandler(
      mockGrowingUnitWriteRepository,
      mockEventBus,
      mockAssertGrowingUnitExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete growing unit successfully', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IGrowingUnitDeleteCommandDto = {
        id: growingUnitId,
      };

      const command = new GrowingUnitDeleteCommand(commandDto);
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

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockGrowingUnitWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        growingUnitId,
      );
      expect(mockGrowingUnitWriteRepository.delete).toHaveBeenCalledWith(
        growingUnitId,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockGrowingUnit.getUncommittedEvents(),
      );
    });

    it('should publish GrowingUnitDeletedEvent when growing unit is deleted', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IGrowingUnitDeleteCommandDto = {
        id: growingUnitId,
      };

      const command = new GrowingUnitDeleteCommand(commandDto);
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

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockGrowingUnitWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const uncommittedEvents = mockGrowingUnit.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(GrowingUnitDeletedEvent);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(uncommittedEvents);
    });

    it('should delete growing unit before publishing events', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IGrowingUnitDeleteCommandDto = {
        id: growingUnitId,
      };

      const command = new GrowingUnitDeleteCommand(commandDto);
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

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockGrowingUnitWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const deleteOrder =
        mockGrowingUnitWriteRepository.delete.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(publishOrder);
    });

    it('should throw exception when growing unit does not exist', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IGrowingUnitDeleteCommandDto = {
        id: growingUnitId,
      };

      const command = new GrowingUnitDeleteCommand(commandDto);
      const error = new Error('Growing unit not found');

      mockAssertGrowingUnitExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockGrowingUnitWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });
  });
});
