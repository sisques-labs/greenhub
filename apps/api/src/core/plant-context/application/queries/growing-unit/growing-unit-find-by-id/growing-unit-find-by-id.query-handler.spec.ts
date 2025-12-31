import { IGrowingUnitFindByIdQueryDto } from '@/core/plant-context/application/dtos/queries/growing-unit/growing-unit-find-by-id/growing-unit-find-by-id.dto';
import { GrowingUnitFindByIdQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-id/growing-unit-find-by-id.query';
import { GrowingUnitFindByIdQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-id/growing-unit-find-by-id.query-handler';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

describe('GrowingUnitFindByIdQueryHandler', () => {
  let handler: GrowingUnitFindByIdQueryHandler;
  let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;

  beforeEach(() => {
    mockAssertGrowingUnitExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

    handler = new GrowingUnitFindByIdQueryHandler(
      mockAssertGrowingUnitExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return growing unit aggregate when found', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IGrowingUnitFindByIdQueryDto = {
        id: growingUnitId,
      };

      const query = new GrowingUnitFindByIdQuery(queryDto);
      const mockGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(growingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 1'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
      });

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockGrowingUnit);
      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        growingUnitId,
      );
      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw exception when growing unit does not exist', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IGrowingUnitFindByIdQueryDto = {
        id: growingUnitId,
      };

      const query = new GrowingUnitFindByIdQuery(queryDto);
      const error = new Error('Growing unit not found');

      mockAssertGrowingUnitExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        growingUnitId,
      );
    });
  });
});
