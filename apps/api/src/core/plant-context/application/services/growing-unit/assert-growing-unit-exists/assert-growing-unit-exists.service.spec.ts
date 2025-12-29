import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitNotFoundException } from '@/core/plant-context/application/exceptions/growing-unit/growing-unit-not-found/growing-unit-not-found.exception';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { Test } from '@nestjs/testing';

describe('AssertGrowingUnitExistsService', () => {
  let service: AssertGrowingUnitExistsService;
  let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;

  beforeEach(async () => {
    mockGrowingUnitWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertGrowingUnitExistsService,
        {
          provide: GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
          useValue: mockGrowingUnitWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertGrowingUnitExistsService>(
      AssertGrowingUnitExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return growing unit aggregate when found', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
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

      mockGrowingUnitWriteRepository.findById.mockResolvedValue(
        mockGrowingUnit,
      );

      const result = await service.execute(growingUnitId);

      expect(result).toBe(mockGrowingUnit);
      expect(mockGrowingUnitWriteRepository.findById).toHaveBeenCalledWith(
        growingUnitId,
      );
      expect(mockGrowingUnitWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw GrowingUnitNotFoundException when growing unit does not exist', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';

      mockGrowingUnitWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(growingUnitId)).rejects.toThrow(
        GrowingUnitNotFoundException,
      );
      expect(mockGrowingUnitWriteRepository.findById).toHaveBeenCalledWith(
        growingUnitId,
      );
    });

    it('should throw exception with correct message', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';

      mockGrowingUnitWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(growingUnitId)).rejects.toThrow(
        `Growing unit with id ${growingUnitId} not found`,
      );
    });
  });
});
