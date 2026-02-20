import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import type { IPlantSpeciesDto } from '@/core/plant-species-context/domain/dtos/entities/plant-species/plant-species.dto';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesCategoryChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-category-changed/plant-species-category-changed.event';
import { PlantSpeciesCommonNameChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-common-name-changed/plant-species-common-name-changed.event';
import { PlantSpeciesIsVerifiedChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-is-verified-changed/plant-species-is-verified-changed.event';
import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';
import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';
import { PlantSpeciesDescriptionValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-description/plant-species-description.vo';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';
import { PlantSpeciesFamilyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-family/plant-species-family.vo';
import { PlantSpeciesGrowthRateValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-rate/plant-species-growth-rate.vo';
import { PlantSpeciesGrowthTimeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-time/plant-species-growth-time.vo';
import { PlantSpeciesHumidityRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.vo';
import { PlantSpeciesLightRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-light-requirements/plant-species-light-requirements.vo';
import { PlantSpeciesMatureSizeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-mature-size/plant-species-mature-size.vo';
import { PlantSpeciesPhRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-ph-range/plant-species-ph-range.vo';
import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';
import { PlantSpeciesSoilTypeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-soil-type/plant-species-soil-type.vo';
import { PlantSpeciesTagsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-tags/plant-species-tags.vo';
import { PlantSpeciesTemperatureRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-temperature-range/plant-species-temperature-range.vo';
import { PlantSpeciesWaterRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-water-requirements/plant-species-water-requirements.vo';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';

describe('PlantSpeciesAggregate', () => {
	let plantSpeciesId: PlantSpeciesUuidValueObject;
	let plantSpeciesDto: IPlantSpeciesDto;

	beforeEach(() => {
		plantSpeciesId = new PlantSpeciesUuidValueObject();
		const now = new Date();

		plantSpeciesDto = {
			id: plantSpeciesId,
			commonName: new PlantSpeciesCommonNameValueObject('Tomato'),
			scientificName: new PlantSpeciesScientificNameValueObject(
				'Solanum lycopersicum',
			),
			family: new PlantSpeciesFamilyValueObject('Solanaceae'),
			description: new PlantSpeciesDescriptionValueObject(
				'A popular garden vegetable.',
			),
			category: new PlantSpeciesCategoryValueObject(
				PlantSpeciesCategoryEnum.VEGETABLE,
			),
			difficulty: new PlantSpeciesDifficultyValueObject(
				PlantSpeciesDifficultyEnum.EASY,
			),
			growthRate: new PlantSpeciesGrowthRateValueObject(
				PlantSpeciesGrowthRateEnum.MEDIUM,
			),
			lightRequirements: new PlantSpeciesLightRequirementsValueObject(
				PlantSpeciesLightRequirementsEnum.FULL_SUN,
			),
			waterRequirements: new PlantSpeciesWaterRequirementsValueObject(
				PlantSpeciesWaterRequirementsEnum.MEDIUM,
			),
			temperatureRange: new PlantSpeciesTemperatureRangeValueObject({
				min: 15,
				max: 30,
			}),
			humidityRequirements: new PlantSpeciesHumidityRequirementsValueObject(
				PlantSpeciesHumidityRequirementsEnum.MEDIUM,
			),
			soilType: new PlantSpeciesSoilTypeValueObject(
				PlantSpeciesSoilTypeEnum.LOAMY,
			),
			phRange: new PlantSpeciesPhRangeValueObject({ min: 6.0, max: 7.0 }),
			matureSize: new PlantSpeciesMatureSizeValueObject({
				height: 150,
				width: 60,
			}),
			growthTime: new PlantSpeciesGrowthTimeValueObject(90),
			tags: new PlantSpeciesTagsValueObject(['edible', 'popular']),
			isVerified: new BooleanValueObject(false),
			contributorId: null,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		};
	});

	describe('constructor', () => {
		it('should create a plant species aggregate with all properties', () => {
			const aggregate = new PlantSpeciesAggregate(plantSpeciesDto);

			expect(aggregate.id).toBe(plantSpeciesId);
			expect(aggregate.commonName.value).toBe('Tomato');
			expect(aggregate.scientificName.value).toBe('Solanum lycopersicum');
			expect(aggregate.family.value).toBe('Solanaceae');
			expect(aggregate.category.value).toBe(PlantSpeciesCategoryEnum.VEGETABLE);
			expect(aggregate.difficulty.value).toBe(PlantSpeciesDifficultyEnum.EASY);
			expect(aggregate.tags.value).toEqual(['edible', 'popular']);
			expect(aggregate.isVerified.value).toBe(false);
			expect(aggregate.contributorId).toBeNull();
			expect(aggregate.deletedAt).toBeNull();
		});
	});

	describe('changeCommonName', () => {
		it('should change the common name and emit event', () => {
			const aggregate = new PlantSpeciesAggregate(plantSpeciesDto);
			const newName = new PlantSpeciesCommonNameValueObject('Cherry Tomato');

			aggregate.changeCommonName(newName);

			expect(aggregate.commonName.value).toBe('Cherry Tomato');
			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantSpeciesCommonNameChangedEvent);
		});
	});

	describe('changeCategory', () => {
		it('should change the category and emit event', () => {
			const aggregate = new PlantSpeciesAggregate(plantSpeciesDto);
			const newCategory = new PlantSpeciesCategoryValueObject(
				PlantSpeciesCategoryEnum.FRUIT,
			);

			aggregate.changeCategory(newCategory);

			expect(aggregate.category.value).toBe(PlantSpeciesCategoryEnum.FRUIT);
			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantSpeciesCategoryChangedEvent);
		});
	});

	describe('changeIsVerified', () => {
		it('should change the verification status and emit event', () => {
			const aggregate = new PlantSpeciesAggregate(plantSpeciesDto);

			aggregate.changeIsVerified(new BooleanValueObject(true));

			expect(aggregate.isVerified.value).toBe(true);
			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantSpeciesIsVerifiedChangedEvent);
		});
	});

	describe('delete', () => {
		it('should set deletedAt when deleted', () => {
			const aggregate = new PlantSpeciesAggregate(plantSpeciesDto);

			aggregate.delete();

			expect(aggregate.deletedAt).not.toBeNull();
			expect(aggregate.isDeleted()).toBe(true);
		});

		it('should not be deleted initially', () => {
			const aggregate = new PlantSpeciesAggregate(plantSpeciesDto);

			expect(aggregate.isDeleted()).toBe(false);
		});
	});

	describe('toPrimitives', () => {
		it('should return primitive representation', () => {
			const aggregate = new PlantSpeciesAggregate(plantSpeciesDto);

			const primitives = aggregate.toPrimitives();

			expect(primitives.id).toBe(plantSpeciesId.value);
			expect(primitives.commonName).toBe('Tomato');
			expect(primitives.scientificName).toBe('Solanum lycopersicum');
			expect(primitives.family).toBe('Solanaceae');
			expect(primitives.category).toBe(PlantSpeciesCategoryEnum.VEGETABLE);
			expect(primitives.difficulty).toBe(PlantSpeciesDifficultyEnum.EASY);
			expect(primitives.temperatureRange).toEqual({ min: 15, max: 30 });
			expect(primitives.phRange).toEqual({ min: 6.0, max: 7.0 });
			expect(primitives.matureSize).toEqual({ height: 150, width: 60 });
			expect(primitives.growthTime).toBe(90);
			expect(primitives.tags).toEqual(['edible', 'popular']);
			expect(primitives.isVerified).toBe(false);
			expect(primitives.contributorId).toBeNull();
			expect(primitives.deletedAt).toBeNull();
		});
	});
});
