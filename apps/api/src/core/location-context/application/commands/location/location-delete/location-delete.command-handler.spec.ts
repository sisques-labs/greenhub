import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { LocationDeleteCommandHandler } from '@/core/location-context/application/commands/location/location-delete/location-delete.command-handler';
import { ILocationDeleteCommandDto } from '@/core/location-context/application/dtos/commands/location/location-delete/location-delete-command.dto';
import { LocationHasDependentGrowingUnitsException } from '@/core/location-context/application/exceptions/location/location-has-dependent-growing-units/location-has-dependent-growing-units.exception';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { ILocationWriteRepository } from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { EventBus, QueryBus } from '@nestjs/cqrs';

describe('LocationDeleteCommandHandler', () => {
	let handler: LocationDeleteCommandHandler;
	let mockLocationWriteRepository: jest.Mocked<ILocationWriteRepository>;
	let mockAssertLocationExistsService: jest.Mocked<AssertLocationExistsService>;
	let mockQueryBus: jest.Mocked<QueryBus>;
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

		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockAssertLocationExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertLocationExistsService>;

		handler = new LocationDeleteCommandHandler(
			mockLocationWriteRepository,
			mockAssertLocationExistsService,
			mockQueryBus,
			mockEventBus,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should delete location successfully when no growing units exist', async () => {
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
			mockQueryBus.execute.mockResolvedValue([]);
			mockLocationWriteRepository.delete.mockResolvedValue(undefined);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.objectContaining({
					locationId: expect.objectContaining({
						_value: locationId,
					}),
				}),
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
			mockQueryBus.execute.mockResolvedValue([]);
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
			mockQueryBus.execute.mockResolvedValue([]);
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
			expect(mockQueryBus.execute).not.toHaveBeenCalled();
			expect(mockLocationWriteRepository.delete).not.toHaveBeenCalled();
			expect(mockEventBus.publishAll).not.toHaveBeenCalled();
		});

		it('should throw LocationHasDependentGrowingUnitsException when location has one growing unit', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = 'aaae4567-e89b-12d3-a456-426614174000';
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

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Test Unit'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockQueryBus.execute.mockResolvedValue([mockGrowingUnit]);

			await expect(handler.execute(command)).rejects.toThrow(
				LocationHasDependentGrowingUnitsException,
			);
			await expect(handler.execute(command)).rejects.toThrow(
				`Cannot delete location with id ${locationId}. It has 1 dependent growing unit. Please remove or reassign all growing units before deleting the location.`,
			);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.objectContaining({
					locationId: expect.objectContaining({
						_value: locationId,
					}),
				}),
			);
			expect(mockLocationWriteRepository.delete).not.toHaveBeenCalled();
			expect(mockEventBus.publishAll).not.toHaveBeenCalled();
		});

		it('should throw LocationHasDependentGrowingUnitsException when location has multiple growing units', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId1 = 'aaae4567-e89b-12d3-a456-426614174000';
			const growingUnitId2 = 'bbbb4567-e89b-12d3-a456-426614174000';
			const growingUnitId3 = 'cccc4567-e89b-12d3-a456-426614174000';
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

			const mockGrowingUnits = [
				new GrowingUnitAggregate({
					id: new GrowingUnitUuidValueObject(growingUnitId1),
					locationId: new LocationUuidValueObject(locationId),
					name: new GrowingUnitNameValueObject('Test Unit 1'),
					type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
					capacity: new GrowingUnitCapacityValueObject(10),
					dimensions: null,
					plants: [],
				}),
				new GrowingUnitAggregate({
					id: new GrowingUnitUuidValueObject(growingUnitId2),
					locationId: new LocationUuidValueObject(locationId),
					name: new GrowingUnitNameValueObject('Test Unit 2'),
					type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
					capacity: new GrowingUnitCapacityValueObject(5),
					dimensions: null,
					plants: [],
				}),
				new GrowingUnitAggregate({
					id: new GrowingUnitUuidValueObject(growingUnitId3),
					locationId: new LocationUuidValueObject(locationId),
					name: new GrowingUnitNameValueObject('Test Unit 3'),
					type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
					capacity: new GrowingUnitCapacityValueObject(8),
					dimensions: null,
					plants: [],
				}),
			];

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);
			mockQueryBus.execute.mockResolvedValue(mockGrowingUnits);

			await expect(handler.execute(command)).rejects.toThrow(
				LocationHasDependentGrowingUnitsException,
			);
			await expect(handler.execute(command)).rejects.toThrow(
				`Cannot delete location with id ${locationId}. It has 3 dependent growing units. Please remove or reassign all growing units before deleting the location.`,
			);

			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.objectContaining({
					locationId: expect.objectContaining({
						_value: locationId,
					}),
				}),
			);
			expect(mockLocationWriteRepository.delete).not.toHaveBeenCalled();
			expect(mockEventBus.publishAll).not.toHaveBeenCalled();
		});

		it('should validate growing units before deleting location', async () => {
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
			mockQueryBus.execute.mockResolvedValue([]);
			mockLocationWriteRepository.delete.mockResolvedValue(undefined);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const findByLocationIdOrder =
				mockQueryBus.execute.mock.invocationCallOrder[0];
			const deleteOrder =
				mockLocationWriteRepository.delete.mock.invocationCallOrder[0];
			expect(findByLocationIdOrder).toBeLessThan(deleteOrder);
		});
	});
});
