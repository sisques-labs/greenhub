import { EventBus } from '@nestjs/cqrs';

import { PlantAddCommand } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command';
import { PlantAddCommandHandler } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command-handler';
import { IPlantAddCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-add/plant-add-command.dto';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitPlantAddedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
import { GrowingUnitFullCapacityException } from '@/core/plant-context/domain/exceptions/growing-unit/growing-unit-full-capacity/growing-unit-full-capacity.exception';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { IGrowingUnitWriteRepository } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantAddCommandHandler', () => {
	let handler: PlantAddCommandHandler;
	let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
	let mockEventBus: jest.Mocked<EventBus>;
	let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
	let mockPlantEntityFactory: jest.Mocked<PlantEntityFactory>;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;

	beforeEach(() => {
		mockGrowingUnitWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

		mockEventBus = {
			publishAll: jest.fn(),
			publish: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		mockAssertGrowingUnitExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

		mockPlantEntityFactory = {
			create: jest.fn(),
			fromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<PlantEntityFactory>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		handler = new PlantAddCommandHandler(
			mockGrowingUnitWriteRepository,
			mockEventBus,
			mockAssertGrowingUnitExistsService,
			mockPlantEntityFactory,
			mockPublishIntegrationEventsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should add plant to growing unit successfully', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantAddCommandDto = {
				growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const command = new PlantAddCommand(commandDto);
			const locationId = '423e4567-e89b-12d3-a456-426614174000';
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			const plantEntityFactory = new PlantEntityFactory();
			const mockPlant = plantEntityFactory.create({
				id: command.id,
				name: command.name,
				species: command.species,
				plantedDate: command.plantedDate,
				notes: command.notes,
				status: command.status,
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockPlantEntityFactory.create.mockReturnValue(mockPlant);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(command.id.value);
			expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
				growingUnitId,
			);
			expect(mockPlantEntityFactory.create).toHaveBeenCalledWith({
				id: command.id,
				name: command.name,
				species: command.species,
				plantedDate: command.plantedDate,
				notes: command.notes,
				status: command.status,
			});
			expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
				mockGrowingUnit,
			);
			expect(mockEventBus.publishAll).toHaveBeenCalledWith(
				mockGrowingUnit.getUncommittedEvents(),
			);
		});

		it('should throw exception when growing unit is at full capacity', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '423e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantAddCommandDto = {
				growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
			};

			const command = new PlantAddCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(1),
				dimensions: null,
				plants: [],
			});

			// Add a plant to reach capacity
			const existingPlant = {
				id: new PlantUuidValueObject(),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Existing Plant'),
				species: new PlantSpeciesValueObject('Existing Species'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			};
			mockGrowingUnit.addPlant(existingPlant as any, false);

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);

			await expect(handler.execute(command)).rejects.toThrow(
				GrowingUnitFullCapacityException,
			);
			expect(mockPlantEntityFactory.create).not.toHaveBeenCalled();
			expect(mockGrowingUnitWriteRepository.save).not.toHaveBeenCalled();
			expect(mockEventBus.publishAll).not.toHaveBeenCalled();
		});

		it('should publish GrowingUnitPlantAddedEvent when plant is added', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantAddCommandDto = {
				growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
			};

			const command = new PlantAddCommand(commandDto);
			const locationId = '423e4567-e89b-12d3-a456-426614174000';
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			const plantEntityFactory = new PlantEntityFactory();
			const mockPlant = plantEntityFactory.create({
				id: command.id,
				name: command.name,
				species: command.species,
				plantedDate: command.plantedDate,
				notes: command.notes,
				status: command.status,
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockPlantEntityFactory.create.mockReturnValue(mockPlant);

			// Make save return the same object to preserve events
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);

			// Capture the events that are passed to publishAll
			let capturedEvents: any[] = [];
			mockEventBus.publishAll.mockImplementation(async (events) => {
				capturedEvents = Array.isArray(events) ? [...events] : [];
				return undefined;
			});

			await handler.execute(command);

			// Verify that addPlant was called
			expect(mockGrowingUnit.plants).toHaveLength(1);

			// Check the events that were passed to publishAll
			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
			expect(capturedEvents).toHaveLength(1);
			expect(capturedEvents[0]).toBeInstanceOf(GrowingUnitPlantAddedEvent);
		});
	});
});
