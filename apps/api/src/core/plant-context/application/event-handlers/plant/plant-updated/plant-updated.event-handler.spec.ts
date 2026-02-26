import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { PlantUpdatedEventHandler } from '@/core/plant-context/application/event-handlers/plant/plant-updated/plant-updated.event-handler';
import { PlantUpdatedEvent } from '@/core/plant-context/application/events/plant/plant-updated/plant-updated.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';

describe('PlantUpdatedEventHandler', () => {
	let handler: PlantUpdatedEventHandler;
	let mockGrowingUnitReadRepository: jest.Mocked<IGrowingUnitReadRepository>;
	let mockPlantReadRepository: jest.Mocked<IPlantReadRepository>;
	let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
	let mockAssertPlantExistsInGrowingUnitService: jest.Mocked<AssertPlantExistsInGrowingUnitService>;
	let mockGrowingUnitViewModelBuilder: jest.Mocked<GrowingUnitViewModelBuilder>;
	let mockPlantViewModelBuilder: jest.Mocked<PlantViewModelBuilder>;
	let mockQueryBus: jest.Mocked<QueryBus>;

	beforeEach(async () => {
		mockGrowingUnitReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IGrowingUnitReadRepository>;

		mockPlantReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IPlantReadRepository>;

		mockAssertGrowingUnitExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

		mockAssertPlantExistsInGrowingUnitService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertPlantExistsInGrowingUnitService>;

		mockGrowingUnitViewModelBuilder = {
			reset: jest.fn().mockReturnThis(),
			fromAggregate: jest.fn().mockReturnThis(),
			withLocation: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitViewModelBuilder>;

		mockPlantViewModelBuilder = {
			reset: jest.fn().mockReturnThis(),
			fromEntity: jest.fn().mockReturnThis(),
			withGrowingUnitId: jest.fn().mockReturnThis(),
			withLocation: jest.fn().mockReturnThis(),
			withGrowingUnit: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<PlantViewModelBuilder>;

		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		const module = await Test.createTestingModule({
			providers: [
				PlantUpdatedEventHandler,
				{
					provide: GROWING_UNIT_READ_REPOSITORY_TOKEN,
					useValue: mockGrowingUnitReadRepository,
				},
				{
					provide: PLANT_READ_REPOSITORY_TOKEN,
					useValue: mockPlantReadRepository,
				},
				{
					provide: AssertGrowingUnitExistsService,
					useValue: mockAssertGrowingUnitExistsService,
				},
				{
					provide: AssertPlantExistsInGrowingUnitService,
					useValue: mockAssertPlantExistsInGrowingUnitService,
				},
				{
					provide: GrowingUnitViewModelBuilder,
					useValue: mockGrowingUnitViewModelBuilder,
				},
				{
					provide: PlantViewModelBuilder,
					useValue: mockPlantViewModelBuilder,
				},
				{
					provide: QueryBus,
					useValue: mockQueryBus,
				},
			],
		}).compile();

		handler = module.get<PlantUpdatedEventHandler>(PlantUpdatedEventHandler);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should update and save plant and growing unit view models when event is handled', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const event = new PlantUpdatedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: 'GrowingUnitAggregate',
					entityId: plantId,
					entityType: 'PlantEntity',
					eventType: 'PlantUpdatedEvent',
				},
				{
					id: plantId,
					name: 'Basil Updated',
					species: 'Ocimum basilicum',
					plantedDate: null,
					notes: 'Updated notes',
					status: PlantStatusEnum.PLANTED,
				},
			);

			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			const mockPlant = new PlantEntity({
				id: new PlantUuidValueObject(plantId),
				name: new PlantNameValueObject('Basil Updated'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const now = new Date();
			const location = new LocationViewModel({
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt: now,
				updatedAt: now,
			});

			const mockPlantViewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil Updated',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: 'Updated notes',
				status: PlantStatusEnum.PLANTED,
				createdAt: now,
				updatedAt: now,
			});

			const mockGrowingUnitViewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				location,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				numberOfPlants: 0,
				remainingCapacity: 10,
				volume: 0,
				createdAt: now,
				updatedAt: now,
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(mockGrowingUnit);
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(mockPlant);
			mockQueryBus.execute.mockResolvedValue(location);
			mockPlantViewModelBuilder.build.mockReturnValue(mockPlantViewModel);
			mockGrowingUnitViewModelBuilder.build.mockReturnValue(mockGrowingUnitViewModel);
			mockPlantReadRepository.save.mockResolvedValue(undefined);
			mockGrowingUnitReadRepository.save.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(growingUnitId);
			expect(mockAssertPlantExistsInGrowingUnitService.execute).toHaveBeenCalledWith({
				growingUnitAggregate: mockGrowingUnit,
				plantId,
			});
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(LocationViewModelFindByIdQuery),
			);
			expect(mockPlantReadRepository.save).toHaveBeenCalledWith(mockPlantViewModel);
			expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledWith(mockGrowingUnitViewModel);
		});

		it('should not throw when an error occurs', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const event = new PlantUpdatedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: 'GrowingUnitAggregate',
					entityId: plantId,
					entityType: 'PlantEntity',
					eventType: 'PlantUpdatedEvent',
				},
				{
					id: plantId,
					name: 'Basil Updated',
					species: 'Ocimum basilicum',
					plantedDate: null,
					notes: 'Updated notes',
					status: PlantStatusEnum.PLANTED,
				},
			);

			mockAssertGrowingUnitExistsService.execute.mockRejectedValue(
				new Error('Database error'),
			);

			await expect(handler.handle(event)).resolves.not.toThrow();
			expect(mockPlantReadRepository.save).not.toHaveBeenCalled();
			expect(mockGrowingUnitReadRepository.save).not.toHaveBeenCalled();
		});
	});
});
