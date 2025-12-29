import { Test } from '@nestjs/testing';
import { GrowingUnitPlantGrowingUnitChangedEventHandler } from '@/core/plant-context/application/event-handlers/plant/growing-unit-plant-growing-unit-changed/growing-unit-plant-growing-unit-changed.event-handler';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitPlantGrowingUnitChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-growing-unit-changed/growing-unit-plant-growing-unit-changed.event';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

describe('GrowingUnitPlantGrowingUnitChangedEventHandler', () => {
  let handler: GrowingUnitPlantGrowingUnitChangedEventHandler;
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
        GrowingUnitPlantGrowingUnitChangedEventHandler,
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

    handler = module.get<GrowingUnitPlantGrowingUnitChangedEventHandler>(
      GrowingUnitPlantGrowingUnitChangedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update both source and destination growing unit view models when plant growing unit is changed', async () => {
      const sourceGrowingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const destinationGrowingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const event = new GrowingUnitPlantGrowingUnitChangedEvent(
        {
          aggregateId: sourceGrowingUnitId,
          aggregateType: 'GrowingUnitAggregate',
          eventType: 'GrowingUnitPlantGrowingUnitChangedEvent',
        },
        {
          id: '323e4567-e89b-12d3-a456-426614174000',
          oldValue: sourceGrowingUnitId,
          newValue: destinationGrowingUnitId,
        },
      );

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

      const destinationGrowingUnit = new GrowingUnitAggregate(
        {
          id: new GrowingUnitUuidValueObject(destinationGrowingUnitId),
          name: new GrowingUnitNameValueObject('Garden Bed 2'),
          type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
          capacity: new GrowingUnitCapacityValueObject(10),
          dimensions: null,
          plants: [],
        },
        false,
      );

      const now = new Date();
      const sourceViewModel = new GrowingUnitViewModel({
        id: sourceGrowingUnitId,
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

      const destinationViewModel = new GrowingUnitViewModel({
        id: destinationGrowingUnitId,
        name: 'Garden Bed 2',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
        dimensions: null,
        plants: [],
        numberOfPlants: 1,
        remainingCapacity: 9,
        volume: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertGrowingUnitExistsService.execute
        .mockResolvedValueOnce(sourceGrowingUnit)
        .mockResolvedValueOnce(destinationGrowingUnit);
      mockGrowingUnitViewModelFactory.fromAggregate
        .mockReturnValueOnce(sourceViewModel)
        .mockReturnValueOnce(destinationViewModel);
      mockGrowingUnitReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        sourceGrowingUnitId,
      );
      expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
        destinationGrowingUnitId,
      );
      expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledWith(
        sourceViewModel,
      );
      expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledWith(
        destinationViewModel,
      );
      expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledTimes(2);
    });
  });
});
