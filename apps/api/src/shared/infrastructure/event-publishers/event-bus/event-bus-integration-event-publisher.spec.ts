import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { EventBusIntegrationEventPublisher } from '@/shared/infrastructure/event-publishers/event-bus/event-bus-integration-event-publisher';

// Mock event class for testing
class TestIntegrationEvent extends BaseEvent<{ test: string }> {
	constructor(metadata: IEventMetadata, data: { test: string }) {
		super(metadata, data);
	}
}

describe('EventBusIntegrationEventPublisher', () => {
	let publisher: EventBusIntegrationEventPublisher;
	let mockEventBus: jest.Mocked<EventBus>;

	beforeEach(async () => {
		mockEventBus = {
			publishAll: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		const module = await Test.createTestingModule({
			providers: [
				EventBusIntegrationEventPublisher,
				{
					provide: EventBus,
					useValue: mockEventBus,
				},
			],
		}).compile();

		publisher = module.get<EventBusIntegrationEventPublisher>(
			EventBusIntegrationEventPublisher,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('publish', () => {
		it('should publish a single event via EventBus', async () => {
			const metadata: IEventMetadata = {
				eventType: 'TestIntegrationEvent',
				aggregateRootId: '123e4567-e89b-12d3-a456-426614174000',
				aggregateRootType: 'Test',
				entityId: '123e4567-e89b-12d3-a456-426614174000',
				entityType: 'Test',
			};
			const event = new TestIntegrationEvent(metadata, { test: 'data' });

			await publisher.publish(event);

			expect(mockEventBus.publishAll).toHaveBeenCalledWith([event]);
			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
		});

		it('should publish multiple events via EventBus', async () => {
			const metadata1: IEventMetadata = {
				eventType: 'TestIntegrationEvent1',
				aggregateRootId: '123e4567-e89b-12d3-a456-426614174000',
				aggregateRootType: 'Test',
				entityId: '123e4567-e89b-12d3-a456-426614174000',
				entityType: 'Test',
			};
			const metadata2: IEventMetadata = {
				eventType: 'TestIntegrationEvent2',
				aggregateRootId: '223e4567-e89b-12d3-a456-426614174000',
				aggregateRootType: 'Test',
				entityId: '223e4567-e89b-12d3-a456-426614174000',
				entityType: 'Test',
			};
			const event1 = new TestIntegrationEvent(metadata1, { test: 'data1' });
			const event2 = new TestIntegrationEvent(metadata2, { test: 'data2' });
			const events = [event1, event2];

			await publisher.publish(events);

			expect(mockEventBus.publishAll).toHaveBeenCalledWith(events);
			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
		});

		it('should normalize single event to array before publishing', async () => {
			const metadata: IEventMetadata = {
				eventType: 'TestIntegrationEvent',
				aggregateRootId: '123e4567-e89b-12d3-a456-426614174000',
				aggregateRootType: 'Test',
				entityId: '123e4567-e89b-12d3-a456-426614174000',
				entityType: 'Test',
			};
			const event = new TestIntegrationEvent(metadata, { test: 'data' });

			await publisher.publish(event);

			// Verify that publishAll receives an array, not the single event
			const callArgs = mockEventBus.publishAll.mock.calls[0][0];
			expect(Array.isArray(callArgs)).toBe(true);
			expect(callArgs.length).toBe(1);
			expect(callArgs[0]).toBe(event);
		});

		it('should publish empty array if provided', async () => {
			await publisher.publish([]);

			expect(mockEventBus.publishAll).toHaveBeenCalledWith([]);
			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
		});
	});
});
