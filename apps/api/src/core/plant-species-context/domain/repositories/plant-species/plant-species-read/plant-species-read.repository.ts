import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const PLANT_SPECIES_READ_REPOSITORY_TOKEN = Symbol(
	'PlantSpeciesReadRepository',
);

export type IPlantSpeciesReadRepository =
	IBaseReadRepository<PlantSpeciesViewModel>;
