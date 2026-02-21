/**
 * Data Transfer Object for creating a new plant species via command layer.
 *
 * @interface IPlantSpeciesCreateCommandDto
 */
export interface IPlantSpeciesCreateCommandDto {
	commonName: string;
	scientificName: string;
	family?: string;
	description?: string;
	category: string;
	difficulty: string;
	growthRate: string;
	lightRequirements: string;
	waterRequirements: string;
	temperatureRange?: { min: number; max: number };
	humidityRequirements?: string;
	soilType?: string;
	phRange?: { min: number; max: number };
	matureSize?: { height: number; width: number };
	growthTime?: number;
	tags?: string[];
	contributorId?: string;
}
