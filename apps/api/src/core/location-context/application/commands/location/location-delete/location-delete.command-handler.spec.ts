import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { LocationDeleteCommandHandler } from '@/core/location-context/application/commands/location/location-delete/location-delete.command-handler';
import { ILocationDeleteCommandDto } from '@/core/location-context/application/dtos/commands/location/location-delete/location-delete-command.dto';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { ILocationWriteRepository } from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { EventBus } from '@nestjs/cqrs';

describe('LocationDeleteCommandHandler', () => {
	let handler: LocationDeleteCommandHandler;
	let mockLocationWriteRepository: jest.Mocked<ILocationWriteRepository>;
	let mockAssertLocationExistsService: jest.Mocked<AssertLocationExistsService>;
	let mockEventBus: jest.Mocked<EventBus>;
	beforeEach(() => {
		mockEventBus = {
			publish: jest.fn(),
			publishAll: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		mockLocationWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationWriteRepository>;

		mockAssertLocationExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertLocationExistsService>;

		handler = new LocationDeleteCommandHandler(
			mockLocationWriteRepository,
			mockAssertLocationExistsService,
			mockEventBus,
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
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocationWriteRepository.delete).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockEventBus.publishAll).toHaveBeenCalled();
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
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockEventBus.publishAll).toHaveBeenCalled();
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
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const deleteOrder =
				mockLocationWriteRepository.delete.mock.invocationCallOrder[0];
			const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
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
			expect(mockEventBus.publishAll).not.toHaveBeenCalled();
		});
	});
});
