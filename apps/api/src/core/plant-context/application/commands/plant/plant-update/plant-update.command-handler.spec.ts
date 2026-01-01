import { EventBus } from '@nestjs/cqrs';

import { PlantUpdateCommand } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command';
import { PlantUpdateCommandHandler } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command-handler';
import { IPlantUpdateCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-update/plant-update-command.dto';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsService } from '@/core/plant-context/application/services/plant/assert-plant-exists/assert-plant-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantNameChangedEvent } from '@/core/plant-context/domain/events/plant/field-changed/plant-name-changed/plant-name-changed.event';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { IGrowingUnitWriteRepository } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantUpdateCommandHandler', () => {
	let handler: PlantUpdateCommandHandler;
	let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
	let mockEventBus: jest.Mocked<EventBus>;
	let mockAssertPlantExistsService: jest.Mocked<AssertPlantExistsService>;
	let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
	let plantEntityFactory: PlantEntityFactory;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;

	beforeEach(() => {
		plantEntityFactory = new PlantEntityFactory();
		mockGrowingUnitWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

		mockEventBus = {
			publishAll: jest.fn(),
			publish: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		mockAssertPlantExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertPlantExistsService>;

		mockAssertGrowingUnitExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		handler = new PlantUpdateCommandHandler(
			mockGrowingUnitWriteRepository,
			mockEventBus,
			mockAssertPlantExistsService,
			mockAssertGrowingUnitExistsService,
			mockPublishIntegrationEventsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should update plant name successfully', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				name: 'Sweet Basil',
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
				plantId,
			);
			expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
				growingUnitId,
			);
			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.name.value).toBe('Sweet Basil');
			expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
				mockGrowingUnit,
			);
			expect(mockEventBus.publishAll).toHaveBeenCalledWith(
				mockGrowingUnit.getUncommittedEvents(),
			);
		});

		it('should update plant status successfully', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				status: PlantStatusEnum.GROWING,
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.status.value).toBe(PlantStatusEnum.GROWING);
		});

		it('should publish events after updating', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				name: 'Sweet Basil',
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);

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

			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
			expect(capturedEvents.length).toBeGreaterThanOrEqual(1);
			const nameChangedEvent = capturedEvents.find(
				(e) => e instanceof PlantNameChangedEvent,
			);
			expect(nameChangedEvent).toBeInstanceOf(PlantNameChangedEvent);
		});

		it('should update plant species successfully', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				species: 'Ocimum tenuiflorum',
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.species.value).toBe('Ocimum tenuiflorum');
			expect(mockEventBus.publishAll).toHaveBeenCalled();
		});

		it('should update plant plantedDate successfully', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const newPlantedDate = new Date('2024-02-01');
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				plantedDate: newPlantedDate,
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.plantedDate?.value).toEqual(newPlantedDate);
			expect(mockEventBus.publishAll).toHaveBeenCalled();
		});

		it('should update plant notes successfully', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				notes: 'Updated notes',
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.notes?.value).toBe('Updated notes');
			expect(mockEventBus.publishAll).toHaveBeenCalled();
		});

		it('should update multiple plant fields at once', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const newPlantedDate = new Date('2024-02-01');
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				name: 'Sweet Basil',
				species: 'Ocimum tenuiflorum',
				plantedDate: newPlantedDate,
				notes: 'Updated notes',
				status: PlantStatusEnum.GROWING,
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.name.value).toBe('Sweet Basil');
			expect(updatedPlant?.species.value).toBe('Ocimum tenuiflorum');
			expect(updatedPlant?.plantedDate?.value).toEqual(newPlantedDate);
			expect(updatedPlant?.notes?.value).toBe('Updated notes');
			expect(updatedPlant?.status.value).toBe(PlantStatusEnum.GROWING);
			expect(mockEventBus.publishAll).toHaveBeenCalled();
		});

		it('should handle null plantedDate update', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				plantedDate: null,
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.plantedDate).toBeNull();
			expect(mockEventBus.publishAll).toHaveBeenCalled();
		});

		it('should handle null notes update', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const commandDto: IPlantUpdateCommandDto = {
				id: plantId,
				notes: null,
			};

			const command = new PlantUpdateCommand(commandDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: new PlantNotesValueObject('Some notes'),
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnit.addPlant(mockPlant, false);

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);
			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			const updatedPlant = mockGrowingUnit.getPlantById(plantId);
			expect(updatedPlant?.notes).toBeNull();
			expect(mockEventBus.publishAll).toHaveBeenCalled();
		});
	});
});
