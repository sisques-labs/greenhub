import { Test } from '@nestjs/testing';

import { LocationDeletedEventHandler } from '@/core/location-context/application/event-handlers/location/location-deleted/location-deleted.event-handler';
import { LocationDeletedEvent } from '@/core/location-context/application/events/location/location-deleted/location-deleted.event';
import {
	LOCATION_READ_REPOSITORY_TOKEN,
	ILocationReadRepository,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';

describe('LocationDeletedEventHandler', () => {
	let handler: LocationDeletedEventHandler;
	let mockLocationReadRepository: jest.Mocked<ILocationReadRepository>;

	beforeEach(async () => {
		mockLocationReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationReadRepository>;

		const module = await Test.createTestingModule({
			providers: [
				LocationDeletedEventHandler,
				{
					provide: LOCATION_READ_REPOSITORY_TOKEN,
					useValue: mockLocationReadRepository,
				},
			],
		}).compile();

		handler = module.get<LocationDeletedEventHandler>(
			LocationDeletedEventHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should delete location view model when event is handled', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const event = new LocationDeletedEvent(
				{
					aggregateRootId: locationId,
					aggregateRootType: 'LocationAggregate',
					entityId: locationId,
					entityType: 'LocationAggregate',
					eventType: 'LocationDeletedEvent',
				},
				{
					id: locationId,
					name: 'Living Room',
					type: LocationTypeEnum.ROOM,
					description: 'North-facing room with good sunlight',
					parentLocationId: null,
				},
			);

			mockLocationReadRepository.delete.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockLocationReadRepository.delete).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocationReadRepository.delete).toHaveBeenCalledTimes(1);
		});
	});
});

