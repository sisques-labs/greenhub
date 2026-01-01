import { LocationCreateCommand } from '@/core/location-context/application/commands/location/location-create/location-create.command';
import { LocationCreateCommandHandler } from '@/core/location-context/application/commands/location/location-create/location-create.command-handler';
import { ILocationCreateCommandDto } from '@/core/location-context/application/dtos/commands/location/location-create/location-create-command.dto';
import { LocationCreatedEvent } from '@/core/location-context/application/events/location/location-created/location-created.event';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationAggregateFactory } from '@/core/location-context/domain/factories/aggregates/location-aggregate/location-aggregate.factory';
import { ILocationWriteRepository } from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationCreateCommandHandler', () => {
	let handler: LocationCreateCommandHandler;
	let mockLocationWriteRepository: jest.Mocked<ILocationWriteRepository>;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;
	let mockLocationAggregateFactory: jest.Mocked<LocationAggregateFactory>;

	beforeEach(() => {
		mockLocationWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationWriteRepository>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		mockLocationAggregateFactory = {
			create: jest.fn(),
			fromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<LocationAggregateFactory>;

		handler = new LocationCreateCommandHandler(
			mockLocationWriteRepository,
			mockLocationAggregateFactory,
			mockPublishIntegrationEventsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should create location successfully', async () => {
			const commandDto: ILocationCreateCommandDto = {
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
			};

			const command = new LocationCreateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: new LocationDescriptionValueObject(
					'North-facing room with good sunlight',
				),
			});

			mockLocationAggregateFactory.create.mockReturnValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(mockLocation.id.value);
			expect(mockLocationAggregateFactory.create).toHaveBeenCalledWith({
				id: command.id,
				name: command.name,
				type: command.type,
				description: command.description,
			});
			expect(mockLocationWriteRepository.save).toHaveBeenCalledWith(
				mockLocation,
			);
			expect(mockLocationWriteRepository.save).toHaveBeenCalledTimes(1);
			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(LocationCreatedEvent);
			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalledTimes(
				1,
			);
		});

		it('should create location without description', async () => {
			const commandDto: ILocationCreateCommandDto = {
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
			};

			const command = new LocationCreateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockLocationAggregateFactory.create.mockReturnValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(mockLocation.id.value);
			expect(mockLocationAggregateFactory.create).toHaveBeenCalledWith({
				id: command.id,
				name: command.name,
				type: command.type,
				description: null,
			});
		});

		it('should publish LocationCreatedEvent when location is created', async () => {
			const commandDto: ILocationCreateCommandDto = {
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
			};

			const command = new LocationCreateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockLocationAggregateFactory.create.mockReturnValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(LocationCreatedEvent);
		});

		it('should save location before publishing events', async () => {
			const commandDto: ILocationCreateCommandDto = {
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
			};

			const command = new LocationCreateCommand(commandDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockLocationAggregateFactory.create.mockReturnValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			const saveOrder =
				mockLocationWriteRepository.save.mock.invocationCallOrder[0];
			const publishOrder =
				mockPublishIntegrationEventsService.execute.mock.invocationCallOrder[0];
			expect(saveOrder).toBeLessThan(publishOrder);
		});

		it('should return the created location id', async () => {
			const commandDto: ILocationCreateCommandDto = {
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
			};

			const command = new LocationCreateCommand(commandDto);
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockLocationAggregateFactory.create.mockReturnValue(mockLocation);
			mockLocationWriteRepository.save.mockResolvedValue(mockLocation);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(locationId);
		});
	});
});

