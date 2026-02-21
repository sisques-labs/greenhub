import { Test } from '@nestjs/testing';

import { PlantSpeciesUpdatedEventHandler } from '@/core/plant-species-context/infrastructure/event-handlers/plant-species/plant-species-updated/plant-species-updated.event-handler';
import { PlantSpeciesUpdatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-updated/plant-species-updated.event';
import { AssertPlantSpeciesExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-exists/assert-plant-species-exists.service';
import { PlantSpeciesViewModelBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-view-model.builder';
import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';
import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';
import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';
import { PlantSpeciesFamilyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-family/plant-species-family.vo';
import { PlantSpeciesDescriptionValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-description/plant-species-description.vo';
import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';
import { PlantSpeciesGrowthRateValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-rate/plant-species-growth-rate.vo';
import { PlantSpeciesLightRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-light-requirements/plant-species-light-requirements.vo';
import { PlantSpeciesWaterRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-water-requirements/plant-species-water-requirements.vo';
import { PlantSpeciesTemperatureRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-temperature-range/plant-species-temperature-range.vo';
import { PlantSpeciesHumidityRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.vo';
import { PlantSpeciesSoilTypeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-soil-type/plant-species-soil-type.vo';
import { PlantSpeciesPhRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-ph-range/plant-species-ph-range.vo';
import { PlantSpeciesMatureSizeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-mature-size/plant-species-mature-size.vo';
import { PlantSpeciesGrowthTimeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-time/plant-species-growth-time.vo';
import { PlantSpeciesTagsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-tags/plant-species-tags.vo';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';

describe('PlantSpeciesUpdatedEventHandler', () => {
	let handler: PlantSpeciesUpdatedEventHandler;
	let mockPlantSpeciesReadRepository: jest.Mocked<IPlantSpeciesReadRepository>;
	let mockAssertPlantSpeciesExistsService: jest.Mocked<AssertPlantSpeciesExistsService>;
	let mockPlantSpeciesViewModelBuilder: jest.Mocked<PlantSpeciesViewModelBuilder>;

	beforeEach(async () => {
		mockPlantSpeciesReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IPlantSpeciesReadRepository>;

		mockAssertPlantSpeciesExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertPlantSpeciesExistsService>;

		mockPlantSpeciesViewModelBuilder = {
			reset: jest.fn().mockReturnThis(),
			fromAggregate: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<PlantSpeciesViewModelBuilder>;

		const module = await Test.createTestingModule({
			providers: [
				PlantSpeciesUpdatedEventHandler,
				{
					provide: PLANT_SPECIES_READ_REPOSITORY_TOKEN,
					useValue: mockPlantSpeciesReadRepository,
				},
				{
					provide: AssertPlantSpeciesExistsService,
					useValue: mockAssertPlantSpeciesExistsService,
				},
				{
					provide: PlantSpeciesViewModelBuilder,
					useValue: mockPlantSpeciesViewModelBuilder,
				},
			],
		}).compile();

		handler = module.get<PlantSpeciesUpdatedEventHandler>(
			PlantSpeciesUpdatedEventHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should update and save plant species view model when event is handled', async () => {
			const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();

			const event = new PlantSpeciesUpdatedEvent(
				{
					aggregateRootId: plantSpeciesId,
					aggregateRootType: 'PlantSpeciesAggregate',
					entityId: plantSpeciesId,
					entityType: 'PlantSpeciesAggregate',
					eventType: 'PlantSpeciesUpdatedEvent',
				},
				{
					id: plantSpeciesId,
					commonName: 'Tomato Updated',
					scientificName: 'Solanum lycopersicum',
					family: 'Solanaceae',
					description: 'An updated common garden vegetable.',
					category: PlantSpeciesCategoryEnum.VEGETABLE,
					difficulty: PlantSpeciesDifficultyEnum.MEDIUM,
					growthRate: PlantSpeciesGrowthRateEnum.MEDIUM,
					lightRequirements: PlantSpeciesLightRequirementsEnum.PARTIAL_SUN,
					waterRequirements: PlantSpeciesWaterRequirementsEnum.HIGH,
					temperatureRange: { min: 10, max: 35 },
					humidityRequirements: PlantSpeciesHumidityRequirementsEnum.HIGH,
					soilType: PlantSpeciesSoilTypeEnum.SANDY,
					phRange: { min: 5.5, max: 7.5 },
					matureSize: { height: 180, width: 70 },
					growthTime: 100,
					tags: ['edible', 'garden', 'updated'],
					isVerified: false,
					contributorId: null,
					createdAt: now,
					updatedAt: now,
					deletedAt: null,
				},
			);

			const mockAggregate = new PlantSpeciesAggregate({
				id: new PlantSpeciesUuidValueObject(plantSpeciesId),
				commonName: new PlantSpeciesCommonNameValueObject('Tomato Updated'),
				scientificName: new PlantSpeciesScientificNameValueObject('Solanum lycopersicum'),
				family: new PlantSpeciesFamilyValueObject('Solanaceae'),
				description: new PlantSpeciesDescriptionValueObject('An updated common garden vegetable.'),
				category: new PlantSpeciesCategoryValueObject(PlantSpeciesCategoryEnum.VEGETABLE),
				difficulty: new PlantSpeciesDifficultyValueObject(PlantSpeciesDifficultyEnum.MEDIUM),
				growthRate: new PlantSpeciesGrowthRateValueObject(PlantSpeciesGrowthRateEnum.MEDIUM),
				lightRequirements: new PlantSpeciesLightRequirementsValueObject(PlantSpeciesLightRequirementsEnum.PARTIAL_SUN),
				waterRequirements: new PlantSpeciesWaterRequirementsValueObject(PlantSpeciesWaterRequirementsEnum.HIGH),
				temperatureRange: new PlantSpeciesTemperatureRangeValueObject({ min: 10, max: 35 }),
				humidityRequirements: new PlantSpeciesHumidityRequirementsValueObject(PlantSpeciesHumidityRequirementsEnum.HIGH),
				soilType: new PlantSpeciesSoilTypeValueObject(PlantSpeciesSoilTypeEnum.SANDY),
				phRange: new PlantSpeciesPhRangeValueObject({ min: 5.5, max: 7.5 }),
				matureSize: new PlantSpeciesMatureSizeValueObject({ height: 180, width: 70 }),
				growthTime: new PlantSpeciesGrowthTimeValueObject(100),
				tags: new PlantSpeciesTagsValueObject(['edible', 'garden', 'updated']),
				isVerified: new BooleanValueObject(false),
				contributorId: null,
				createdAt: now,
				updatedAt: now,
				deletedAt: null,
			});

			const mockViewModel = new PlantSpeciesViewModel({
				id: plantSpeciesId,
				commonName: 'Tomato Updated',
				scientificName: 'Solanum lycopersicum',
				family: 'Solanaceae',
				description: 'An updated common garden vegetable.',
				category: PlantSpeciesCategoryEnum.VEGETABLE,
				difficulty: PlantSpeciesDifficultyEnum.MEDIUM,
				growthRate: PlantSpeciesGrowthRateEnum.MEDIUM,
				lightRequirements: PlantSpeciesLightRequirementsEnum.PARTIAL_SUN,
				waterRequirements: PlantSpeciesWaterRequirementsEnum.HIGH,
				temperatureRange: { min: 10, max: 35 },
				humidityRequirements: PlantSpeciesHumidityRequirementsEnum.HIGH,
				soilType: PlantSpeciesSoilTypeEnum.SANDY,
				phRange: { min: 5.5, max: 7.5 },
				matureSize: { height: 180, width: 70 },
				growthTime: 100,
				tags: ['edible', 'garden', 'updated'],
				isVerified: false,
				contributorId: null,
				createdAt: now,
				updatedAt: now,
			});

			mockAssertPlantSpeciesExistsService.execute.mockResolvedValue(mockAggregate);
			mockPlantSpeciesViewModelBuilder.build.mockReturnValue(mockViewModel);
			mockPlantSpeciesReadRepository.save.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockAssertPlantSpeciesExistsService.execute).toHaveBeenCalledWith(plantSpeciesId);
			expect(mockPlantSpeciesViewModelBuilder.reset).toHaveBeenCalled();
			expect(mockPlantSpeciesViewModelBuilder.fromAggregate).toHaveBeenCalledWith(mockAggregate);
			expect(mockPlantSpeciesViewModelBuilder.build).toHaveBeenCalled();
			expect(mockPlantSpeciesReadRepository.save).toHaveBeenCalledWith(mockViewModel);
			expect(mockPlantSpeciesReadRepository.save).toHaveBeenCalledTimes(1);
		});
	});
});
