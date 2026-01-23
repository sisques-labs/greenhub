import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { LocationDeleteCommandHandler } from '@/core/location-context/application/commands/location/location-delete/location-delete.command-handler';
import { ILocationDeleteCommandDto } from '@/core/location-context/application/dtos/commands/location/location-delete/location-delete-command.dto';
import { LocationDeletedEvent } from '@/core/location-context/application/events/location/location-deleted/location-deleted.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { ILocationWriteRepository } from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { PublishDomainEventsService } from '@/shared/application/services/publish-domain-events/publish-domain-events.service';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationDeleteCommandHandler', () => {
	let handler: LocationDeleteCommandHandler;
	let mockLocationWriteRepository: jest.Mocked<ILocationWriteRepository>;
	let mockPublishDomainEventsService: jest.Mocked<PublishDomainEventsService>;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;
	let mockAssertLocationExistsService: jest.Mocked<AssertLocationExistsService>;

	beforeEach(() => {
		mockLocationWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationWriteRepository>;

		mockPublishDomainEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishDomainEventsService>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		mockAssertLocationExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertLocationExistsService>;

		handler = new LocationDeleteCommandHandler(
			mockLocationWriteRepository,
			mockPublishDomainEventsService,
			mockAssertLocationExistsService,
			mockPublishIntegrationEventsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should delete location successfully', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationDeleteCommandDto = {
				id: locationId,
			};

			const command = new LocationDeleteCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.delete.mockResolvedValue(undefined);
			mockPublishDomainEventsService.execute.mockResolvedValue(undefined);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocationWriteRepository.delete).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(LocationDeletedEvent);
		});

		it('should publish LocationDeletedEvent when location is deleted', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationDeleteCommandDto = {
				id: locationId,
			};

			const command = new LocationDeleteCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.delete.mockResolvedValue(undefined);
			mockPublishDomainEventsService.execute.mockResolvedValue(undefined);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(LocationDeletedEvent);
		});

		it('should delete location before publishing events', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationDeleteCommandDto = {
				id: locationId,
			};

			const command = new LocationDeleteCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockLocationWriteRepository.delete.mockResolvedValue(undefined);
			mockPublishDomainEventsService.execute.mockResolvedValue(undefined);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			const deleteOrder =
				mockLocationWriteRepository.delete.mock.invocationCallOrder[0];
			const publishOrder =
				mockPublishIntegrationEventsService.execute.mock.invocationCallOrder[0];
			expect(deleteOrder).toBeLessThan(publishOrder);
		});

		it('should throw exception when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: ILocationDeleteCommandDto = {
				id: locationId,
			};

			const command = new LocationDeleteCommand(commandDto);
			const error = new Error('Location not found');

			mockAssertLocationExistsService.execute.mockRejectedValue(error);

			await expect(handler.execute(command)).rejects.toThrow(error);
			expect(mockLocationWriteRepository.delete).not.toHaveBeenCalled();
			expect(
				mockPublishIntegrationEventsService.execute,
			).not.toHaveBeenCalled();
		});
	});
});

