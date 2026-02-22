/**
 * Plant Species Enums
 * Aligned with backend PlantSpeciesCategoryEnum
 */
export enum PlantSpeciesCategory {
	VEGETABLE = 'VEGETABLE',
	FRUIT = 'FRUIT',
	HERB = 'HERB',
	FLOWER = 'FLOWER',
	TREE = 'TREE',
	SHRUB = 'SHRUB',
	SUCCULENT = 'SUCCULENT',
	FERN = 'FERN',
	GRASS = 'GRASS',
	OTHER = 'OTHER',
}

/**
 * Aligned with backend PlantSpeciesDifficultyEnum
 */
export enum PlantSpeciesDifficulty {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	HARD = 'HARD',
}

/**
 * Aligned with backend PlantSpeciesGrowthRateEnum
 */
export enum PlantSpeciesGrowthRate {
	SLOW = 'SLOW',
	MEDIUM = 'MEDIUM',
	FAST = 'FAST',
}

/**
 * Aligned with backend PlantSpeciesLightRequirementsEnum
 */
export enum PlantSpeciesLightRequirements {
	FULL_SUN = 'FULL_SUN',
	PARTIAL_SUN = 'PARTIAL_SUN',
	PARTIAL_SHADE = 'PARTIAL_SHADE',
	FULL_SHADE = 'FULL_SHADE',
}

/**
 * Aligned with backend PlantSpeciesWaterRequirementsEnum
 */
export enum PlantSpeciesWaterRequirements {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

/**
 * Aligned with backend PlantSpeciesHumidityRequirementsEnum
 */
export enum PlantSpeciesHumidityRequirements {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

/**
 * Aligned with backend PlantSpeciesSoilTypeEnum
 */
export enum PlantSpeciesSoilType {
	SANDY = 'SANDY',
	LOAMY = 'LOAMY',
	CLAY = 'CLAY',
	PEATY = 'PEATY',
	CHALKY = 'CHALKY',
}

/**
 * Numeric range type (temperature range, pH range)
 */
export interface PlantSpeciesNumericRange {
	min: number;
	max: number;
}

/**
 * Mature size of a plant species (in centimeters)
 */
export interface PlantSpeciesMatureSize {
	height: number;
	width: number;
}
