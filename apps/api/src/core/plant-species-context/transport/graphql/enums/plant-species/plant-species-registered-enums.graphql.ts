import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { registerEnumType } from '@nestjs/graphql';

/**
 * Registers all GraphQL enums for the plant species.
 * This file should be imported in the plant species module to ensure enums are registered before GraphQL schema generation.
 */
const registeredPlantSpeciesEnums = [
	{
		enum: PlantSpeciesCategoryEnum,
		name: 'PlantSpeciesCategoryEnum',
		description: 'The category of the plant species',
	},
	{
		enum: PlantSpeciesDifficultyEnum,
		name: 'PlantSpeciesDifficultyEnum',
		description: 'The difficulty level of the plant species',
	},
	{
		enum: PlantSpeciesGrowthRateEnum,
		name: 'PlantSpeciesGrowthRateEnum',
		description: 'The growth rate of the plant species',
	},
	{
		enum: PlantSpeciesHumidityRequirementsEnum,
		name: 'PlantSpeciesHumidityRequirementsEnum',
		description: 'The humidity requirements of the plant species',
	},
	{
		enum: PlantSpeciesLightRequirementsEnum,
		name: 'PlantSpeciesLightRequirementsEnum',
		description: 'The light requirements of the plant species',
	},
	{
		enum: PlantSpeciesSoilTypeEnum,
		name: 'PlantSpeciesSoilTypeEnum',
		description: 'The soil type preferred by the plant species',
	},
	{
		enum: PlantSpeciesWaterRequirementsEnum,
		name: 'PlantSpeciesWaterRequirementsEnum',
		description: 'The water requirements of the plant species',
	},
];

for (const {
	enum: enumType,
	name,
	description,
} of registeredPlantSpeciesEnums) {
	registerEnumType(enumType, { name, description });
}
