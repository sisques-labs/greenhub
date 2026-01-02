import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { GrowingUnitPlantAddedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-plant-added/growing-unit-added.event-handler';
import { GrowingUnitPlantAddedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import {
	PLANT_READ_REPOSITORY_TOKEN,
	IPlantReadRepository,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('GrowingUnitPlantAddedEventHandler', () => {
	let handler: GrowingUnitPlantAddedEventHandler;
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
			withId: jest.fn().mockReturnThis(),
			withLocation: jest.fn().mockReturnThis(),
			withName: jest.fn().mockReturnThis(),
			withType: jest.fn().mockReturnThis(),
			withCapacity: jest.fn().mockReturnThis(),
			withDimensions: jest.fn().mockReturnThis(),
			withPlants: jest.fn().mockReturnThis(),
			withRemainingCapacity: jest.fn().mockReturnThis(),
			withNumberOfPlants: jest.fn().mockReturnThis(),
			withVolume: jest.fn().mockReturnThis(),
			withCreatedAt: jest.fn().mockReturnThis(),
			withUpdatedAt: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitViewModelBuilder>;

		mockPlantViewModelBuilder = {
			reset: jest.fn().mockReturnThis(),
			fromEntity: jest.fn().mockReturnThis(),
			withId: jest.fn().mockReturnThis(),
			withGrowingUnitId: jest.fn().mockReturnThis(),
			withName: jest.fn().mockReturnThis(),
			withSpecies: jest.fn().mockReturnThis(),
			withPlantedDate: jest.fn().mockReturnThis(),
			withNotes: jest.fn().mockReturnThis(),
			withStatus: jest.fn().mockReturnThis(),
			withCreatedAt: jest.fn().mockReturnThis(),
			withUpdatedAt: jest.fn().mockReturnThis(),
			withLocation: jest.fn().mockReturnThis(),
			withGrowingUnit: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<PlantViewModelBuilder>;

		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		const module = await Test.createTestingModule({
			providers: [
				GrowingUnitPlantAddedEventHandler,
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

		handler = module.get<GrowingUnitPlantAddedEventHandler>(
			GrowingUnitPlantAddedEventHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should update growing unit view model when plant is added', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const event = new GrowingUnitPlantAddedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: GrowingUnitAggregate.name,
					entityId: plantId,
					entityType: PlantEntity.name,
					eventType: GrowingUnitPlantAddedEvent.name,
				},
				{
					plant: {
						id: plantId,
						name: 'Basil',
						species: 'Ocimum basilicum',
						plantedDate: null,
						notes: null,
						status: PlantStatusEnum.PLANTED,
					},
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

			const now = new Date();
			const location = new LocationViewModel({
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt: now,
				updatedAt: now,
			});

			const mockViewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				location,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				numberOfPlants: 1,
				remainingCapacity: 9,
				volume: 0,
				createdAt: now,
				updatedAt: now,
			});

			const mockPlant = new PlantEntity({
				id: new PlantUuidValueObject(plantId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				mockPlant,
			);
			mockQueryBus.execute.mockResolvedValue(location);
			mockPlantViewModelBuilder.build.mockReturnValue(
				new PlantViewModel({
					id: plantId,
					growingUnitId: growingUnitId,
					name: 'Basil',
					species: 'Ocimum basilicum',
					plantedDate: null,
					notes: null,
					status: PlantStatusEnum.PLANTED,
					createdAt: now,
					updatedAt: now,
				}),
			);
			mockGrowingUnitViewModelBuilder.build.mockReturnValue(mockViewModel);
			mockPlantReadRepository.save.mockResolvedValue(undefined);
			mockGrowingUnitReadRepository.save.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
				growingUnitId,
			);
			expect(mockGrowingUnitReadRepository.save).toHaveBeenCalled();
			expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledTimes(1);
		});
	});
});
