import { Test } from '@nestjs/testing';

import { LocationUpdatedEventHandler } from '@/core/location-context/application/event-handlers/location/location-updated/location-updated.event-handler';
import { LocationUpdatedEvent } from '@/core/location-context/application/events/location/location-updated/location-updated.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationViewModelBuilder } from '@/core/location-context/domain/builders/view-models/location-view-model/location-view-model.builder';
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
	let mockLocationViewModelBuilder: jest.Mocked<LocationViewModelBuilder>;

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

		mockLocationViewModelBuilder = {
			withId: jest.fn().mockReturnThis(),
			withName: jest.fn().mockReturnThis(),
			withType: jest.fn().mockReturnThis(),
			withDescription: jest.fn().mockReturnThis(),
			withCreatedAt: jest.fn().mockReturnThis(),
			withUpdatedAt: jest.fn().mockReturnThis(),
			fromPrimitives: jest.fn().mockReturnThis(),
			fromAggregate: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<LocationViewModelBuilder>;

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
					provide: LocationViewModelBuilder,
					useValue: mockLocationViewModelBuilder,
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
			mockLocationViewModelBuilder.build.mockReturnValue(mockViewModel);
			mockLocationReadRepository.save.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocationViewModelBuilder.fromAggregate).toHaveBeenCalledWith(
				mockLocation,
			);
			expect(mockLocationReadRepository.save).toHaveBeenCalledWith(
				mockViewModel,
			);
			expect(mockLocationReadRepository.save).toHaveBeenCalledTimes(1);
		});
	});
});

