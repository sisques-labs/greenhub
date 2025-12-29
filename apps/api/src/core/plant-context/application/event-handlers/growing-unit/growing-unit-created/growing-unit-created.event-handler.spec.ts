import { GrowingUnitCreatedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-created/growing-unit-created.event';
import { GrowingUnitCreatedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-created/growing-unit-created.event-handler';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { Test } from '@nestjs/testing';

describe('GrowingUnitCreatedEventHandler', () => {
  let handler: GrowingUnitCreatedEventHandler;
  let mockGrowingUnitReadRepository: jest.Mocked<IGrowingUnitReadRepository>;
  let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
  let mockGrowingUnitViewModelFactory: jest.Mocked<GrowingUnitViewModelFactory>;

  beforeEach(async () => {
    mockGrowingUnitReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGrowingUnitReadRepository>;

    mockAssertGrowingUnitExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

    mockGrowingUnitViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<GrowingUnitViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        GrowingUnitCreatedEventHandler,
        {
          provide: GROWING_UNIT_READ_REPOSITORY_TOKEN,
          useValue: mockGrowingUnitReadRepository,
        },
        {
          provide: AssertGrowingUnitExistsService,
          useValue: mockAssertGrowingUnitExistsService,
        },
        {
          provide: GrowingUnitViewModelFactory,
          useValue: mockGrowingUnitViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<GrowingUnitCreatedEventHandler>(
      GrowingUnitCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save growing unit view model when event is handled', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new GrowingUnitCreatedEvent(
        {
          aggregateId: growingUnitId,
          aggregateType: 'GrowingUnitAggregate',
          eventType: 'GrowingUnitCreatedEvent',
        },
        {
          id: growingUnitId,
          name: 'Garden Bed 1',
          type: GrowingUnitTypeEnum.GARDEN_BED,
          capacity: 10,
          dimensions: null,
          plants: [],
        },
      );

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

      const now = new Date();
      const mockViewModel = new GrowingUnitViewModel({
        id: growingUnitId,
        name: 'Garden Bed 1',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
        dimensions: null,
        plants: [],
        numberOfPlants: 0,
        remainingCapacity: 10,
        volume: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
        mockGrowingUnit,
      );
      mockGrowingUnitViewModelFactory.fromAggregate.mockReturnValue(
        mockViewModel,
      );
      mockGrowingUnitReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        growingUnitId,
      );
      expect(
        mockGrowingUnitViewModelFactory.fromAggregate,
      ).toHaveBeenCalledWith(mockGrowingUnit);
      expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
      expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
