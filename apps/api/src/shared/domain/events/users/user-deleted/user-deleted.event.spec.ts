import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IUserEventData } from '@/shared/domain/events/users/interfaces/user-event-data.interface';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('UserDeletedEvent', () => {
	const createMetadata = (): IEventMetadata => ({
		aggregateRootId: '123e4567-e89b-12d3-a456-426614174000',
		aggregateRootType: 'UserAggregate',
		entityId: '123e4567-e89b-12d3-a456-426614174000',
		entityType: 'UserAggregate',
		eventType: 'UserDeletedEvent',
	});

	const createUserData = (): IUserEventData => ({
		id: '123e4567-e89b-12d3-a456-426614174000',
		avatarUrl: null,
		bio: null,
		lastName: 'Doe',
		name: 'John',
		role: 'user',
		status: 'deleted',
		userName: 'johndoe',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	it('should be an instance of BaseEvent', () => {
		const metadata = createMetadata();
		const data = createUserData();

		const event = new UserDeletedEvent(metadata, data);

		expect(event).toBeInstanceOf(BaseEvent);
	});

	it('should create an event with correct metadata', () => {
		const metadata = createMetadata();
		const data = createUserData();

		const event = new UserDeletedEvent(metadata, data);

		expect(event.aggregateRootId).toBe(metadata.aggregateRootId);
		expect(event.aggregateRootType).toBe(metadata.aggregateRootType);
		expect(event.entityId).toBe(metadata.entityId);
		expect(event.entityType).toBe(metadata.entityType);
		expect(event.eventType).toBe(metadata.eventType);
	});

	it('should store the user data correctly', () => {
		const metadata = createMetadata();
		const data = createUserData();

		const event = new UserDeletedEvent(metadata, data);

		expect(event.data).toEqual(data);
		expect(event.data.id).toBe(data.id);
		expect(event.data.status).toBe('deleted');
	});

	it('should generate a unique eventId', () => {
		const metadata = createMetadata();
		const data = createUserData();

		const event1 = new UserDeletedEvent(metadata, data);
		const event2 = new UserDeletedEvent(metadata, data);

		expect(event1.eventId).not.toBe(event2.eventId);
	});
});
