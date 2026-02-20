import type { IPlantSpeciesCreateCommandDto } from '@/core/plant-species-context/application/dtos/commands/plant-species/plant-species-create/plant-species-create-command.dto';
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
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

/**
 * Command for creating a new plant species.
 *
 * @remarks
 * This command encapsulates the data needed to create a plant species aggregate,
 * converting primitives to value objects.
 */
export class PlantSpeciesCreateCommand {
	readonly id: PlantSpeciesUuidValueObject;
	readonly commonName: PlantSpeciesCommonNameValueObject;
	readonly scientificName: PlantSpeciesScientificNameValueObject;
	readonly family: PlantSpeciesFamilyValueObject | null;
	readonly description: PlantSpeciesDescriptionValueObject | null;
	readonly category: PlantSpeciesCategoryValueObject;
	readonly difficulty: PlantSpeciesDifficultyValueObject;
	readonly growthRate: PlantSpeciesGrowthRateValueObject;
	readonly lightRequirements: PlantSpeciesLightRequirementsValueObject;
	readonly waterRequirements: PlantSpeciesWaterRequirementsValueObject;
	readonly temperatureRange: PlantSpeciesTemperatureRangeValueObject | null;
	readonly humidityRequirements: PlantSpeciesHumidityRequirementsValueObject | null;
	readonly soilType: PlantSpeciesSoilTypeValueObject | null;
	readonly phRange: PlantSpeciesPhRangeValueObject | null;
	readonly matureSize: PlantSpeciesMatureSizeValueObject | null;
	readonly growthTime: PlantSpeciesGrowthTimeValueObject | null;
	readonly tags: PlantSpeciesTagsValueObject | null;
	readonly contributorId: UserUuidValueObject | null;

	constructor(props: IPlantSpeciesCreateCommandDto) {
		this.id = new PlantSpeciesUuidValueObject();
		this.commonName = new PlantSpeciesCommonNameValueObject(props.commonName);
		this.scientificName = new PlantSpeciesScientificNameValueObject(
			props.scientificName,
		);
		this.family = props.family
			? new PlantSpeciesFamilyValueObject(props.family)
			: null;
		this.description = props.description
			? new PlantSpeciesDescriptionValueObject(props.description)
			: null;
		this.category = new PlantSpeciesCategoryValueObject(
			props.category as PlantSpeciesCategoryEnum,
		);
		this.difficulty = new PlantSpeciesDifficultyValueObject(
			props.difficulty as PlantSpeciesDifficultyEnum,
		);
		this.growthRate = new PlantSpeciesGrowthRateValueObject(
			props.growthRate as PlantSpeciesGrowthRateEnum,
		);
		this.lightRequirements = new PlantSpeciesLightRequirementsValueObject(
			props.lightRequirements as PlantSpeciesLightRequirementsEnum,
		);
		this.waterRequirements = new PlantSpeciesWaterRequirementsValueObject(
			props.waterRequirements as PlantSpeciesWaterRequirementsEnum,
		);
		this.temperatureRange = props.temperatureRange
			? new PlantSpeciesTemperatureRangeValueObject(props.temperatureRange)
			: null;
		this.humidityRequirements = props.humidityRequirements
			? new PlantSpeciesHumidityRequirementsValueObject(
					props.humidityRequirements as PlantSpeciesHumidityRequirementsEnum,
				)
			: null;
		this.soilType = props.soilType
			? new PlantSpeciesSoilTypeValueObject(
					props.soilType as PlantSpeciesSoilTypeEnum,
				)
			: null;
		this.phRange = props.phRange
			? new PlantSpeciesPhRangeValueObject(props.phRange)
			: null;
		this.matureSize = props.matureSize
			? new PlantSpeciesMatureSizeValueObject(props.matureSize)
			: null;
		this.growthTime = props.growthTime
			? new PlantSpeciesGrowthTimeValueObject(props.growthTime)
			: null;
		this.tags = props.tags ? new PlantSpeciesTagsValueObject(props.tags) : null;
		this.contributorId = props.contributorId
			? new UserUuidValueObject(props.contributorId)
			: null;
	}
}
