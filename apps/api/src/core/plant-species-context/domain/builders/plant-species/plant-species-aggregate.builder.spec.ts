import { PlantSpeciesAggregateBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-aggregate.builder';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesPrimitives } from '@/core/plant-species-context/domain/primitives/plant-species/plant-species.primitives';
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

describe('PlantSpeciesAggregateBuilder', () => {
	let builder: PlantSpeciesAggregateBuilder;
	let validPrimitives: PlantSpeciesPrimitives;

	beforeEach(() => {
		builder = new PlantSpeciesAggregateBuilder();
		const now = new Date();
		validPrimitives = {
			id: new PlantSpeciesUuidValueObject().value,
			commonName: 'Tomato',
			scientificName: 'Solanum lycopersicum',
			family: 'Solanaceae',
			description: 'A popular garden vegetable.',
			category: PlantSpeciesCategoryEnum.VEGETABLE,
			difficulty: PlantSpeciesDifficultyEnum.EASY,
			growthRate: PlantSpeciesGrowthRateEnum.MEDIUM,
			lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
			waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
			temperatureRange: { min: 15, max: 30 },
			humidityRequirements: PlantSpeciesHumidityRequirementsEnum.MEDIUM,
			soilType: PlantSpeciesSoilTypeEnum.LOAMY,
			phRange: { min: 6.0, max: 7.0 },
			matureSize: { height: 150, width: 60 },
			growthTime: 90,
			tags: ['edible', 'popular'],
			isVerified: false,
			contributorId: null,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		};
	});

	describe('fromPrimitives', () => {
		it('should build aggregate from primitives', () => {
			const aggregate = builder.fromPrimitives(validPrimitives).build();

			expect(aggregate.commonName.value).toBe('Tomato');
			expect(aggregate.scientificName.value).toBe('Solanum lycopersicum');
			expect(aggregate.category.value).toBe(PlantSpeciesCategoryEnum.VEGETABLE);
			expect(aggregate.growthTime.value).toBe(90);
			expect(aggregate.tags.value).toEqual(['edible', 'popular']);
			expect(aggregate.isVerified.value).toBe(false);
			expect(aggregate.contributorId).toBeNull();
		});

		it('should build aggregate with contributorId from primitives', () => {
			const contributorId = new PlantSpeciesUuidValueObject().value;
			const primitives = { ...validPrimitives, contributorId };

			const aggregate = builder.fromPrimitives(primitives).build();

			expect(aggregate.contributorId).not.toBeNull();
			expect(aggregate.contributorId?.value).toBe(contributorId);
		});
	});

	describe('fromDto', () => {
		it('should build aggregate from DTO', () => {
			const id = new PlantSpeciesUuidValueObject();
			const now = new Date();

			const dto = {
				id,
				commonName: new PlantSpeciesCommonNameValueObject('Basil'),
				scientificName: new PlantSpeciesScientificNameValueObject(
					'Ocimum basilicum',
				),
				family: new PlantSpeciesFamilyValueObject('Lamiaceae'),
				description: new PlantSpeciesDescriptionValueObject('An aromatic herb.'),
				category: new PlantSpeciesCategoryValueObject(
					PlantSpeciesCategoryEnum.HERB,
				),
				difficulty: new PlantSpeciesDifficultyValueObject(
					PlantSpeciesDifficultyEnum.EASY,
				),
				growthRate: new PlantSpeciesGrowthRateValueObject(
					PlantSpeciesGrowthRateEnum.FAST,
				),
				lightRequirements: new PlantSpeciesLightRequirementsValueObject(
					PlantSpeciesLightRequirementsEnum.FULL_SUN,
				),
				waterRequirements: new PlantSpeciesWaterRequirementsValueObject(
					PlantSpeciesWaterRequirementsEnum.MEDIUM,
				),
				temperatureRange: new PlantSpeciesTemperatureRangeValueObject({
					min: 18,
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
					height: 60,
					width: 30,
				}),
				growthTime: new PlantSpeciesGrowthTimeValueObject(60),
				tags: new PlantSpeciesTagsValueObject(['herb', 'culinary']),
				isVerified: new BooleanValueObject(true),
				contributorId: null,
				createdAt: now,
				updatedAt: now,
				deletedAt: null,
			};

			const aggregate = builder.fromDto(dto).build();

			expect(aggregate.id).toBe(id);
			expect(aggregate.commonName.value).toBe('Basil');
			expect(aggregate.category.value).toBe(PlantSpeciesCategoryEnum.HERB);
		});
	});

	describe('fluent builder', () => {
		it('should build aggregate with individual setters', () => {
			const aggregate = builder
				.withCommonName(new PlantSpeciesCommonNameValueObject('Lavender'))
				.withScientificName(
					new PlantSpeciesScientificNameValueObject('Lavandula angustifolia'),
				)
				.withFamily(new PlantSpeciesFamilyValueObject('Lamiaceae'))
				.withDescription(
					new PlantSpeciesDescriptionValueObject('A fragrant herb.'),
				)
				.withCategory(
					new PlantSpeciesCategoryValueObject(PlantSpeciesCategoryEnum.HERB),
				)
				.withDifficulty(
					new PlantSpeciesDifficultyValueObject(
						PlantSpeciesDifficultyEnum.EASY,
					),
				)
				.withGrowthRate(
					new PlantSpeciesGrowthRateValueObject(PlantSpeciesGrowthRateEnum.SLOW),
				)
				.withLightRequirements(
					new PlantSpeciesLightRequirementsValueObject(
						PlantSpeciesLightRequirementsEnum.FULL_SUN,
					),
				)
				.withWaterRequirements(
					new PlantSpeciesWaterRequirementsValueObject(
						PlantSpeciesWaterRequirementsEnum.LOW,
					),
				)
				.withTemperatureRange(
					new PlantSpeciesTemperatureRangeValueObject({ min: 5, max: 30 }),
				)
				.withHumidityRequirements(
					new PlantSpeciesHumidityRequirementsValueObject(
						PlantSpeciesHumidityRequirementsEnum.LOW,
					),
				)
				.withSoilType(
					new PlantSpeciesSoilTypeValueObject(PlantSpeciesSoilTypeEnum.SANDY),
				)
				.withPhRange(
					new PlantSpeciesPhRangeValueObject({ min: 6.5, max: 7.5 }),
				)
				.withMatureSize(
					new PlantSpeciesMatureSizeValueObject({ height: 90, width: 60 }),
				)
				.withGrowthTime(new PlantSpeciesGrowthTimeValueObject(120))
				.build();

			expect(aggregate.commonName.value).toBe('Lavender');
			expect(aggregate.category.value).toBe(PlantSpeciesCategoryEnum.HERB);
		});
	});

	describe('reset', () => {
		it('should reset builder state', () => {
			builder
				.withCommonName(new PlantSpeciesCommonNameValueObject('Tomato'))
				.reset();

			expect(() => builder.build()).toThrow();
		});
	});

	describe('build validation', () => {
		it('should throw when required fields are missing', () => {
			expect(() => builder.build()).toThrow();
		});

		it('should auto-generate id if not provided', () => {
			const aggregate = builder.fromPrimitives(validPrimitives).build();
			const aggregate2 = new PlantSpeciesAggregateBuilder()
				.fromPrimitives({ ...validPrimitives, id: new PlantSpeciesUuidValueObject().value })
				.build();

			expect(aggregate.id.value).toBeTruthy();
			expect(aggregate2.id.value).toBeTruthy();
		});
	});
});
