import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const PLANT_READ_REPOSITORY_TOKEN = Symbol('PlantReadRepository');

/**
 * Type alias for the plant read repository.
 * This repository handles read operations (queries) for plants.
 *
 * @type PlantReadRepository
 */
export type PlantReadRepository = IBaseReadRepository<PlantViewModel>;
