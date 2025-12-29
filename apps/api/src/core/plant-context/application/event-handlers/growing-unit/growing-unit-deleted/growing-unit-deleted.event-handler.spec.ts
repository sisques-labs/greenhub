import { GrowingUnitDeletedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-deleted/growing-unit-deleted.event-handler';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitDeletedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { Test } from '@nestjs/testing';

describe('GrowingUnitDeletedEventHandler', () => {
  let handler: GrowingUnitDeletedEventHandler;
  let mockGrowingUnitReadRepository: jest.Mocked<IGrowingUnitReadRepository>;

  beforeEach(async () => {
    mockGrowingUnitReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGrowingUnitReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        GrowingUnitDeletedEventHandler,
        {
          provide: GROWING_UNIT_READ_REPOSITORY_TOKEN,
          useValue: mockGrowingUnitReadRepository,
        },
      ],
    }).compile();

    handler = module.get<GrowingUnitDeletedEventHandler>(
      GrowingUnitDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete growing unit view model when event is handled', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new GrowingUnitDeletedEvent(
        {
          aggregateId: growingUnitId,
          aggregateType: 'GrowingUnitAggregate',
          eventType: 'GrowingUnitDeletedEvent',
        },
        {
          id: growingUnitId,
          name: 'Garden Bed 1',
          type: 'GARDEN_BED',
          capacity: 10,
          dimensions: null,
          plants: [],
        },
      );

      mockGrowingUnitReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockGrowingUnitReadRepository.delete).toHaveBeenCalledWith(
        growingUnitId,
      );
      expect(mockGrowingUnitReadRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
