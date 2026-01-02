import { Test } from '@nestjs/testing';

import { LocationUpdatedEventHandler } from '@/core/location-context/application/event-handlers/location/location-updated/location-updated.event-handler';
import { LocationUpdatedEvent } from '@/core/location-context/application/events/location/location-updated/location-updated.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationViewModelFactory } from '@/core/location-context/domain/factories/view-models/location-view-model/location-view-model.factory';
import {
	LOCATION_READ_REPOSITORY_TOKEN,
	ILocationReadRepository,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationUpdatedEventHandler', () => {
	let handler: LocationUpdatedEventHandler;
	let mockLocationReadRepository: jest.Mocked<ILocationReadRepository>;
	let mockAssertLocationExistsService: jest.Mocked<AssertLocationExistsService>;
	let mockLocationViewModelFactory: jest.Mocked<LocationViewModelFactory>;

	beforeEach(async () => {
		mockLocationReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationReadRepository>;

		mockAssertLocationExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertLocationExistsService>;

		mockLocationViewModelFactory = {
			create: jest.fn(),
			fromPrimitives: jest.fn(),
			fromAggregate: jest.fn(),
		} as unknown as jest.Mocked<LocationViewModelFactory>;

		const module = await Test.createTestingModule({
			providers: [
				LocationUpdatedEventHandler,
				{
					provide: LOCATION_READ_REPOSITORY_TOKEN,
					useValue: mockLocationReadRepository,
				},
				{
					provide: AssertLocationExistsService,
					useValue: mockAssertLocationExistsService,
				},
				{
					provide: LocationViewModelFactory,
					useValue: mockLocationViewModelFactory,
				},
			],
		}).compile();

		handler = module.get<LocationUpdatedEventHandler>(
			LocationUpdatedEventHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should update and save location view model when event is handled', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const event = new LocationUpdatedEvent(
				{
					aggregateRootId: locationId,
					aggregateRootType: 'LocationAggregate',
					entityId: locationId,
					entityType: 'LocationAggregate',
					eventType: 'LocationUpdatedEvent',
				},
				{
					id: locationId,
					name: 'Living Room Updated',
					type: LocationTypeEnum.ROOM,
					description: 'Updated description',
					parentLocationId: null,
				},
			);

			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room Updated'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			const now = new Date();
			const mockViewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room Updated',
				type: LocationTypeEnum.ROOM,
				description: 'Updated description',
				createdAt: now,
				updatedAt: now,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationViewModelFactory.fromAggregate.mockReturnValue(mockViewModel);
			mockLocationReadRepository.save.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocationViewModelFactory.fromAggregate).toHaveBeenCalledWith(
				mockLocation,
			);
			expect(mockLocationReadRepository.save).toHaveBeenCalledWith(
				mockViewModel,
			);
			expect(mockLocationReadRepository.save).toHaveBeenCalledTimes(1);
		});
	});
});

