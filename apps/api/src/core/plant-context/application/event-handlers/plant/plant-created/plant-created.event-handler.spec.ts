import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { PlantCreatedEventHandler } from '@/core/plant-context/application/event-handlers/plant/plant-created/plant-created.event-handler';
import { PlantCreatedEvent } from '@/core/plant-context/application/events/plant/plant-created/plant-created.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
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

describe('PlantCreatedEventHandler', () => {
	let handler: PlantCreatedEventHandler;
	let mockPlantReadRepository: jest.Mocked<IPlantReadRepository>;
	let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
	let mockAssertPlantExistsInGrowingUnitService: jest.Mocked<AssertPlantExistsInGrowingUnitService>;
	let mockPlantViewModelBuilder: jest.Mocked<PlantViewModelBuilder>;
	let mockQueryBus: jest.Mocked<QueryBus>;

	beforeEach(async () => {
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
				PlantCreatedEventHandler,
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
					provide: PlantViewModelBuilder,
					useValue: mockPlantViewModelBuilder,
				},
				{
					provide: QueryBus,
					useValue: mockQueryBus,
				},
			],
		}).compile();

		handler = module.get<PlantCreatedEventHandler>(PlantCreatedEventHandler);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should create and save plant view model when event is handled', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const event = new PlantCreatedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: 'GrowingUnitAggregate',
					entityId: plantId,
					entityType: 'PlantEntity',
					eventType: 'PlantCreatedEvent',
				},
				{
					id: plantId,
					name: 'Basil',
					species: 'Ocimum basilicum',
					plantedDate: null,
					notes: null,
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
				name: new PlantNameValueObject('Basil'),
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

			const mockViewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: now,
				updatedAt: now,
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(mockGrowingUnit);
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(mockPlant);
			mockQueryBus.execute.mockResolvedValue(location);
			mockPlantViewModelBuilder.build.mockReturnValue(mockViewModel);
			mockPlantReadRepository.save.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(growingUnitId);
			expect(mockAssertPlantExistsInGrowingUnitService.execute).toHaveBeenCalledWith({
				growingUnitAggregate: mockGrowingUnit,
				plantId,
			});
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(LocationViewModelFindByIdQuery),
			);
			expect(mockPlantViewModelBuilder.reset).toHaveBeenCalled();
			expect(mockPlantViewModelBuilder.fromEntity).toHaveBeenCalledWith(mockPlant);
			expect(mockPlantViewModelBuilder.build).toHaveBeenCalled();
			expect(mockPlantReadRepository.save).toHaveBeenCalledWith(mockViewModel);
			expect(mockPlantReadRepository.save).toHaveBeenCalledTimes(1);
		});

		it('should not throw when an error occurs', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const event = new PlantCreatedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: 'GrowingUnitAggregate',
					entityId: plantId,
					entityType: 'PlantEntity',
					eventType: 'PlantCreatedEvent',
				},
				{
					id: plantId,
					name: 'Basil',
					species: 'Ocimum basilicum',
					plantedDate: null,
					notes: null,
					status: PlantStatusEnum.PLANTED,
				},
			);

			mockAssertGrowingUnitExistsService.execute.mockRejectedValue(
				new Error('Database error'),
			);

			await expect(handler.handle(event)).resolves.not.toThrow();
			expect(mockPlantReadRepository.save).not.toHaveBeenCalled();
		});
	});
});
