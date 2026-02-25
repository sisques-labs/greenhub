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
 * Raw plant species response from GraphQL API (dates as strings)
 */
export interface PlantSpeciesApiResponse {
	id: string;
	commonName: string;
	scientificName: string;
	family?: string | null;
	description?: string | null;
	category: PlantSpeciesCategory;
	difficulty: PlantSpeciesDifficulty;
	growthRate: PlantSpeciesGrowthRate;
	lightRequirements: PlantSpeciesLightRequirements;
	waterRequirements: PlantSpeciesWaterRequirements;
	temperatureRange?: PlantSpeciesNumericRange | null;
	humidityRequirements?: PlantSpeciesHumidityRequirements | null;
	soilType?: PlantSpeciesSoilType | null;
	phRange?: PlantSpeciesNumericRange | null;
	matureSize?: PlantSpeciesMatureSize | null;
	growthTime?: number | null;
	tags?: string[] | null;
	isVerified: boolean;
	contributorId?: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * Transformed plant species response with Date objects
 */
export interface PlantSpeciesResponse {
	id: string;
	commonName: string;
	scientificName: string;
	family?: string | null;
	description?: string | null;
	category: PlantSpeciesCategory;
	difficulty: PlantSpeciesDifficulty;
	growthRate: PlantSpeciesGrowthRate;
	lightRequirements: PlantSpeciesLightRequirements;
	waterRequirements: PlantSpeciesWaterRequirements;
	temperatureRange?: PlantSpeciesNumericRange | null;
	humidityRequirements?: PlantSpeciesHumidityRequirements | null;
	soilType?: PlantSpeciesSoilType | null;
	phRange?: PlantSpeciesNumericRange | null;
	matureSize?: PlantSpeciesMatureSize | null;
	growthTime?: number | null;
	tags?: string[] | null;
	isVerified: boolean;
	contributorId?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Raw paginated plant species response from GraphQL API
 */
export interface PlantSpeciesPaginatedApiResponse {
	items: PlantSpeciesApiResponse[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
}

/**
 * Transformed paginated plant species response
 */
export interface PlantSpeciesPaginatedResponse {
	items: PlantSpeciesResponse[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
}

/**
 * Mutation response
 */
export interface PlantSpeciesMutationResponse {
	success: boolean;
	message: string;
	id: string;
}

/**
 * Transform a raw API response to a PlantSpeciesResponse with Date objects
 */
export function transformPlantSpeciesResponse(
	apiResponse: PlantSpeciesApiResponse,
): PlantSpeciesResponse {
	return {
		...apiResponse,
		createdAt: new Date(apiResponse.createdAt),
		updatedAt: new Date(apiResponse.updatedAt),
	};
}

/**
 * Transform a raw paginated API response to a PlantSpeciesPaginatedResponse
 */
export function transformPlantSpeciesPaginatedResponse(
	apiResponse: PlantSpeciesPaginatedApiResponse,
): PlantSpeciesPaginatedResponse {
	return {
		...apiResponse,
		items: apiResponse.items.map(transformPlantSpeciesResponse),
	};
}
