import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const PLANT_SPECIES_READ_REPOSITORY_TOKEN = Symbol(
	'PlantSpeciesReadRepository',
);

/**
 * Read repository interface for PlantSpecies view models.
 * Extends IBaseReadRepository with additional domain-specific query methods.
 */
export interface IPlantSpeciesReadRepository
	extends IBaseReadRepository<PlantSpeciesViewModel> {
	findByCategory(
		category: PlantSpeciesCategoryValueObject,
	): Promise<PlantSpeciesViewModel[]>;
	findByDifficulty(
		difficulty: PlantSpeciesDifficultyValueObject,
	): Promise<PlantSpeciesViewModel[]>;
	findByTags(tags: string[]): Promise<PlantSpeciesViewModel[]>;
	search(query: string): Promise<PlantSpeciesViewModel[]>;
	findVerified(): Promise<PlantSpeciesViewModel[]>;
}
