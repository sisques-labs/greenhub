import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IUserEventData } from '@/shared/domain/events/users/interfaces/user-event-data.interface';
import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('UserUpdatedEvent', () => {
	const createMetadata = (): IEventMetadata => ({
		aggregateRootId: '123e4567-e89b-12d3-a456-426614174000',
		aggregateRootType: 'UserAggregate',
		entityId: '123e4567-e89b-12d3-a456-426614174000',
		entityType: 'UserAggregate',
		eventType: 'UserUpdatedEvent',
	});

	const createPartialUserData = (): Partial<Omit<IUserEventData, 'id'>> => ({
		name: 'Jane',
		lastName: 'Smith',
		bio: 'Updated bio',
	});

	it('should be an instance of BaseEvent', () => {
		const metadata = createMetadata();
		const data = createPartialUserData();

		const event = new UserUpdatedEvent(metadata, data);

		expect(event).toBeInstanceOf(BaseEvent);
	});

	it('should create an event with correct metadata', () => {
		const metadata = createMetadata();
		const data = createPartialUserData();

		const event = new UserUpdatedEvent(metadata, data);

		expect(event.aggregateRootId).toBe(metadata.aggregateRootId);
		expect(event.aggregateRootType).toBe(metadata.aggregateRootType);
		expect(event.entityId).toBe(metadata.entityId);
		expect(event.entityType).toBe(metadata.entityType);
		expect(event.eventType).toBe(metadata.eventType);
	});

	it('should store partial user data correctly', () => {
		const metadata = createMetadata();
		const data = createPartialUserData();

		const event = new UserUpdatedEvent(metadata, data);

		expect(event.data).toEqual(data);
		expect(event.data.name).toBe(data.name);
		expect(event.data.bio).toBe(data.bio);
	});

	it('should allow partial data updates', () => {
		const metadata = createMetadata();
		const data = { name: 'Only Name' };

		const event = new UserUpdatedEvent(metadata, data);

		expect(event.data).toEqual(data);
		expect(event.data.name).toBe('Only Name');
	});

	it('should generate a unique eventId', () => {
		const metadata = createMetadata();
		const data = createPartialUserData();

		const event1 = new UserUpdatedEvent(metadata, data);
		const event2 = new UserUpdatedEvent(metadata, data);

		expect(event1.eventId).not.toBe(event2.eventId);
	});
});
