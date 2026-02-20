/**
 * Data Transfer Object for updating an existing plant species via command layer.
 *
 * @interface IPlantSpeciesUpdateCommandDto
 */
export interface IPlantSpeciesUpdateCommandDto {
	id: string;
	commonName?: string;
	scientificName?: string;
	family?: string;
	description?: string;
	category?: string;
	difficulty?: string;
	growthRate?: string;
	lightRequirements?: string;
	waterRequirements?: string;
	temperatureRange?: { min: number; max: number };
	humidityRequirements?: string;
	soilType?: string;
	phRange?: { min: number; max: number };
	matureSize?: { height: number; width: number };
	growthTime?: number;
	tags?: string[];
}
