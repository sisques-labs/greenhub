import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { GrowingUnitPlantRemovedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-plant-removed/growing-unit-removed.event-handler';
import { GrowingUnitPlantRemovedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-removed/growing-unit-plant-removed.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('GrowingUnitPlantRemovedEventHandler', () => {
	let handler: GrowingUnitPlantRemovedEventHandler;
	let mockGrowingUnitReadRepository: jest.Mocked<IGrowingUnitReadRepository>;
	let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
	let mockGrowingUnitViewModelBuilder: jest.Mocked<GrowingUnitViewModelBuilder>;
	let mockQueryBus: jest.Mocked<QueryBus>;

	beforeEach(async () => {
		mockGrowingUnitReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IGrowingUnitReadRepository>;

		mockAssertGrowingUnitExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

		mockGrowingUnitViewModelBuilder = {
			reset: jest.fn().mockReturnThis(),
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
			fromAggregate: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitViewModelBuilder>;

		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		const module = await Test.createTestingModule({
			providers: [
				GrowingUnitPlantRemovedEventHandler,
				{
					provide: GROWING_UNIT_READ_REPOSITORY_TOKEN,
					useValue: mockGrowingUnitReadRepository,
				},
				{
					provide: AssertGrowingUnitExistsService,
					useValue: mockAssertGrowingUnitExistsService,
				},
				{
					provide: GrowingUnitViewModelBuilder,
					useValue: mockGrowingUnitViewModelBuilder,
				},
				{
					provide: QueryBus,
					useValue: mockQueryBus,
				},
			],
		}).compile();

		handler = module.get<GrowingUnitPlantRemovedEventHandler>(
			GrowingUnitPlantRemovedEventHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should update growing unit view model when plant is removed', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

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
				numberOfPlants: 0,
				remainingCapacity: 10,
				volume: 0,
				createdAt: now,
				updatedAt: now,
			});

			const event = new GrowingUnitPlantRemovedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: GrowingUnitAggregate.name,
					entityId: plantId,
					entityType: PlantEntity.name,
					eventType: GrowingUnitPlantRemovedEvent.name,
				},
				{
					plant: {
						id: plantId,
						name: 'Basil',
						species: 'Ocimum basilicum',
						plantedDate: null,
						notes: null,
						status: 'PLANTED',
					},
				},
			);

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockQueryBus.execute.mockResolvedValue(location);
			mockGrowingUnitViewModelBuilder.build.mockReturnValue(mockViewModel);
			mockGrowingUnitReadRepository.save.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
				growingUnitId,
			);
			expect(mockGrowingUnitReadRepository.save).toHaveBeenCalled();
			expect(mockGrowingUnitReadRepository.save).toHaveBeenCalledTimes(1);
		});

		it('should not throw when an error occurs', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const event = new GrowingUnitPlantRemovedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: GrowingUnitAggregate.name,
					entityId: plantId,
					entityType: PlantEntity.name,
					eventType: GrowingUnitPlantRemovedEvent.name,
				},
				{
					plant: {
						id: plantId,
						name: 'Basil',
						species: 'Ocimum basilicum',
						plantedDate: null,
						notes: null,
						status: 'PLANTED',
					},
				},
			);

			mockAssertGrowingUnitExistsService.execute.mockRejectedValue(
				new Error('Database error'),
			);

			await expect(handler.handle(event)).resolves.not.toThrow();
			expect(mockGrowingUnitReadRepository.save).not.toHaveBeenCalled();
		});
	});
});
