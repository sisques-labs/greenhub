import { Injectable, Logger } from '@nestjs/common';

import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { IPlantSpeciesDto } from '@/core/plant-species-context/domain/dtos/entities/plant-species/plant-species.dto';
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
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

/**
 * Builder class responsible for constructing {@link PlantSpeciesAggregate} instances
 * using a fluent interface. Supports building from DTOs and primitives.
 */
@Injectable()
export class PlantSpeciesAggregateBuilder {
	private readonly logger = new Logger(PlantSpeciesAggregateBuilder.name);

	private _id: PlantSpeciesUuidValueObject | null = null;
	private _commonName: PlantSpeciesCommonNameValueObject | null = null;
	private _scientificName: PlantSpeciesScientificNameValueObject | null = null;
	private _family: PlantSpeciesFamilyValueObject | null = null;
	private _description: PlantSpeciesDescriptionValueObject | null = null;
	private _category: PlantSpeciesCategoryValueObject | null = null;
	private _difficulty: PlantSpeciesDifficultyValueObject | null = null;
	private _growthRate: PlantSpeciesGrowthRateValueObject | null = null;
	private _lightRequirements: PlantSpeciesLightRequirementsValueObject | null =
		null;
	private _waterRequirements: PlantSpeciesWaterRequirementsValueObject | null =
		null;
	private _temperatureRange: PlantSpeciesTemperatureRangeValueObject | null =
		null;
	private _humidityRequirements: PlantSpeciesHumidityRequirementsValueObject | null =
		null;
	private _soilType: PlantSpeciesSoilTypeValueObject | null = null;
	private _phRange: PlantSpeciesPhRangeValueObject | null = null;
	private _matureSize: PlantSpeciesMatureSizeValueObject | null = null;
	private _growthTime: PlantSpeciesGrowthTimeValueObject | null = null;
	private _tags: PlantSpeciesTagsValueObject | null = null;
	private _isVerified: BooleanValueObject | null = null;
	private _contributorId: UserUuidValueObject | null = null;
	private _createdAt: Date | null = null;
	private _updatedAt: Date | null = null;
	private _deletedAt: Date | null = null;

	public withId(id: PlantSpeciesUuidValueObject): this {
		this._id = id;
		return this;
	}

	public withCommonName(commonName: PlantSpeciesCommonNameValueObject): this {
		this._commonName = commonName;
		return this;
	}

	public withScientificName(
		scientificName: PlantSpeciesScientificNameValueObject,
	): this {
		this._scientificName = scientificName;
		return this;
	}

	public withFamily(family: PlantSpeciesFamilyValueObject): this {
		this._family = family;
		return this;
	}

	public withDescription(
		description: PlantSpeciesDescriptionValueObject,
	): this {
		this._description = description;
		return this;
	}

	public withCategory(category: PlantSpeciesCategoryValueObject): this {
		this._category = category;
		return this;
	}

	public withDifficulty(difficulty: PlantSpeciesDifficultyValueObject): this {
		this._difficulty = difficulty;
		return this;
	}

	public withGrowthRate(growthRate: PlantSpeciesGrowthRateValueObject): this {
		this._growthRate = growthRate;
		return this;
	}

	public withLightRequirements(
		lightRequirements: PlantSpeciesLightRequirementsValueObject,
	): this {
		this._lightRequirements = lightRequirements;
		return this;
	}

	public withWaterRequirements(
		waterRequirements: PlantSpeciesWaterRequirementsValueObject,
	): this {
		this._waterRequirements = waterRequirements;
		return this;
	}

	public withTemperatureRange(
		temperatureRange: PlantSpeciesTemperatureRangeValueObject,
	): this {
		this._temperatureRange = temperatureRange;
		return this;
	}

	public withHumidityRequirements(
		humidityRequirements: PlantSpeciesHumidityRequirementsValueObject,
	): this {
		this._humidityRequirements = humidityRequirements;
		return this;
	}

	public withSoilType(soilType: PlantSpeciesSoilTypeValueObject): this {
		this._soilType = soilType;
		return this;
	}

	public withPhRange(phRange: PlantSpeciesPhRangeValueObject): this {
		this._phRange = phRange;
		return this;
	}

	public withMatureSize(matureSize: PlantSpeciesMatureSizeValueObject): this {
		this._matureSize = matureSize;
		return this;
	}

	public withGrowthTime(growthTime: PlantSpeciesGrowthTimeValueObject): this {
		this._growthTime = growthTime;
		return this;
	}

	public withTags(tags: PlantSpeciesTagsValueObject): this {
		this._tags = tags;
		return this;
	}

	public withIsVerified(isVerified: BooleanValueObject): this {
		this._isVerified = isVerified;
		return this;
	}

	public withContributorId(contributorId: UserUuidValueObject | null): this {
		this._contributorId = contributorId;
		return this;
	}

	public withCreatedAt(createdAt: Date): this {
		this._createdAt = createdAt;
		return this;
	}

	public withUpdatedAt(updatedAt: Date): this {
		this._updatedAt = updatedAt;
		return this;
	}

	public withDeletedAt(deletedAt: Date | null): this {
		this._deletedAt = deletedAt;
		return this;
	}

	/**
	 * Populates the builder from a DTO containing value objects.
	 */
	public fromDto(dto: IPlantSpeciesDto): this {
		this.logger.log(`Populating builder from DTO: ${dto.id.value}`);

		this._id = dto.id;
		this._commonName = dto.commonName;
		this._scientificName = dto.scientificName;
		this._family = dto.family;
		this._description = dto.description;
		this._category = dto.category;
		this._difficulty = dto.difficulty;
		this._growthRate = dto.growthRate;
		this._lightRequirements = dto.lightRequirements;
		this._waterRequirements = dto.waterRequirements;
		this._temperatureRange = dto.temperatureRange;
		this._humidityRequirements = dto.humidityRequirements;
		this._soilType = dto.soilType;
		this._phRange = dto.phRange;
		this._matureSize = dto.matureSize;
		this._growthTime = dto.growthTime;
		this._tags = dto.tags;
		this._isVerified = dto.isVerified;
		this._contributorId = dto.contributorId;
		this._createdAt = dto.createdAt;
		this._updatedAt = dto.updatedAt;
		this._deletedAt = dto.deletedAt;

		return this;
	}

	/**
	 * Populates the builder from primitives (serialized form).
	 */
	public fromPrimitives(primitives: PlantSpeciesPrimitives): this {
		this.logger.log(
			`Populating builder from primitives: ${primitives.id}`,
		);

		this._id = new PlantSpeciesUuidValueObject(primitives.id);
		this._commonName = new PlantSpeciesCommonNameValueObject(
			primitives.commonName,
		);
		this._scientificName = new PlantSpeciesScientificNameValueObject(
			primitives.scientificName,
		);
		this._family = new PlantSpeciesFamilyValueObject(primitives.family);
		this._description = new PlantSpeciesDescriptionValueObject(
			primitives.description,
		);
		this._category = new PlantSpeciesCategoryValueObject(
			primitives.category as PlantSpeciesCategoryEnum,
		);
		this._difficulty = new PlantSpeciesDifficultyValueObject(
			primitives.difficulty as PlantSpeciesDifficultyEnum,
		);
		this._growthRate = new PlantSpeciesGrowthRateValueObject(
			primitives.growthRate as PlantSpeciesGrowthRateEnum,
		);
		this._lightRequirements = new PlantSpeciesLightRequirementsValueObject(
			primitives.lightRequirements as PlantSpeciesLightRequirementsEnum,
		);
		this._waterRequirements = new PlantSpeciesWaterRequirementsValueObject(
			primitives.waterRequirements as PlantSpeciesWaterRequirementsEnum,
		);
		this._temperatureRange = new PlantSpeciesTemperatureRangeValueObject(
			primitives.temperatureRange,
		);
		this._humidityRequirements = new PlantSpeciesHumidityRequirementsValueObject(
			primitives.humidityRequirements as PlantSpeciesHumidityRequirementsEnum,
		);
		this._soilType = new PlantSpeciesSoilTypeValueObject(
			primitives.soilType as PlantSpeciesSoilTypeEnum,
		);
		this._phRange = new PlantSpeciesPhRangeValueObject(primitives.phRange);
		this._matureSize = new PlantSpeciesMatureSizeValueObject(
			primitives.matureSize,
		);
		this._growthTime = new PlantSpeciesGrowthTimeValueObject(
			primitives.growthTime,
		);
		this._tags = new PlantSpeciesTagsValueObject(primitives.tags);
		this._isVerified = new BooleanValueObject(primitives.isVerified);
		this._contributorId = primitives.contributorId
			? new UserUuidValueObject(primitives.contributorId)
			: null;
		this._createdAt = primitives.createdAt;
		this._updatedAt = primitives.updatedAt;
		this._deletedAt = primitives.deletedAt;

		return this;
	}

	/**
	 * Resets the builder to its initial state.
	 */
	public reset(): this {
		this._id = null;
		this._commonName = null;
		this._scientificName = null;
		this._family = null;
		this._description = null;
		this._category = null;
		this._difficulty = null;
		this._growthRate = null;
		this._lightRequirements = null;
		this._waterRequirements = null;
		this._temperatureRange = null;
		this._humidityRequirements = null;
		this._soilType = null;
		this._phRange = null;
		this._matureSize = null;
		this._growthTime = null;
		this._tags = null;
		this._isVerified = null;
		this._contributorId = null;
		this._createdAt = null;
		this._updatedAt = null;
		this._deletedAt = null;

		return this;
	}

	/**
	 * Builds and returns the {@link PlantSpeciesAggregate} instance.
	 * @throws Error if required fields are missing.
	 */
	public build(): PlantSpeciesAggregate {
		this.logger.log('Building PlantSpeciesAggregate from builder');

		const now = new Date();

		if (!this._id) {
			this._id = new PlantSpeciesUuidValueObject();
		}

		if (!this._commonName) {
			throw new Error('PlantSpeciesAggregate commonName is required');
		}

		if (!this._scientificName) {
			throw new Error('PlantSpeciesAggregate scientificName is required');
		}

		if (!this._family) {
			throw new Error('PlantSpeciesAggregate family is required');
		}

		if (!this._description) {
			throw new Error('PlantSpeciesAggregate description is required');
		}

		if (!this._category) {
			throw new Error('PlantSpeciesAggregate category is required');
		}

		if (!this._difficulty) {
			throw new Error('PlantSpeciesAggregate difficulty is required');
		}

		if (!this._growthRate) {
			throw new Error('PlantSpeciesAggregate growthRate is required');
		}

		if (!this._lightRequirements) {
			throw new Error('PlantSpeciesAggregate lightRequirements is required');
		}

		if (!this._waterRequirements) {
			throw new Error('PlantSpeciesAggregate waterRequirements is required');
		}

		if (!this._temperatureRange) {
			throw new Error('PlantSpeciesAggregate temperatureRange is required');
		}

		if (!this._humidityRequirements) {
			throw new Error('PlantSpeciesAggregate humidityRequirements is required');
		}

		if (!this._soilType) {
			throw new Error('PlantSpeciesAggregate soilType is required');
		}

		if (!this._phRange) {
			throw new Error('PlantSpeciesAggregate phRange is required');
		}

		if (!this._matureSize) {
			throw new Error('PlantSpeciesAggregate matureSize is required');
		}

		if (!this._growthTime) {
			throw new Error('PlantSpeciesAggregate growthTime is required');
		}

		const dto: IPlantSpeciesDto = {
			id: this._id,
			commonName: this._commonName,
			scientificName: this._scientificName,
			family: this._family,
			description: this._description,
			category: this._category,
			difficulty: this._difficulty,
			growthRate: this._growthRate,
			lightRequirements: this._lightRequirements,
			waterRequirements: this._waterRequirements,
			temperatureRange: this._temperatureRange,
			humidityRequirements: this._humidityRequirements,
			soilType: this._soilType,
			phRange: this._phRange,
			matureSize: this._matureSize,
			growthTime: this._growthTime,
			tags: this._tags ?? new PlantSpeciesTagsValueObject([]),
			isVerified: this._isVerified ?? new BooleanValueObject(false),
			contributorId: this._contributorId,
			createdAt: this._createdAt ?? now,
			updatedAt: this._updatedAt ?? now,
			deletedAt: this._deletedAt,
		};

		return new PlantSpeciesAggregate(dto);
	}
}
