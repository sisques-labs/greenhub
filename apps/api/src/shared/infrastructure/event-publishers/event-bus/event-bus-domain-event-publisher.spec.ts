import { EventBus, IEvent } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { EventBusDomainEventPublisher } from '@/shared/infrastructure/event-publishers/event-bus/event-bus-domain-event-publisher';

// Mock domain event classes for testing
class TestDomainEvent1 implements IEvent {
	constructor(public readonly data: string) {}
}

class TestDomainEvent2 implements IEvent {
	constructor(public readonly data: string) {}
}

describe('EventBusDomainEventPublisher', () => {
	let publisher: EventBusDomainEventPublisher;
	let mockEventBus: jest.Mocked<EventBus>;

	beforeEach(async () => {
		mockEventBus = {
			publishAll: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		const module = await Test.createTestingModule({
			providers: [
				EventBusDomainEventPublisher,
				{
					provide: EventBus,
					useValue: mockEventBus,
				},
			],
		}).compile();

		publisher = module.get<EventBusDomainEventPublisher>(
			EventBusDomainEventPublisher,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('publishAll', () => {
		it('should publish domain events via EventBus', async () => {
			const event1 = new TestDomainEvent1('test1');
			const event2 = new TestDomainEvent2('test2');
			const events = [event1, event2];

			await publisher.publishAll(events);

			expect(mockEventBus.publishAll).toHaveBeenCalledWith(events);
			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
		});

		it('should publish empty array if no events', async () => {
			await publisher.publishAll([]);

			expect(mockEventBus.publishAll).toHaveBeenCalledWith([]);
			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
		});

		it('should publish single domain event', async () => {
			const event = new TestDomainEvent1('test');
			const events = [event];

			await publisher.publishAll(events);

			expect(mockEventBus.publishAll).toHaveBeenCalledWith(events);
			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
		});

		it('should pass events array as-is to EventBus', async () => {
			const event1 = new TestDomainEvent1('test1');
			const event2 = new TestDomainEvent2('test2');
			const events = [event1, event2];

			await publisher.publishAll(events);

			const callArgs = mockEventBus.publishAll.mock.calls[0][0];
			expect(callArgs).toBe(events);
			expect(callArgs.length).toBe(2);
		});
	});
});
