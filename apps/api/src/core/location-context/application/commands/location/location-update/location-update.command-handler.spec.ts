import { EventBus } from '@nestjs/cqrs';

import { LocationUpdateCommand } from '@/core/location-context/application/commands/location/location-update/location-update.command';
import { LocationUpdateCommandHandler } from '@/core/location-context/application/commands/location/location-update/location-update.command-handler';
import { ILocationUpdateCommandDto } from '@/core/location-context/application/dtos/commands/location/location-update/location-update-command.dto';
import { LocationUpdatedEvent } from '@/core/location-context/application/events/location/location-updated/location-updated.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { ILocationWriteRepository } from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationUpdateCommandHandler', () => {
	let handler: LocationUpdateCommandHandler;
	let mockLocationWriteRepository: jest.Mocked<ILocationWriteRepository>;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;
	let mockAssertLocationExistsService: jest.Mocked<AssertLocationExistsService>;
	let mockEventBus: jest.Mocked<EventBus>;

	beforeEach(() => {
		mockLocationWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationWriteRepository>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		mockAssertLocationExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertLocationExistsService>;

		mockEventBus = {
			publishAll: jest.fn(),
			publish: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		handler = new LocationUpdateCommandHandler(
			mockLocationWriteRepository,
			mockPublishIntegrationEventsService,
			mockAssertLocationExistsService,
			mockEventBus,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should update location name successfully', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationUpdateCommandDto = {
				id: locationId,
				name: 'Living Room Updated',
			};

			const command = new LocationUpdateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocation.name.value).toBe('Living Room Updated');
			expect(mockLocationWriteRepository.save).toHaveBeenCalledWith(
				mockLocation,
			);
			expect(mockEventBus.publishAll).toHaveBeenCalledWith(
				mockLocation.getUncommittedEvents(),
			);
		});

		it('should update location type successfully', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationUpdateCommandDto = {
				id: locationId,
				type: LocationTypeEnum.BALCONY,
			};

			const command = new LocationUpdateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockLocation.type.value).toBe(LocationTypeEnum.BALCONY);
			expect(mockLocationWriteRepository.save).toHaveBeenCalledWith(
				mockLocation,
			);
		});

		it('should update location description successfully', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationUpdateCommandDto = {
				id: locationId,
				description: 'Updated description',
			};

			const command = new LocationUpdateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockLocation.description?.value).toBe('Updated description');
			expect(mockLocationWriteRepository.save).toHaveBeenCalledWith(
				mockLocation,
			);
		});

		it('should update multiple fields at once', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationUpdateCommandDto = {
				id: locationId,
				name: 'Living Room Updated',
				type: LocationTypeEnum.BALCONY,
				description: 'Updated description',
			};

			const command = new LocationUpdateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockLocation.name.value).toBe('Living Room Updated');
			expect(mockLocation.type.value).toBe(LocationTypeEnum.BALCONY);
			expect(mockLocation.description?.value).toBe('Updated description');
		});

		it('should publish LocationUpdatedEvent when location is updated', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationUpdateCommandDto = {
				id: locationId,
				name: 'Living Room Updated',
			};

			const command = new LocationUpdateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockEventBus.publishAll.mockResolvedValue(undefined);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(LocationUpdatedEvent);
		});

		it('should throw exception when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationUpdateCommandDto = {
				id: locationId,
				name: 'Living Room Updated',
			};

			const command = new LocationUpdateCommand(commandDto);
			const error = new Error('Location not found');

			mockAssertLocationExistsService.execute.mockRejectedValue(error);

			await expect(handler.execute(command)).rejects.toThrow(error);
			expect(mockLocationWriteRepository.save).not.toHaveBeenCalled();
		});
	});
});

