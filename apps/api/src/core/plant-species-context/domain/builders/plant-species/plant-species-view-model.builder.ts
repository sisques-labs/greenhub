import { Injectable, Logger } from '@nestjs/common';

import { IPlantSpeciesViewModelDto } from '@/core/plant-species-context/domain/dtos/view-models/plant-species/plant-species-view-model.dto';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { PlantSpeciesViewModelCategoryRequiredException } from '@/core/plant-species-context/domain/exceptions/plant-species-view-model/plant-species-view-model-category-required/plant-species-view-model-category-required.exception';
import { PlantSpeciesViewModelCommonNameRequiredException } from '@/core/plant-species-context/domain/exceptions/plant-species-view-model/plant-species-view-model-common-name-required/plant-species-view-model-common-name-required.exception';
import { PlantSpeciesViewModelIdRequiredException } from '@/core/plant-species-context/domain/exceptions/plant-species-view-model/plant-species-view-model-id-required/plant-species-view-model-id-required.exception';
import { PlantSpeciesViewModelScientificNameRequiredException } from '@/core/plant-species-context/domain/exceptions/plant-species-view-model/plant-species-view-model-scientific-name-required/plant-species-view-model-scientific-name-required.exception';
import { PlantSpeciesPrimitives } from '@/core/plant-species-context/domain/primitives/plant-species/plant-species.primitives';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

/**
 * Builder class responsible for constructing {@link PlantSpeciesViewModel} instances using a fluent interface.
 */
@Injectable()
export class PlantSpeciesViewModelBuilder {
	private readonly logger = new Logger(PlantSpeciesViewModelBuilder.name);

	private _id: string | null = null;
	private _commonName: string | null = null;
	private _scientificName: string | null = null;
	private _family: string | null = null;
	private _description: string | null = null;
	private _category: string | null = null;
	private _difficulty: string | null = null;
	private _growthRate: string | null = null;
	private _lightRequirements: string | null = null;
	private _waterRequirements: string | null = null;
	private _temperatureRange: { min: number; max: number } | null = null;
	private _humidityRequirements: string | null = null;
	private _soilType: string | null = null;
	private _phRange: { min: number; max: number } | null = null;
	private _matureSize: { height: number; width: number } | null = null;
	private _growthTime: number | null = null;
	private _tags: string[] | null = null;
	private _isVerified: boolean | null = null;
	private _contributorId: string | null = null;
	private _createdAt: Date | null = null;
	private _updatedAt: Date | null = null;

	public withId(id: string): this {
		this._id = id;
		return this;
	}

	public withCommonName(commonName: string): this {
		this._commonName = commonName;
		return this;
	}

	public withScientificName(scientificName: string): this {
		this._scientificName = scientificName;
		return this;
	}

	public withFamily(family: string): this {
		this._family = family;
		return this;
	}

	public withDescription(description: string): this {
		this._description = description;
		return this;
	}

	public withCategory(category: string): this {
		this._category = category;
		return this;
	}

	public withDifficulty(difficulty: string): this {
		this._difficulty = difficulty;
		return this;
	}

	public withGrowthRate(growthRate: string): this {
		this._growthRate = growthRate;
		return this;
	}

	public withLightRequirements(lightRequirements: string): this {
		this._lightRequirements = lightRequirements;
		return this;
	}

	public withWaterRequirements(waterRequirements: string): this {
		this._waterRequirements = waterRequirements;
		return this;
	}

	public withTemperatureRange(temperatureRange: {
		min: number;
		max: number;
	}): this {
		this._temperatureRange = temperatureRange;
		return this;
	}

	public withHumidityRequirements(humidityRequirements: string): this {
		this._humidityRequirements = humidityRequirements;
		return this;
	}

	public withSoilType(soilType: string): this {
		this._soilType = soilType;
		return this;
	}

	public withPhRange(phRange: { min: number; max: number }): this {
		this._phRange = phRange;
		return this;
	}

	public withMatureSize(matureSize: { height: number; width: number }): this {
		this._matureSize = matureSize;
		return this;
	}

	public withGrowthTime(growthTime: number): this {
		this._growthTime = growthTime;
		return this;
	}

	public withTags(tags: string[]): this {
		this._tags = tags;
		return this;
	}

	public withIsVerified(isVerified: boolean): this {
		this._isVerified = isVerified;
		return this;
	}

	public withContributorId(contributorId: string | null): this {
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

	/**
	 * Populates the builder from a DTO.
	 */
	public fromDto(dto: IPlantSpeciesViewModelDto): this {
		this.logger.log(`Populating builder from DTO: ${dto.id}`);

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
		this._createdAt = dto.createdAt ?? null;
		this._updatedAt = dto.updatedAt ?? null;

		return this;
	}

	/**
	 * Populates the builder from primitives.
	 */
	public fromPrimitives(primitives: PlantSpeciesPrimitives): this {
		this.logger.log(
			`Populating builder from primitives: ${primitives.id}`,
		);

		const now = new Date();

		this._id = primitives.id;
		this._commonName = primitives.commonName;
		this._scientificName = primitives.scientificName;
		this._family = primitives.family;
		this._description = primitives.description;
		this._category = primitives.category;
		this._difficulty = primitives.difficulty;
		this._growthRate = primitives.growthRate;
		this._lightRequirements = primitives.lightRequirements;
		this._waterRequirements = primitives.waterRequirements;
		this._temperatureRange = primitives.temperatureRange;
		this._humidityRequirements = primitives.humidityRequirements;
		this._soilType = primitives.soilType;
		this._phRange = primitives.phRange;
		this._matureSize = primitives.matureSize;
		this._growthTime = primitives.growthTime;
		this._tags = primitives.tags;
		this._isVerified = primitives.isVerified;
		this._contributorId = primitives.contributorId;
		this._createdAt = primitives.createdAt ?? now;
		this._updatedAt = primitives.updatedAt ?? now;

		return this;
	}

	/**
	 * Populates the builder from an aggregate.
	 */
	public fromAggregate(aggregate: PlantSpeciesAggregate): this {
		this.logger.log(
			`Populating builder from aggregate: ${aggregate.id.value}`,
		);

		const now = new Date();

		this._id = aggregate.id.value;
		this._commonName = aggregate.commonName.value;
		this._scientificName = aggregate.scientificName.value;
		this._family = aggregate.family.value;
		this._description = aggregate.description.value;
		this._category = aggregate.category.value;
		this._difficulty = aggregate.difficulty.value;
		this._growthRate = aggregate.growthRate.value;
		this._lightRequirements = aggregate.lightRequirements.value;
		this._waterRequirements = aggregate.waterRequirements.value;
		this._temperatureRange = aggregate.temperatureRange.toPrimitives();
		this._humidityRequirements = aggregate.humidityRequirements.value;
		this._soilType = aggregate.soilType.value;
		this._phRange = aggregate.phRange.toPrimitives();
		this._matureSize = aggregate.matureSize.toPrimitives();
		this._growthTime = aggregate.growthTime.value;
		this._tags = aggregate.tags.toPrimitives();
		this._isVerified = aggregate.isVerified.value;
		this._contributorId = aggregate.contributorId?.value ?? null;
		this._createdAt = aggregate.createdAt ?? now;
		this._updatedAt = aggregate.updatedAt ?? now;

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

		return this;
	}

	/**
	 * Builds and returns the {@link PlantSpeciesViewModel} instance.
	 * @throws {PlantSpeciesViewModelIdRequiredException} If id is missing.
	 * @throws {PlantSpeciesViewModelCommonNameRequiredException} If commonName is missing.
	 * @throws {PlantSpeciesViewModelScientificNameRequiredException} If scientificName is missing.
	 * @throws {PlantSpeciesViewModelCategoryRequiredException} If category is missing.
	 */
	public build(): PlantSpeciesViewModel {
		this.logger.log('Building PlantSpeciesViewModel from builder');

		const now = new Date();

		if (!this._id) {
			throw new PlantSpeciesViewModelIdRequiredException();
		}

		if (!this._commonName) {
			throw new PlantSpeciesViewModelCommonNameRequiredException();
		}

		if (!this._scientificName) {
			throw new PlantSpeciesViewModelScientificNameRequiredException();
		}

		if (!this._category) {
			throw new PlantSpeciesViewModelCategoryRequiredException();
		}

		const dto: IPlantSpeciesViewModelDto = {
			id: this._id,
			commonName: this._commonName,
			scientificName: this._scientificName,
			family: this._family ?? '',
			description: this._description ?? '',
			category: this._category,
			difficulty: this._difficulty ?? '',
			growthRate: this._growthRate ?? '',
			lightRequirements: this._lightRequirements ?? '',
			waterRequirements: this._waterRequirements ?? '',
			temperatureRange: this._temperatureRange ?? { min: 0, max: 0 },
			humidityRequirements: this._humidityRequirements ?? '',
			soilType: this._soilType ?? '',
			phRange: this._phRange ?? { min: 0, max: 14 },
			matureSize: this._matureSize ?? { height: 0, width: 0 },
			growthTime: this._growthTime ?? 0,
			tags: this._tags ?? [],
			isVerified: this._isVerified ?? false,
			contributorId: this._contributorId,
			createdAt: this._createdAt ?? now,
			updatedAt: this._updatedAt ?? now,
		};

		return new PlantSpeciesViewModel(dto);
	}
}
