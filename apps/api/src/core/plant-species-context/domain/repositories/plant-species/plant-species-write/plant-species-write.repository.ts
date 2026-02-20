import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';
import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const PLANT_SPECIES_WRITE_REPOSITORY_TOKEN = Symbol(
	'PlantSpeciesWriteRepository',
);

/**
 * Write repository interface for PlantSpecies aggregate.
 * Extends IBaseWriteRepository with additional domain-specific query methods.
 */
export interface IPlantSpeciesWriteRepository
	extends IBaseWriteRepository<PlantSpeciesAggregate> {
	findByScientificName(
		scientificName: PlantSpeciesScientificNameValueObject,
	): Promise<PlantSpeciesAggregate | null>;
	findByCommonName(
		commonName: PlantSpeciesCommonNameValueObject,
	): Promise<PlantSpeciesAggregate | null>;
}
