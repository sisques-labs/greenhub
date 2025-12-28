import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { Test } from '@nestjs/testing';
import { PlantUpdatedContainerEventHandler } from './plant-updated.event-handler';

describe('PlantUpdatedContainerEventHandler', () => {
  let handler: PlantUpdatedContainerEventHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PlantUpdatedContainerEventHandler],
    }).compile();

    handler = module.get<PlantUpdatedContainerEventHandler>(
      PlantUpdatedContainerEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should do nothing when event is handled', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {
          name: 'Updated Name',
          species: 'Updated Species',
        },
      );

      await handler.handle(event);

      // Handler should complete without errors
      expect(true).toBe(true);
    });

    it('should handle event without throwing errors', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      const event = new PlantUpdatedEvent(
        {
          aggregateId: plantId,
          aggregateType: 'PlantAggregate',
          eventType: 'PlantUpdatedEvent',
        },
        {},
      );

      await expect(handler.handle(event)).resolves.not.toThrow();
    });
  });
});
