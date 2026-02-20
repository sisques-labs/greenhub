import type { IPlantSpeciesUpdateCommandDto } from '@/core/plant-species-context/application/dtos/commands/plant-species/plant-species-update/plant-species-update-command.dto';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
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
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';

/**
 * Command for updating an existing plant species.
 *
 * @remarks
 * This command encapsulates the data needed to update a plant species aggregate,
 * converting primitives to value objects. All fields except id are optional.
 */
export class PlantSpeciesUpdateCommand {
	readonly id: PlantSpeciesUuidValueObject;
	readonly commonName?: PlantSpeciesCommonNameValueObject;
	readonly scientificName?: PlantSpeciesScientificNameValueObject;
	readonly family?: PlantSpeciesFamilyValueObject;
	readonly description?: PlantSpeciesDescriptionValueObject;
	readonly category?: PlantSpeciesCategoryValueObject;
	readonly difficulty?: PlantSpeciesDifficultyValueObject;
	readonly growthRate?: PlantSpeciesGrowthRateValueObject;
	readonly lightRequirements?: PlantSpeciesLightRequirementsValueObject;
	readonly waterRequirements?: PlantSpeciesWaterRequirementsValueObject;
	readonly temperatureRange?: PlantSpeciesTemperatureRangeValueObject;
	readonly humidityRequirements?: PlantSpeciesHumidityRequirementsValueObject;
	readonly soilType?: PlantSpeciesSoilTypeValueObject;
	readonly phRange?: PlantSpeciesPhRangeValueObject;
	readonly matureSize?: PlantSpeciesMatureSizeValueObject;
	readonly growthTime?: PlantSpeciesGrowthTimeValueObject;
	readonly tags?: PlantSpeciesTagsValueObject;

	constructor(props: IPlantSpeciesUpdateCommandDto) {
		this.id = new PlantSpeciesUuidValueObject(props.id);
		this.commonName = props.commonName
			? new PlantSpeciesCommonNameValueObject(props.commonName)
			: undefined;
		this.scientificName = props.scientificName
			? new PlantSpeciesScientificNameValueObject(props.scientificName)
			: undefined;
		this.family = props.family
			? new PlantSpeciesFamilyValueObject(props.family)
			: undefined;
		this.description = props.description
			? new PlantSpeciesDescriptionValueObject(props.description)
			: undefined;
		this.category = props.category
			? new PlantSpeciesCategoryValueObject(
					props.category as PlantSpeciesCategoryEnum,
				)
			: undefined;
		this.difficulty = props.difficulty
			? new PlantSpeciesDifficultyValueObject(
					props.difficulty as PlantSpeciesDifficultyEnum,
				)
			: undefined;
		this.growthRate = props.growthRate
			? new PlantSpeciesGrowthRateValueObject(
					props.growthRate as PlantSpeciesGrowthRateEnum,
				)
			: undefined;
		this.lightRequirements = props.lightRequirements
			? new PlantSpeciesLightRequirementsValueObject(
					props.lightRequirements as PlantSpeciesLightRequirementsEnum,
				)
			: undefined;
		this.waterRequirements = props.waterRequirements
			? new PlantSpeciesWaterRequirementsValueObject(
					props.waterRequirements as PlantSpeciesWaterRequirementsEnum,
				)
			: undefined;
		this.temperatureRange = props.temperatureRange
			? new PlantSpeciesTemperatureRangeValueObject(props.temperatureRange)
			: undefined;
		this.humidityRequirements = props.humidityRequirements
			? new PlantSpeciesHumidityRequirementsValueObject(
					props.humidityRequirements as PlantSpeciesHumidityRequirementsEnum,
				)
			: undefined;
		this.soilType = props.soilType
			? new PlantSpeciesSoilTypeValueObject(
					props.soilType as PlantSpeciesSoilTypeEnum,
				)
			: undefined;
		this.phRange = props.phRange
			? new PlantSpeciesPhRangeValueObject(props.phRange)
			: undefined;
		this.matureSize = props.matureSize
			? new PlantSpeciesMatureSizeValueObject(props.matureSize)
			: undefined;
		this.growthTime = props.growthTime
			? new PlantSpeciesGrowthTimeValueObject(props.growthTime)
			: undefined;
		this.tags = props.tags
			? new PlantSpeciesTagsValueObject(props.tags)
			: undefined;
	}
}
