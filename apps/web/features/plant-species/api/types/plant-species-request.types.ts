import type {
	PlantSpeciesCategory,
	PlantSpeciesDifficulty,
	PlantSpeciesGrowthRate,
	PlantSpeciesHumidityRequirements,
	PlantSpeciesLightRequirements,
	PlantSpeciesMatureSize,
	PlantSpeciesNumericRange,
	PlantSpeciesSoilType,
	PlantSpeciesWaterRequirements,
} from './plant-species.types';

/**
 * Input for creating a new plant species
 */
export interface PlantSpeciesCreateInput {
	commonName: string;
	scientificName: string;
	family?: string;
	description?: string;
	category: PlantSpeciesCategory;
	difficulty: PlantSpeciesDifficulty;
	growthRate: PlantSpeciesGrowthRate;
	lightRequirements: PlantSpeciesLightRequirements;
	waterRequirements: PlantSpeciesWaterRequirements;
	temperatureRange?: PlantSpeciesNumericRange;
	humidityRequirements?: PlantSpeciesHumidityRequirements;
	soilType?: PlantSpeciesSoilType;
	phRange?: PlantSpeciesNumericRange;
	matureSize?: PlantSpeciesMatureSize;
	growthTime?: number;
	tags?: string[];
	contributorId?: string;
	isVerified?: boolean;
}

/**
 * Input for updating an existing plant species
 */
export interface PlantSpeciesUpdateInput {
	id: string;
	commonName?: string;
	scientificName?: string;
	family?: string;
	description?: string;
	category?: PlantSpeciesCategory;
	difficulty?: PlantSpeciesDifficulty;
	growthRate?: PlantSpeciesGrowthRate;
	lightRequirements?: PlantSpeciesLightRequirements;
	waterRequirements?: PlantSpeciesWaterRequirements;
	temperatureRange?: PlantSpeciesNumericRange;
	humidityRequirements?: PlantSpeciesHumidityRequirements;
	soilType?: PlantSpeciesSoilType;
	phRange?: PlantSpeciesNumericRange;
	matureSize?: PlantSpeciesMatureSize;
	growthTime?: number;
	tags?: string[];
}

/**
 * Input for deleting a plant species
 */
export interface PlantSpeciesDeleteInput {
	id: string;
}

/**
 * Input for finding a plant species by ID
 */
export interface PlantSpeciesFindByIdInput {
	id: string;
}

/**
 * Pagination input
 */
export interface PlantSpeciesPaginationInput {
	page?: number;
	perPage?: number;
}

/**
 * Sort input
 */
export interface PlantSpeciesSortInput {
	field: string;
	order: 'ASC' | 'DESC';
}

/**
 * Filter input
 */
export interface PlantSpeciesFilterInput {
	field: string;
	operator: string;
	value: string | number | boolean;
}

/**
 * Input for finding plant species by criteria
 */
export interface PlantSpeciesFindByCriteriaInput {
	filters?: PlantSpeciesFilterInput[];
	sorts?: PlantSpeciesSortInput[];
	pagination?: PlantSpeciesPaginationInput;
}
